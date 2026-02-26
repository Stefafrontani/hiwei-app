import type { IDashcamRepository } from './IDashcamRepository'
import type { DashcamProduct } from './DashcamProduct'
import type { QuizAnswers } from './QuizAnswers'

const RECORDING_TIME_ORDER: Record<string, number> = { '1h': 1, '2h': 2, '4h': 4, '8h': 8 }

export interface ScoredProduct {
  product: DashcamProduct
  matchScore: number
  reasons: string[]
}

export class DashcamRecommendationService {
  constructor(private readonly repository: IDashcamRepository) {}

  recommend(answers: QuizAnswers): ScoredProduct {
    return this.recommendAll(answers)[0]
  }

  recommendAll(answers: QuizAnswers): ScoredProduct[] {
    const products = this.repository.getAll()
    const scored = products.map((p) => this.score(p, answers))
    scored.sort((a, b) => b.matchScore - a.matchScore)
    return scored
  }

  private score(product: DashcamProduct, answers: QuizAnswers): ScoredProduct {
    let score = 0
    const reasons: string[] = []

    // Camera position match
    if (answers.cameraPosition && product.cameraPositions.includes(answers.cameraPosition)) {
      score += 30
      const labels: Record<string, string> = {
        'frontal': 'Incluye cámara frontal',
        'frontal-trasera': 'Incluye cámaras frontal y trasera',
        'frontal-trasera-interior': 'Cobertura total: frontal, trasera e interior',
      }
      reasons.push(labels[answers.cameraPosition])
    }

    // Video quality match
    if (answers.videoQuality) {
      if (answers.videoQuality === 'superior' && product.maxQuality === 'superior') {
        score += 20
        reasons.push('Calidad de imagen superior')
      } else if (answers.videoQuality === 'muy-buena') {
        score += 15
        reasons.push('Muy buena calidad de imagen')
      }
    }

    // Recording time match
    if (answers.recordingTime) {
      const needed = RECORDING_TIME_ORDER[answers.recordingTime] ?? 1
      const available = RECORDING_TIME_ORDER[product.maxRecordingTime] ?? 1
      if (available >= needed) {
        score += 20
        reasons.push(`Graba hasta ${product.maxRecordingTime} en bucle`)
      }
    }

    // Extras
    if (answers.extras.includes('modo-estacionamiento') && product.supportsParking) {
      score += 10
      reasons.push('Compatible con modo estacionamiento')
    }
    if (answers.extras.includes('control-bluetooth') && product.supportsBluetooth) {
      score += 5
      reasons.push('Compatible con control Bluetooth')
    }

    // Installation
    if (answers.installation === 'si' && product.supportsInstallation) {
      score += 5
      reasons.push('Instalación profesional disponible')
    }

    return { product, matchScore: Math.min(score, 100), reasons }
  }
}
