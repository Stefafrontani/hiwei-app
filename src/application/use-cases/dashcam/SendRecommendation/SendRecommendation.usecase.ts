import type { ISendRecommendationRepository } from '@/domain/ports/ISendRecommendationRepository'
import type { SendRecommendationForm } from '@/domain/entities/SendRecommendationForm'
import { MissingRequiredFieldsError } from '@/domain/errors/MissingRequiredFieldsError'
import { validateEmail } from '@/domain/errors/validators'
import type { SendRecommendationResult } from './SendRecommendation.dto'

export class SendRecommendationUseCase {
  constructor(private readonly repository: ISendRecommendationRepository) {}

  async execute(form: SendRecommendationForm): Promise<SendRecommendationResult> {
    const missing: string[] = []
    if (!form.name.trim()) missing.push('name')
    if (!form.email.trim()) missing.push('email')
    if (missing.length > 0) throw new MissingRequiredFieldsError(missing)

    validateEmail(form.email)

    await this.repository.save(form)
    return { success: true }
  }
}
