import { NextRequest, NextResponse } from 'next/server'
import { RegisterBenefitsUseCase } from '@/application/dashcam/RegisterBenefitsUseCase'
import { SupabaseBenefitsRepository } from '@/infrastructure/dashcam/SupabaseBenefitsRepository'
import type { ApiResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const form = await request.json()
    const useCase = new RegisterBenefitsUseCase(new SupabaseBenefitsRepository())
    const result = await useCase.execute(form)
    return NextResponse.json<ApiResponse<{ success: boolean }>>({
      data: result,
      message: '¡Ya sos parte! Revisá tu email para ver tus beneficios.',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al registrar'
    return NextResponse.json<ApiResponse<never>>({ error: message }, { status: 400 })
  }
}
