# Setup: Sincronización Leads → Brevo

Guía para configurar el pipeline automático que sincroniza cada nuevo lead con Brevo como contacto.

## Arquitectura

```
INSERT en tabla "lead" (Supabase)
  → Database Webhook
    → Edge Function "sync-lead-to-brevo"
      → POST https://api.brevo.com/v3/contacts
```

---

## 1. Crear atributos personalizados en Brevo

En Brevo → Contacts → Settings → Contact Attributes, crear estos atributos si no existen:

| Atributo | Tipo | Notas |
|---|---|---|
| `NOMBRE` | Text | Nombre del lead |
| `TELEFONO` | Text | Teléfono (opcional) |
| `TIPO_VEHICULO` | Text | auto, pickup, suv, moto |
| `PRODUCTO_RECOMENDADO` | Text | Nombre del dashcam recomendado |
| `OPT_IN_MARKETING` | Boolean | Opt-in marketing |
| `FUENTE` | Text | Siempre "cotizador" |

## 2. Crear la lista en Brevo

En Brevo → Contacts → Lists, crear una lista llamada **hiwei_leads**. Anotar el **List ID** numérico (visible en la URL o en los detalles de la lista).

## 3. Obtener la API key de Brevo

En Brevo → Settings → API Keys → generar o copiar una key existente.

## 4. Configurar secrets en Supabase

```bash
supabase secrets set BREVO_API_KEY="tu-api-key-de-brevo"
supabase secrets set BREVO_LIST_ID="123"  # el ID numérico de la lista hiwei_leads
```

> `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` ya están disponibles automáticamente en las Edge Functions.

## 5. Deploy de la Edge Function

```bash
supabase functions deploy sync-lead-to-brevo
```

## 6. Crear el Database Webhook en Supabase

En Supabase Dashboard → Database → Webhooks → Create Webhook:

| Campo | Valor |
|---|---|
| Name | `sync-lead-to-brevo` |
| Table | `lead` |
| Events | `INSERT` |
| Type | Supabase Edge Function |
| Edge Function | `sync-lead-to-brevo` |

---

## Consideraciones

### Idempotencia

El payload a Brevo incluye `updateEnabled: true`, lo que hace un upsert por email. Si el mismo email se envía dos veces, Brevo actualiza el contacto existente en lugar de fallar.

### Tolerancia a fallos

La función siempre responde `200 OK` al webhook de Supabase, incluso ante errores de Brevo. Los errores se loguean en los logs de la Edge Function (Supabase Dashboard → Edge Functions → Logs).

### Testing

Para probar sin datos reales:

```bash
# Invocar la función localmente
supabase functions serve sync-lead-to-brevo

# En otra terminal, simular un webhook
curl -X POST http://localhost:54321/functions/v1/sync-lead-to-brevo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ANON_KEY>" \
  -d '{
    "type": "INSERT",
    "table": "lead",
    "schema": "public",
    "record": {
      "id": "test-uuid",
      "name": "Test User",
      "email": "test@example.com",
      "phone": "+5491112345678",
      "opt_in_marketing": true,
      "source": "recommendation",
      "created_at": "2026-03-17T00:00:00Z"
    },
    "old_record": null
  }'
```
