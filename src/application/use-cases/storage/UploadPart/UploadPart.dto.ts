import type { UploadedPart } from '@/domain/ports/IStorageRepository'

export interface UploadPartInput {
  key: string
  uploadId: string
  partNumber: number
  body: Buffer
}

export type UploadPartResult = UploadedPart
