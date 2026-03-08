import { NextRequest, NextResponse } from 'next/server'
import { RegisterLeadUseCase } from '@/application/use-cases/dashcam/RegisterLead/RegisterLead.usecase'
import { SupabaseLeadRepository } from '@/infrastructure/repositories/supabase/SupabaseLeadRepository'
import { presentError } from '@/infrastructure/presenters/api'
import type { ApiResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const input = await request.json()
    const useCase = new RegisterLeadUseCase(new SupabaseLeadRepository())
    await useCase.execute(input)

    const response: ApiResponse<{ success: boolean }> = {
      data: { success: true },
      message: '¡Ya sos parte! Revisá tu email para ver tus beneficios.',
    }
    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      presentError(error, 'Error al registrar'),
      { status: 400 }
    )
  }
}
