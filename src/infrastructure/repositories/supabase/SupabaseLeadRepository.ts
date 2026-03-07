import { createServerClient } from '@/infrastructure/supabase/server'
import type { ILeadRepository } from '@/domain/ports/ILeadRepository'

export class SupabaseLeadRepository implements ILeadRepository {
  async upsertByEmail(data: {
    name: string
    email: string
    phone?: string
  }): Promise<string> {
    const client = createServerClient()
    const { data: row, error } = await client
      .from('lead')
      .upsert(
        {
          name: data.name,
          email: data.email,
          phone: data.phone ?? null,
        },
        { onConflict: 'email' },
      )
      .select('id')
      .single()

    if (error || !row) throw new Error(`Failed to upsert lead: ${error?.message}`)
    return row.id
  }
}
