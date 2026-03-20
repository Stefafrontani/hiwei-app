import { NextResponse } from 'next/server'
import { InMemoryDashcamRepository } from '@/infrastructure/repositories/mock/InMemoryDashcamRepository'
import { presentError } from '@/infrastructure/presenters/api'
import type { ApiResponse } from '@/types'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'

export async function GET() {
  try {
    const repo = new InMemoryDashcamRepository()
    const products = await repo.getAll()
    const response: ApiResponse<DashcamProduct[]> = { data: products }
    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      presentError(error, 'Error al obtener galería'),
      { status: 500 }
    )
  }
}
