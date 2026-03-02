import type { ApiResponse } from '@/types'
import type { GetDbHealthResult } from '@/application/use-cases/health/GetDbHealth/GetDbHealth.dto'

export function presentDbHealth(result: GetDbHealthResult): ApiResponse<GetDbHealthResult> {
  return { data: result, message: 'Database connection successful' }
}

export function presentDbHealthError(detail: string): ApiResponse<GetDbHealthResult> {
  return { data: { status: 'error', detail }, error: 'Database connection failed' }
}
