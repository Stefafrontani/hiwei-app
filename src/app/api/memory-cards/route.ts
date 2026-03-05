import { NextResponse } from 'next/server'
import { SupabaseMemoryCardRepository } from '@/infrastructure/repositories/supabase/SupabaseMemoryCardRepository'
import { presentError } from '@/infrastructure/presenters/api'
import type { ApiResponse } from '@/types'
import type { MemoryCard } from '@/domain/entities/MemoryCard'

export async function GET() {
  try {
    const repository = new SupabaseMemoryCardRepository()
    const cards = await repository.getAll()
    return NextResponse.json({ data: cards } satisfies ApiResponse<MemoryCard[]>)
  } catch (error) {
    return NextResponse.json(presentError(error, 'Error al obtener tarjetas de memoria'), {
      status: 400,
    })
  }
}
