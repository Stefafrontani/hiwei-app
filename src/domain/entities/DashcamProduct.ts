import type { CameraPosition } from '@/domain/value-objects/CameraPosition'
import type { VideoQuality } from '@/domain/value-objects/VideoQuality'

export interface DashcamProduct {
  id: string
  name: string
  description: string
  basePrice: number
  priceFinalDisplay: string
  discount: number
  priceAllCashDisplay: string
  specs: string[]
  tags: string[]
  cameraPositions: CameraPosition[]
  maxQuality: VideoQuality
  cycleSize: number
  ecommerceUrl: string
  includedMemoryCardSize: number | null
}
