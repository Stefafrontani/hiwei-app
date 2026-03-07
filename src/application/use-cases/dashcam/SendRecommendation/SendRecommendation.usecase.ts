import type { ISendRecommendationRepository } from '@/domain/ports/ISendRecommendationRepository'
import type { ILeadRepository } from '@/domain/ports/ILeadRepository'
import { MissingRequiredFieldsError } from '@/domain/errors/MissingRequiredFieldsError'
import { validateEmail } from '@/domain/errors/validators'
import type { SendRecommendationInput, SendRecommendationResult } from './SendRecommendation.dto'

export class SendRecommendationUseCase {
  constructor(
    private readonly repository: ISendRecommendationRepository,
    private readonly leadRepository: ILeadRepository,
  ) {}

  async execute(input: SendRecommendationInput): Promise<SendRecommendationResult> {
    const missing: string[] = []
    if (!input.name.trim()) missing.push('name')
    if (!input.email.trim()) missing.push('email')
    if (missing.length > 0) throw new MissingRequiredFieldsError(missing)

    validateEmail(input.email)

    if (input.optInMarketing) {
      const leadId = await this.leadRepository.upsertByEmail({
        name: input.name.trim(),
        email: input.email.trim(),
        phone: input.phone?.trim() || undefined,
      })
      await this.repository.assignLead(input.recommendationId, leadId)
    }

    // TODO: send email

    return { success: true }
  }
}
