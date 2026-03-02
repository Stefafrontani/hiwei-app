import { DashcamRecommendationService } from '@/domain/services/DashcamRecommendationService'
import type { IDashcamRepository } from '@/domain/ports/IDashcamRepository'
import type { QuizAnswers } from '@/domain/entities/QuizAnswers'
import type { RecommendationResult } from './GetRecommendation.dto'

export class GetRecommendationUseCase {
  private readonly service: DashcamRecommendationService

  constructor(repository: IDashcamRepository) {
    this.service = new DashcamRecommendationService(repository)
  }

  async execute(answers: QuizAnswers): Promise<RecommendationResult> {
    const all = await this.service.recommendAll(answers)
    return {
      main: all[0],
      alternatives: all.slice(1, 4),
    }
  }
}
