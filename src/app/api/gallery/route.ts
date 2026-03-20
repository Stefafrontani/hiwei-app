import { NextResponse } from 'next/server'
import { InMemoryGalleryRepository } from '@/infrastructure/repositories/mock/InMemoryGalleryRepository'
import { GetGalleryFeedUseCase } from '@/application/use-cases/gallery/GetGalleryFeed/GetGalleryFeed.usecase'
import { presentGalleryFeed, presentError } from '@/infrastructure/presenters/api'

export async function GET() {
  try {
    const useCase = new GetGalleryFeedUseCase(new InMemoryGalleryRepository())
    const result = await useCase.execute()
    return NextResponse.json(presentGalleryFeed(result.items))
  } catch (error) {
    return NextResponse.json(
      presentError(error, 'Error al obtener galería'),
      { status: 500 }
    )
  }
}
