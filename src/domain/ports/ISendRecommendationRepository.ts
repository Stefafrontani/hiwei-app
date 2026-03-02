import type { SendRecommendationForm } from '@/domain/entities/SendRecommendationForm'

export interface ISendRecommendationRepository {
  save(form: SendRecommendationForm): Promise<void>
}
