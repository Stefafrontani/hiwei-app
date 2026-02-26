import { NextRequest, NextResponse } from 'next/server'
import { ContactAdvisorUseCase } from '@/application/dashcam/ContactAdvisorUseCase'
import { SupabaseContactRepository } from '@/infrastructure/dashcam/SupabaseContactRepository'
import type { ApiResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const form = await request.json()
    const useCase = new ContactAdvisorUseCase(new SupabaseContactRepository())
    const result = await useCase.execute(form)
    return NextResponse.json<ApiResponse<{ success: boolean }>>({
      data: result,
      message: '¡Solicitud enviada! Un asesor te va a contactar a la brevedad.',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al enviar solicitud'
    return NextResponse.json<ApiResponse<never>>({ error: message }, { status: 400 })
  }
}
