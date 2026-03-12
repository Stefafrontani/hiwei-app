import type { ScoredProduct } from '@/domain/services/DashcamRecommendationService'

export interface RecommendationResult {
  recommendationId: string
  main: ScoredProduct
  alternatives: ScoredProduct[]
  expiresAt: string
}
