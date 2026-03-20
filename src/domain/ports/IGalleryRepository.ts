import type { GalleryItem } from '@/domain/entities/GalleryItem'

export interface IGalleryRepository {
  getAll(): Promise<GalleryItem[]>
}
