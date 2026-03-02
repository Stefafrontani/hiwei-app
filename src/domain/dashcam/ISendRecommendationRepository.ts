import type { SendRecommendationForm } from '@/types/dashcam'

/* Flow: Recommendation - (4): Interface (Domain) */
export interface ISendRecommendationRepository {
  save(form: SendRecommendationForm): Promise<void>
}
