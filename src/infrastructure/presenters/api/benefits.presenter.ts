import type { ApiResponse } from '@/types'
import type { RegisterBenefitsResult } from '@/application/use-cases/dashcam/RegisterBenefits/RegisterBenefits.dto'

export function presentBenefits(result: RegisterBenefitsResult): ApiResponse<RegisterBenefitsResult> {
  return {
    data: result,
    message: '¡Ya sos parte! Revisá tu email para ver tus beneficios.',
  }
}
