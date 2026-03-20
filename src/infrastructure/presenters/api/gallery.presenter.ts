import type { ApiResponse } from '@/types'
import type { GalleryItem } from '@/domain/entities/GalleryItem'

export function presentGalleryFeed(items: GalleryItem[]): ApiResponse<GalleryItem[]> {
  return { data: items }
}
