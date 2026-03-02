import type { IContactRepository } from '@/domain/ports/IContactRepository'
import type { ContactAdvisorForm } from '@/domain/entities/ContactAdvisorForm'
import { MissingRequiredFieldsError } from '@/domain/errors/MissingRequiredFieldsError'
import { validateEmail } from '@/domain/errors/validators'
import type { ContactAdvisorResult } from './ContactAdvisor.dto'

export class ContactAdvisorUseCase {
  constructor(private readonly repository: IContactRepository) {}

  async execute(form: ContactAdvisorForm): Promise<ContactAdvisorResult> {
    const missing: string[] = []
    if (!form.name.trim()) missing.push('name')
    if (!form.phone.trim()) missing.push('phone')
    if (!form.email.trim()) missing.push('email')
    if (missing.length > 0) throw new MissingRequiredFieldsError(missing)

    validateEmail(form.email)

    await this.repository.save(form)
    return { success: true }
  }
}
