import type { IDashcamRepository } from '@/domain/ports/IDashcamRepository'
import type { GetDashcamByIdResult } from './GetDashcamById.dto'

export class GetDashcamByIdUseCase {
  constructor(private readonly repository: IDashcamRepository) {}

  async execute(id: string): Promise<GetDashcamByIdResult> {
    return this.repository.getById(id)
  }
}
