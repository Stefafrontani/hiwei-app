import { NextRequest, NextResponse } from 'next/server'
import { SendRecommendationUseCase } from '@/application/dashcam/SendRecommendationUseCase'
import type { ApiResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const form = await request.json()
    const useCase = new SendRecommendationUseCase()
    const result = useCase.execute(form)
    return NextResponse.json<ApiResponse<{ success: boolean }>>({
      data: result,
      message: '¡Recomendación enviada! Revisá tu email.',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al enviar recomendación'
    return NextResponse.json<ApiResponse<never>>({ error: message }, { status: 400 })
  }
}
