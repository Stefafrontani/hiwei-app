import type { IGalleryRepository } from '@/domain/ports/IGalleryRepository'
import type { GetGalleryFeedResult } from './GetGalleryFeed.dto'

export class GetGalleryFeedUseCase {
  constructor(private readonly galleryRepo: IGalleryRepository) {}

  async execute(): Promise<GetGalleryFeedResult> {
    const items = await this.galleryRepo.getAll()
    return { items }
  }
}
