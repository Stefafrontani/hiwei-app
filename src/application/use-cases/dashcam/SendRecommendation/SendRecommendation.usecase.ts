import type { ISendRecommendationRepository } from '@/domain/ports/ISendRecommendationRepository'
import type { ILeadRepository } from '@/domain/ports/ILeadRepository'
import type { IEmailService } from '@/domain/ports/IEmailService'
import { MissingRequiredFieldsError } from '@/domain/errors/MissingRequiredFieldsError'
import { validateEmail } from '@/domain/errors/validators'
import { buildRecommendationEmail } from '@/infrastructure/email/buildRecommendationEmail'
import type { SendRecommendationInput, SendRecommendationResult } from './SendRecommendation.dto'

export class SendRecommendationUseCase {
  constructor(
    private readonly repository: ISendRecommendationRepository,
    private readonly leadRepository: ILeadRepository,
    private readonly emailService: IEmailService,
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

    const recommendation = await this.repository.findById(input.recommendationId)
    if (!recommendation) throw new Error('Recommendation not found')

    const html = buildRecommendationEmail({
      recipientName: input.name.trim(),
      productName: recommendation.recommendedProductName,
      matchScore: recommendation.matchScore,
      budgetItems: recommendation.budgetItems,
      budgetTotal: recommendation.budgetTotal,
    })

    await this.emailService.send({
      to: input.email.trim(),
      subject: `Tu recomendación personalizada de dashcam – ${recommendation.recommendedProductName}`,
      html,
    })

    return { success: true }
  }
}
