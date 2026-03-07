export interface SendRecommendationInput {
  recommendationId: string
  name: string
  email: string
  phone?: string
  optInMarketing?: boolean
}

export interface SendRecommendationResult {
  success: boolean
}
