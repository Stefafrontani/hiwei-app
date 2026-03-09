import type { IContactRepository } from '@/domain/ports/IContactRepository'
import type { ContactAdvisorForm } from '@/domain/entities/ContactAdvisorForm'
import { MissingRequiredFieldsError } from '@/domain/errors/MissingRequiredFieldsError'
import { validateEmail } from '@/domain/errors/validators'
import { RegisterLeadUseCase } from '@/application/use-cases/dashcam/RegisterLead/RegisterLead.usecase'
import type { ContactAdvisorResult } from './ContactAdvisor.dto'

export class ContactAdvisorUseCase {
  constructor(
    private readonly repository: IContactRepository,
    private readonly registerLeadUseCase: RegisterLeadUseCase,
  ) {}

  async execute(form: ContactAdvisorForm): Promise<ContactAdvisorResult> {
    const missing: string[] = []
    if (!form.name.trim()) missing.push('name')
    if (!form.email.trim()) missing.push('email')
    if (missing.length > 0) throw new MissingRequiredFieldsError(missing)

    validateEmail(form.email)

    await this.repository.save(form)

    if (form.optInMarketing) {
      await this.registerLeadUseCase.execute({
        name: form.name,
        email: form.email,
        phone: form.phone,
        source: 'consult',
      })
    }

    return { success: true }
  }
}
