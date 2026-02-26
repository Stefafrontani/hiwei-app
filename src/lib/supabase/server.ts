import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client with the service role key.
 * Use ONLY in server-side code (API routes, Server Components).
 * The service role key bypasses Row Level Security — never expose to the browser.
 */
export function createServerClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      'Missing Supabase env vars. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local'
    )
  }
  return createClient(url, key, {
    auth: { persistSession: false },
  })
}
