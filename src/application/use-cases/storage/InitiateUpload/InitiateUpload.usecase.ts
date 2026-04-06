import type { IStorageRepository } from '@/domain/ports/IStorageRepository'
import type { InitiateUploadInput, InitiateUploadResult } from './InitiateUpload.dto'

export class InitiateUploadUseCase {
  constructor(private readonly storage: IStorageRepository) {}

  async execute(input: InitiateUploadInput): Promise<InitiateUploadResult> {
    if (!input.fileName) throw new Error('fileName is required')
    return this.storage.initiateMultipartUpload(input.fileName, input.contentType ?? 'video/mp4')
  }
}
