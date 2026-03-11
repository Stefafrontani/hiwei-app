import type { ILeadRepository } from '@/domain/ports/ILeadRepository'
import type { IEmailService } from '@/domain/ports/IEmailService'
import type { LeadSource } from '@/domain/entities/Lead'
import { MissingRequiredFieldsError } from '@/domain/errors/MissingRequiredFieldsError'
import { validateEmail } from '@/domain/errors/validators'
import { buildWelcomeLeadEmail } from '@/infrastructure/email/buildWelcomeLeadEmail'
import { DISCOUNT_CODE } from '@/lib/constants'

export class RegisterLeadUseCase {
  constructor(
    private readonly leadRepository: ILeadRepository,
    private readonly emailService: IEmailService,
  ) {}

  async execute(input: { name: string; email: string; phone?: string; source?: LeadSource }): Promise<string> {
    const source = input.source ?? 'other'
    const missing: string[] = []
    if (!input.name?.trim()) missing.push('name')
    if (!input.email?.trim()) missing.push('email')
    if (missing.length > 0) throw new MissingRequiredFieldsError(missing)

    validateEmail(input.email)

    const leadId = await this.leadRepository.upsertByEmail({
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone?.trim() || undefined,
      source,
    })

    const html = buildWelcomeLeadEmail({ recipientName: input.name.trim(), discountCode: DISCOUNT_CODE })
    await this.emailService.send({
      to: input.email.trim(),
      subject: '¡Bienvenido a Hiwei! Acá tenés tu descuento',
      html,
    })

    return leadId
  }
}
