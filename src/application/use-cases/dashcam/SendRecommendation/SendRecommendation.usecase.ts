import type { ISendRecommendationRepository } from '@/domain/ports/ISendRecommendationRepository'
import type { SendRecommendationForm } from '@/domain/entities/SendRecommendationForm'
import { validateEmail } from '@/domain/errors/validators'
import type { SendRecommendationResult } from './SendRecommendation.dto'

export class SendRecommendationUseCase {
  constructor(private readonly repository: ISendRecommendationRepository) {}

  async execute(form: SendRecommendationForm): Promise<SendRecommendationResult> {
    if (form.email?.trim()) {
      validateEmail(form.email)
    }

    await this.repository.save(form)
    return { success: true }
  }
}
