import type { IStorageRepository } from '@/domain/ports/IStorageRepository'
import type { CompleteUploadInput, CompleteUploadResult } from './CompleteUpload.dto'

export class CompleteUploadUseCase {
  constructor(private readonly storage: IStorageRepository) {}

  async execute(input: CompleteUploadInput): Promise<CompleteUploadResult> {
    if (!input.key || !input.uploadId || !input.parts?.length) {
      throw new Error('key, uploadId, and parts are required')
    }
    const url = await this.storage.completeMultipartUpload(input.key, input.uploadId, input.parts)
    return { url }
  }
}
