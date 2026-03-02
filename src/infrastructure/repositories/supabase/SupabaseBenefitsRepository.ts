import { createServerClient } from '@/infrastructure/supabase/server'
import type { IBenefitsRepository } from '@/domain/ports/IBenefitsRepository'
import type { RegisterBenefitsForm } from '@/domain/entities/RegisterBenefitsForm'

export class SupabaseBenefitsRepository implements IBenefitsRepository {
  async save(form: RegisterBenefitsForm): Promise<void> {
    const client = createServerClient()
    const { error } = await client.from('benefits_registrations').insert({
      name: form.name,
      email: form.email,
      phone: form.phone ?? null,
    })
    if (error) throw new Error(`Failed to save benefits registration: ${error.message}`)
  }
}
