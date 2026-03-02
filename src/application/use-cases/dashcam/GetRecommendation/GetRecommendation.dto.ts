import type { ScoredProduct } from '@/domain/services/DashcamRecommendationService'

export interface RecommendationResult {
  main: ScoredProduct
  alternatives: ScoredProduct[]
}
