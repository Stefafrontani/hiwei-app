import type { SendRecommendationForm } from '@/domain/entities/SendRecommendationForm'

export interface ISendRecommendationRepository {
  save(form: SendRecommendationForm): Promise<string>
  assignLead(recommendationId: string, leadId: string): Promise<void>
}
