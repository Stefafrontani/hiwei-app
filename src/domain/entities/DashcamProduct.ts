import type { CameraPosition } from '@/domain/value-objects/CameraPosition'
import type { VideoQuality } from '@/domain/value-objects/VideoQuality'
import type { DashcamVideo } from '@/domain/value-objects/DashcamVideo'

export interface DashcamProduct {
  id: string
  name: string
  description: string
  basePrice: number
  discount: number
  specs: string[]
  tags: string[]
  cameraPositions: CameraPosition[]
  maxQuality: VideoQuality
  cycleSize: number
  ecommerceUrl: string
  includedMemoryCardSize: number | null
  videos: DashcamVideo[]
  stock: number
}
