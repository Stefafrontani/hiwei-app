import type { IDashcamRepository } from '@/domain/ports/IDashcamRepository'
import type { GetAllDashcamsResult } from './GetAllDashcams.dto'

export class GetAllDashcamsUseCase {
  constructor(private readonly repository: IDashcamRepository) {}

  async execute(): Promise<GetAllDashcamsResult> {
    return this.repository.getAll()
  }
}
