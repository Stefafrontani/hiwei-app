import { NextRequest, NextResponse } from 'next/server'
import { SendRecommendationUseCase } from '@/application/use-cases/dashcam/SendRecommendation/SendRecommendation.usecase'
import { SupabaseSendRecommendationRepository } from '@/infrastructure/repositories/supabase/SupabaseSendRecommendationRepository'
import { SupabaseLeadRepository } from '@/infrastructure/repositories/supabase/SupabaseLeadRepository'
import { presentSendRecommendation, presentError } from '@/infrastructure/presenters/api'

export async function POST(request: NextRequest) {
  try {
    const input = await request.json()
    const useCase = new SendRecommendationUseCase(
      new SupabaseSendRecommendationRepository(),
      new SupabaseLeadRepository(),
    )
    const result = await useCase.execute(input)
    return NextResponse.json(presentSendRecommendation(result))
  } catch (error) {
    return NextResponse.json(
      presentError(error, 'Error al enviar recomendación'),
      { status: 400 }
    )
  }
}
