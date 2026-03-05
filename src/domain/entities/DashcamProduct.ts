import type { CameraPosition } from '@/domain/value-objects/CameraPosition'
import type { VideoQuality } from '@/domain/value-objects/VideoQuality'

export interface DashcamProduct {
  id: string
  name: string
  description: string
  priceDisplay: string
  priceFinalDisplay: string
  discount: string | null
  priceAllCashDisplay: string
  specs: string[]
  features: string[]
  tags: string[]
  cameraPositions: CameraPosition[]
  maxQuality: VideoQuality
  cycleSize: number
}
