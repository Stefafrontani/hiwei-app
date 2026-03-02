import { NextRequest, NextResponse } from 'next/server'
import { RegisterBenefitsUseCase } from '@/application/use-cases/dashcam/RegisterBenefits/RegisterBenefits.usecase'
import { SupabaseBenefitsRepository } from '@/infrastructure/repositories/supabase/SupabaseBenefitsRepository'
import { presentBenefits, presentError } from '@/infrastructure/presenters/api'

export async function POST(request: NextRequest) {
  try {
    const form = await request.json()
    const useCase = new RegisterBenefitsUseCase(new SupabaseBenefitsRepository())
    const result = await useCase.execute(form)
    return NextResponse.json(presentBenefits(result))
  } catch (error) {
    return NextResponse.json(
      presentError(error, 'Error al registrar'),
      { status: 400 }
    )
  }
}
