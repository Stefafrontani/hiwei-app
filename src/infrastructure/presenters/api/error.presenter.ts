import type { ApiResponse } from '@/types'

export function presentError(error: unknown, fallbackMessage: string): ApiResponse<never> {
  return { error: error instanceof Error ? error.message : fallbackMessage }
}
