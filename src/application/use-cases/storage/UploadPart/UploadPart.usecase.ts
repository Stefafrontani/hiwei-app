import type { IStorageRepository } from '@/domain/ports/IStorageRepository'
import type { UploadPartInput, UploadPartResult } from './UploadPart.dto'

export class UploadPartUseCase {
  constructor(private readonly storage: IStorageRepository) {}

  async execute(input: UploadPartInput): Promise<UploadPartResult> {
    if (!input.key || !input.uploadId || !input.partNumber || !input.body) {
      throw new Error('key, uploadId, partNumber, and body are required')
    }
    return this.storage.uploadPart(input.key, input.uploadId, input.partNumber, input.body)
  }
}
