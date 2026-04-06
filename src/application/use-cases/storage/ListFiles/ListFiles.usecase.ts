import type { IStorageRepository } from '@/domain/ports/IStorageRepository'
import type { ListFilesResult } from './ListFiles.dto'

export class ListFilesUseCase {
  constructor(private readonly storage: IStorageRepository) {}

  async execute(): Promise<ListFilesResult> {
    return this.storage.listFiles()
  }
}
