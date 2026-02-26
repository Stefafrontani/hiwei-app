import { DashcamRecommendationService, type ScoredProduct } from '@/domain/dashcam/DashcamRecommendationService'
import type { IDashcamRepository } from '@/domain/dashcam/IDashcamRepository'
import type { QuizAnswers } from '@/domain/dashcam/QuizAnswers'

export interface RecommendationResult {
  main: ScoredProduct
  alternatives: ScoredProduct[]
}

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
