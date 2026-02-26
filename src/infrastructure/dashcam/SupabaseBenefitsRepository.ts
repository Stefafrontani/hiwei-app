import { createServerClient } from '@/lib/supabase/server'
import type { IBenefitsRepository } from '@/domain/dashcam/IBenefitsRepository'
import type { RegisterBenefitsForm } from '@/application/dashcam/RegisterBenefitsUseCase'

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
