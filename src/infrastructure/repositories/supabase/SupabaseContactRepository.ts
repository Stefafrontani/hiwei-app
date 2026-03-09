import { createServerClient } from '@/infrastructure/supabase/server'
import type { IContactRepository } from '@/domain/ports/IContactRepository'
import type { ContactAdvisorForm } from '@/domain/entities/ContactAdvisorForm'

export class SupabaseContactRepository implements IContactRepository {
  async save(form: ContactAdvisorForm): Promise<void> {
    const client = createServerClient()
    const { error } = await client.from('inquiry').insert({
      name: form.name,
      email: form.email,
      phone: form.phone ?? null,
      query: form.query ?? null,
    })
    if (error) throw new Error(`Failed to save inquiry: ${error.message}`)
  }
}
