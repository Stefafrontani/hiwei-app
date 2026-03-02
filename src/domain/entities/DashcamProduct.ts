import type { CameraPosition } from '@/domain/value-objects/CameraPosition'
import type { VideoQuality } from '@/domain/value-objects/VideoQuality'
import type { RecordingTime } from '@/domain/value-objects/RecordingTime'

export interface DashcamProduct {
  id: string
  name: string
  brand: string
  description: string
  price: number
  priceDisplay: string
  rating: number
  reviewCount: number
  specs: string[]
  features: string[]
  tags: string[]
  cameraPositions: CameraPosition[]
  maxQuality: VideoQuality
  maxRecordingTime: RecordingTime
  supportsParking: boolean
  supportsBluetooth: boolean
  supportsInstallation: boolean
}
