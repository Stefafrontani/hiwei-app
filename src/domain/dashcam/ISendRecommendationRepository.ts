import type { SendRecommendationForm } from '@/types/dashcam'

export interface ISendRecommendationRepository {
  save(form: SendRecommendationForm): Promise<void>
}
