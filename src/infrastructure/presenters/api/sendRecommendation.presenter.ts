import type { ApiResponse } from '@/types'
import type { SendRecommendationResult } from '@/application/use-cases/dashcam/SendRecommendation/SendRecommendation.dto'

export function presentSendRecommendation(result: SendRecommendationResult): ApiResponse<SendRecommendationResult> {
  return {
    data: result,
    message: '¡Recomendación enviada! Revisá tu email.',
  }
}
