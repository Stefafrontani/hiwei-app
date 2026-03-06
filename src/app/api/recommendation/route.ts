import { NextRequest, NextResponse } from 'next/server'
import { SupabaseDashcamRepository } from '@/infrastructure/repositories/supabase/SupabaseDashcamRepository'
import { SupabaseMemoryCardRepository } from '@/infrastructure/repositories/supabase/SupabaseMemoryCardRepository'
import { SupabaseSendRecommendationRepository } from '@/infrastructure/repositories/supabase/SupabaseSendRecommendationRepository'
import { GetRecommendationUseCase } from '@/application/use-cases/dashcam/GetRecommendation/GetRecommendation.usecase'
import { presentRecommendation, presentError } from '@/infrastructure/presenters/api'

export async function POST(request: NextRequest) {
  try {
    const answers = await request.json()
    const useCase = new GetRecommendationUseCase(
      new SupabaseDashcamRepository(),
      new SupabaseMemoryCardRepository(),
      new SupabaseSendRecommendationRepository(),
    )
    const result = await useCase.execute(answers)
    return NextResponse.json(presentRecommendation(result))
  } catch (error) {
    return NextResponse.json(
      presentError(error, 'Error al obtener recomendación'),
      { status: 400 }
    )
  }
}
