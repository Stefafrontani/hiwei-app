import type { VehicleType } from '@/domain/value-objects/VehicleType'
import type { VideoQuality } from '@/domain/value-objects/VideoQuality'
import type { CameraPosition } from '@/domain/value-objects/CameraPosition'
import type { RecordingTime } from '@/domain/value-objects/RecordingTime'
import type { Extra } from '@/domain/value-objects/Extra'
import type { Installation } from '@/domain/value-objects/Installation'

export interface QuizAnswers {
  vehicleType?: VehicleType
  vehicleYear?: number
  videoQuality?: VideoQuality
  cameraPosition?: CameraPosition
  recordingTime?: RecordingTime
  extras: Extra[]
  installation?: Installation
}

export function isStepComplete(answers: QuizAnswers, step: number): boolean {
  switch (step) {
    case 1: return !!answers.vehicleType && !!answers.vehicleYear
    case 2: return !!answers.videoQuality
    case 3: return !!answers.cameraPosition
    case 4: return !!answers.recordingTime
    case 5: return true // extras are optional
    case 6: return !!answers.installation
    default: return false
  }
}

export function createEmptyAnswers(): QuizAnswers {
  return { extras: [] }
}
