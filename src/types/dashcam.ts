export type VehicleType = 'auto' | 'pickup' | 'suv' | 'moto'
export type VideoQuality = 'muy-buena' | 'superior'
export type CameraPosition = 'frontal' | 'frontal-trasera' | 'frontal-trasera-interior'
export type RecordingTime = '1h' | '2h' | '4h' | '8h'
export type Extra = 'filtro-polarizador' | 'control-bluetooth' | 'modo-estacionamiento'
export type Installation = 'si' | 'no'

export interface QuizAnswers {
  vehicleType?: VehicleType
  vehicleYear?: number
  videoQuality?: VideoQuality
  cameraPosition?: CameraPosition
  recordingTime?: RecordingTime
  extras: Extra[]
  installation?: Installation
}

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

export interface DashcamRecommendation {
  product: DashcamProduct
  matchScore: number
  reasons: string[]
}

export interface ContactAdvisorForm {
  name: string
  phone: string
  email: string
  query?: string
}

export interface SendRecommendationForm {
  name: string
  email: string
  phone?: string
}
