import type { MultipartUploadInit } from '@/domain/ports/IStorageRepository'

export interface InitiateUploadInput {
  fileName: string
  contentType?: string
}

export type InitiateUploadResult = MultipartUploadInit
