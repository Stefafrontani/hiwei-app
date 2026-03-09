import { NextRequest, NextResponse } from 'next/server'
import { RegisterLeadUseCase } from '@/application/use-cases/dashcam/RegisterLead/RegisterLead.usecase'
import { SupabaseLeadRepository } from '@/infrastructure/repositories/supabase/SupabaseLeadRepository'
import { SupabaseSendRecommendationRepository } from '@/infrastructure/repositories/supabase/SupabaseSendRecommendationRepository'
import { ResendEmailService } from '@/infrastructure/email/ResendEmailService'
import { presentError } from '@/infrastructure/presenters/api'
import type { ApiResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { recommendationId, ...leadInput } = await request.json()
    const useCase = new RegisterLeadUseCase(new SupabaseLeadRepository(), new ResendEmailService())
    const leadId = await useCase.execute({ ...leadInput, source: 'benefits' as const })

    if (recommendationId) {
      const recommendationRepo = new SupabaseSendRecommendationRepository()
      await recommendationRepo.assignLead(recommendationId, leadId)
    }

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
