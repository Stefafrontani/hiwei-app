import { NextRequest, NextResponse } from 'next/server'
import { SendRecommendationUseCase } from '@/application/use-cases/dashcam/SendRecommendation/SendRecommendation.usecase'
import { SupabaseSendRecommendationRepository } from '@/infrastructure/repositories/supabase/SupabaseSendRecommendationRepository'
import { presentSendRecommendation, presentError } from '@/infrastructure/presenters/api'

export async function POST(request: NextRequest) {
  try {
    const form = await request.json()
    const useCase = new SendRecommendationUseCase(new SupabaseSendRecommendationRepository())
    const result = await useCase.execute(form)
    return NextResponse.json(presentSendRecommendation(result))
  } catch (error) {
    return NextResponse.json(
      presentError(error, 'Error al enviar recomendación'),
      { status: 400 }
    )
  }
}
