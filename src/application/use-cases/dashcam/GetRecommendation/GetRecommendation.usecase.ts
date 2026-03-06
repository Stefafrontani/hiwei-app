import { DashcamRecommendationService } from '@/domain/services/DashcamRecommendationService'
import { buildDefaultBudget } from '@/domain/services/buildDefaultBudget'
import type { IDashcamRepository } from '@/domain/ports/IDashcamRepository'
import type { IMemoryCardRepository } from '@/domain/ports/IMemoryCardRepository'
import type { ISendRecommendationRepository } from '@/domain/ports/ISendRecommendationRepository'
import type { QuizAnswers } from '@/domain/entities/QuizAnswers'
import type { RecommendationResult } from './GetRecommendation.dto'

export class GetRecommendationUseCase {
  private readonly service: DashcamRecommendationService

  constructor(
    repository: IDashcamRepository,
    private readonly memoryCardRepository: IMemoryCardRepository,
    private readonly sendRecommendationRepository: ISendRecommendationRepository,
  ) {
    this.service = new DashcamRecommendationService(repository)
  }

  async execute(answers: QuizAnswers): Promise<RecommendationResult> {
    const [all, memoryCards] = await Promise.all([
      this.service.recommendAll(answers),
      this.memoryCardRepository.getAll(),
    ])

    const result: RecommendationResult = {
      main: all[0],
      alternatives: all.slice(1, 4),
    }

    // Auto-save recommendation (fire-and-forget)
    const { product } = result.main
    const budget = buildDefaultBudget(product, answers, memoryCards)
    this.sendRecommendationRepository
      .save({
        quizAnswers: answers,
        recommendedProductId: product.id,
        recommendedProductName: product.name,
        matchScore: result.main.matchScore,
        budgetItems: budget.items,
        budgetTotal: budget.total,
      })
      .catch(() => {})

    return result
  }
}
