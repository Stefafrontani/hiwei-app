import type { VehicleType, VideoQuality, CameraPosition, RecordingTime, Extra, Installation } from '@/types/dashcam'

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
