import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

/**
 * Browser-safe Supabase client using the public anon key.
 * Subject to Row Level Security policies.
 * Use for client-side features like realtime subscriptions or public reads.
 */
export const supabaseBrowser = createClient(url, anonKey)
