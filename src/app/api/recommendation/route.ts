import { NextRequest, NextResponse } from 'next/server'
import { SupabaseDashcamRepository } from '@/infrastructure/dashcam/SupabaseDashcamRepository'
import { GetRecommendationUseCase, type RecommendationResult } from '@/application/dashcam/GetRecommendationUseCase'
import type { ApiResponse } from '@/types'

/* Flow: Recommendation - (2): Driving Adapter (Route Handler) */
export async function POST(request: NextRequest) {
  try {
    const answers = await request.json()
    const useCase = new GetRecommendationUseCase(
      new SupabaseDashcamRepository()
    )
    const result = await useCase.execute(answers)
    return NextResponse.json<ApiResponse<RecommendationResult>>({ data: result })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener recomendación'
    return NextResponse.json<ApiResponse<never>>({ error: message }, { status: 400 })
  }
}
