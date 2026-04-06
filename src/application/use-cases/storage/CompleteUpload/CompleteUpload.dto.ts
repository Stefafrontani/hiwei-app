import type { UploadedPart } from '@/domain/ports/IStorageRepository'

export interface CompleteUploadInput {
  key: string
  uploadId: string
  parts: UploadedPart[]
}

export interface CompleteUploadResult {
  url: string
}
