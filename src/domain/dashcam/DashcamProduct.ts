import type { CameraPosition, VideoQuality, RecordingTime } from '@/types/dashcam'

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
