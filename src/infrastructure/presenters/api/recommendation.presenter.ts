import type { ApiResponse } from '@/types'
import type { RecommendationResult } from '@/application/use-cases/dashcam/GetRecommendation/GetRecommendation.dto'

export function presentRecommendation(result: RecommendationResult): ApiResponse<RecommendationResult> {
  return { data: result }
}
