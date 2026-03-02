import type { IBenefitsRepository } from '@/domain/ports/IBenefitsRepository'
import type { RegisterBenefitsForm } from '@/domain/entities/RegisterBenefitsForm'
import { MissingRequiredFieldsError } from '@/domain/errors/MissingRequiredFieldsError'
import { validateEmail } from '@/domain/errors/validators'
import type { RegisterBenefitsResult } from './RegisterBenefits.dto'

export class RegisterBenefitsUseCase {
  constructor(private readonly repository: IBenefitsRepository) {}

  async execute(form: RegisterBenefitsForm): Promise<RegisterBenefitsResult> {
    const missing: string[] = []
    if (!form.name.trim()) missing.push('name')
    if (!form.email.trim()) missing.push('email')
    if (missing.length > 0) throw new MissingRequiredFieldsError(missing)

    validateEmail(form.email)

    await this.repository.save(form)
    return { success: true }
  }
}
