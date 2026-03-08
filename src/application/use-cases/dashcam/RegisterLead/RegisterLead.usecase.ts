import type { ILeadRepository } from '@/domain/ports/ILeadRepository'
import type { LeadSource } from '@/domain/entities/Lead'
import { MissingRequiredFieldsError } from '@/domain/errors/MissingRequiredFieldsError'
import { validateEmail } from '@/domain/errors/validators'

export class RegisterLeadUseCase {
  constructor(private readonly leadRepository: ILeadRepository) {}

  async execute(input: { name: string; email: string; phone?: string; source?: LeadSource }): Promise<string> {
    const source = input.source ?? 'other'
    const missing: string[] = []
    if (!input.name?.trim()) missing.push('name')
    if (!input.email?.trim()) missing.push('email')
    if (missing.length > 0) throw new MissingRequiredFieldsError(missing)

    validateEmail(input.email)

    return this.leadRepository.upsertByEmail({
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone?.trim() || undefined,
      source,
    })
  }
}
