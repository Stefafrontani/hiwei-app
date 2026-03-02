import { NextRequest, NextResponse } from 'next/server'
import { ContactAdvisorUseCase } from '@/application/use-cases/dashcam/ContactAdvisor/ContactAdvisor.usecase'
import { SupabaseContactRepository } from '@/infrastructure/repositories/supabase/SupabaseContactRepository'
import { presentContact, presentError } from '@/infrastructure/presenters/api'

export async function POST(request: NextRequest) {
  try {
    const form = await request.json()
    const useCase = new ContactAdvisorUseCase(new SupabaseContactRepository())
    const result = await useCase.execute(form)
    return NextResponse.json(presentContact(result))
  } catch (error) {
    return NextResponse.json(
      presentError(error, 'Error al enviar solicitud'),
      { status: 400 }
    )
  }
}
