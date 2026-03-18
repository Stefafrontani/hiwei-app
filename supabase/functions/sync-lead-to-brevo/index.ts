// Supabase Edge Function: sync-lead-to-brevo
// Triggered by Database Webhook on INSERT into the "lead" table.
// Maps lead data to Brevo contact format and upserts via REST API.
// Always responds 200 to prevent Supabase webhook retries.
// Uses raw fetch (no SDK imports) — runs on Deno runtime provided by Supabase.

const BREVO_API_URL = "https://api.brevo.com/v3/contacts";

interface LeadPayload {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  opt_in_marketing: boolean;
  source: string | null;
  created_at: string;
}

interface WebhookBody {
  type: "INSERT";
  table: string;
  schema: string;
  record: LeadPayload;
  old_record: null;
}

// @ts-ignore: Deno global is available at runtime in Supabase Edge Functions
Deno.serve(async (req: Request) => {
  try {
    // @ts-ignore: Deno.env available at runtime
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    // @ts-ignore: Deno.env available at runtime
    const brevoListId = Deno.env.get("BREVO_LIST_ID");

    if (!brevoApiKey || !brevoListId) {
      console.error("Missing secrets: BREVO_API_KEY or BREVO_LIST_ID");
      return new Response("OK", { status: 200 });
    }

    const body: WebhookBody = await req.json();
    const lead = body.record;

    if (!lead?.email) {
      console.error("Webhook payload missing email", body);
      return new Response("OK", { status: 200 });
    }

    // --- Try to fetch linked recommendation via Supabase REST API (PostgREST) ---
    let vehicleType = "";
    let recommendedProduct = "";

    try {
      // @ts-ignore: Deno.env available at runtime
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      // @ts-ignore: Deno.env available at runtime
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

      if (supabaseUrl && supabaseServiceKey) {
        const url =
          `${supabaseUrl}/rest/v1/recommendation_sent` +
          `?lead_id=eq.${lead.id}` +
          `&select=recommended_product_name,quiz_answers` +
          `&order=created_at.desc` +
          `&limit=1`;

        const res = await fetch(url, {
          headers: {
            apikey: supabaseServiceKey,
            Authorization: `Bearer ${supabaseServiceKey}`,
          },
        });

        if (res.ok) {
          const rows = await res.json();
          if (rows.length > 0) {
            recommendedProduct = rows[0].recommended_product_name ?? "";
            vehicleType = rows[0].quiz_answers?.vehicleType ?? "";
          }
        }
      }
    } catch (err) {
      // Non-blocking: recommendation data is best-effort
      console.warn("Could not fetch recommendation data:", err);
    }

    // --- Upsert contact in Brevo ---
    const listId = parseInt(brevoListId, 10);

    const brevoPayload = {
      email: lead.email,
      attributes: {
        NAME: lead.name,
        PHONE: lead.phone ?? "",
        VEHICLE_TYPE: vehicleType,
        DASHCAM_RECOMMENDED: recommendedProduct,
        OPT_IN_MARKETING: lead.opt_in_marketing,
        SOURCE: "cotizador",
      },
      listIds: [listId],
      updateEnabled: true,
    };

    const brevoRes = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "api-key": brevoApiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(brevoPayload),
    });

    if (!brevoRes.ok) {
      const errBody = await brevoRes.text();
      console.error(`Brevo API error ${brevoRes.status}: ${errBody}`);
    } else {
      console.log(`Lead synced to Brevo: ${lead.email}`);
    }
  } catch (err) {
    // Catch-all: never let the webhook fail
    console.error("Unhandled error in sync-lead-to-brevo:", err);
  }

  // Always 200 to prevent Supabase retries
  return new Response("OK", { status: 200 });
});
