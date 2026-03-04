import type { IDashcamRepository } from '@/domain/ports/IDashcamRepository'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'
import type { QuizAnswers } from '@/domain/entities/QuizAnswers'
import type { VideoQuality } from '@/domain/value-objects/VideoQuality'
import type { CameraPosition } from '@/domain/value-objects/CameraPosition'

export interface ScoredProduct {
  product: DashcamProduct
  matchScore: number
  reasons: string[]
}

const QUALITY_LEVEL: Record<VideoQuality, number> = {
  'buena': 1,
  'muy-buena': 2,
  'superior': 3,
}

const CAMERA_LEVEL: Record<CameraPosition, number> = {
  'frontal': 1,
  'frontal-trasera': 2,
  'frontal-trasera-interior': 3,
}

const MAX_SCORE_PER_DIMENSION = 50
const DEFICIT_PENALTY = 10 // product has LESS than user wants
const EXCESS_PENALTY = 5   // product has MORE than user wants

export class DashcamRecommendationService {
  constructor(private readonly repository: IDashcamRepository) {}

  async recommend(answers: QuizAnswers): Promise<ScoredProduct> {
    return (await this.recommendAll(answers))[0]
  }

  async recommendAll(answers: QuizAnswers): Promise<ScoredProduct[]> {
    const products = await this.repository.getAll()
    const scored = products.map((p) => this.score(p, answers))
    scored.sort((a, b) => b.matchScore - a.matchScore)
    return scored
  }

  private dimensionScore(productLevel: number, userLevel: number): number {
    const distance = productLevel - userLevel
    if (distance === 0) return MAX_SCORE_PER_DIMENSION
    const penalty = distance > 0 ? EXCESS_PENALTY : DEFICIT_PENALTY
    return MAX_SCORE_PER_DIMENSION - Math.abs(distance) * penalty
  }

  private maxCameraLevel(product: DashcamProduct): number {
    return Math.max(...product.cameraPositions.map((pos) => CAMERA_LEVEL[pos]))
  }

  private score(product: DashcamProduct, answers: QuizAnswers): ScoredProduct {
    const reasons: string[] = []

    // Quality dimension (50 points max)
    let qualityScore = MAX_SCORE_PER_DIMENSION
    if (answers.videoQuality) {
      const userLevel = QUALITY_LEVEL[answers.videoQuality]
      const productLevel = QUALITY_LEVEL[product.maxQuality]
      qualityScore = this.dimensionScore(productLevel, userLevel)

      if (productLevel === userLevel) {
        reasons.push('Calidad de imagen exacta a lo que buscás')
      } else if (productLevel > userLevel) {
        reasons.push('Calidad de imagen superior a lo que necesitás')
      } else {
        reasons.push('Calidad de imagen menor a la preferida')
      }
    }

    // Camera position dimension (50 points max)
    let cameraScore = MAX_SCORE_PER_DIMENSION
    if (answers.cameraPosition) {
      const userLevel = CAMERA_LEVEL[answers.cameraPosition]
      const productLevel = this.maxCameraLevel(product)
      cameraScore = this.dimensionScore(productLevel, userLevel)

      const cameraLabels: Record<CameraPosition, string> = {
        'frontal': 'cámara frontal',
        'frontal-trasera': 'cámaras frontal y trasera',
        'frontal-trasera-interior': 'cobertura total (frontal, trasera e interior)',
      }
      if (productLevel === userLevel) {
        reasons.push(`Incluye ${cameraLabels[answers.cameraPosition]}`)
      } else if (productLevel > userLevel) {
        reasons.push('Más cámaras de las que necesitás')
      } else {
        reasons.push('Menos cobertura de cámaras que la preferida')
      }
    }

    return { product, matchScore: qualityScore + cameraScore, reasons }
  }
}
