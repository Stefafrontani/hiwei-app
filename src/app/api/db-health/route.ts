import { NextResponse } from 'next/server'
import { SupabaseDbHealthRepository } from '@/infrastructure/repositories/supabase/SupabaseDbHealthRepository'
import { GetDbHealthUseCase } from '@/application/use-cases/health/GetDbHealth/GetDbHealth.usecase'
import { presentDbHealth, presentDbHealthError } from '@/infrastructure/presenters/api'

/**
 * GET /api/db-health
 * Smoke test: verifies Supabase connectivity and runs a simple query.
 */
export async function GET() {
  try {
    const useCase = new GetDbHealthUseCase(new SupabaseDbHealthRepository())
    const result = await useCase.execute()
    return NextResponse.json(presentDbHealth(result))
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(presentDbHealthError(detail), { status: 503 })
  }
}
