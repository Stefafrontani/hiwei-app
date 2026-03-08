import { NextRequest, NextResponse } from 'next/server'
import { SupabaseLeadRepository } from '@/infrastructure/repositories/supabase/SupabaseLeadRepository'
import { MissingRequiredFieldsError } from '@/domain/errors/MissingRequiredFieldsError'
import { validateEmail } from '@/domain/errors/validators'
import { presentError } from '@/infrastructure/presenters/api'
import type { ApiResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone } = await request.json()

    const missing: string[] = []
    if (!name?.trim()) missing.push('name')
    if (!email?.trim()) missing.push('email')
    if (missing.length > 0) throw new MissingRequiredFieldsError(missing)

    validateEmail(email)

    const leadRepo = new SupabaseLeadRepository()
    await leadRepo.upsertByEmail({ name, email, phone })

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
