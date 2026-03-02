import type { ApiResponse } from '@/types'
import type { HealthStatus } from '@/domain/entities/HealthStatus'
import type { GetHealthResult } from '@/application/use-cases/health/GetHealth/GetHealth.dto'

export function presentHealth(result: GetHealthResult): ApiResponse<HealthStatus> {
  return { data: result.healthStatus, message: result.message }
}
