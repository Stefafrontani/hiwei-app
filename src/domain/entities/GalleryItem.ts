import type { CameraPosition } from '@/domain/value-objects/CameraPosition'

export interface GalleryVideo {
  youtubeId: string
  label: string
  cameraPosition: CameraPosition
  durationSeconds: number
  thumbnailUrl: string
}

export interface GalleryItem {
  id: string
  productId: string
  productName: string
  description: string
  specBadges: string[]
  highlightBadge?: string
  videos: GalleryVideo[]
  cameraPositions: CameraPosition[]
  displayOrder: number
  layout: 'featured' | 'compact' | 'wide'
  ecommerceUrl: string
}
