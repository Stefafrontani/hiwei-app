import type { DashcamProduct } from '@/domain/entities/DashcamProduct'
import type { MemoryCard } from '@/domain/entities/MemoryCard'
import type { QuizAnswers } from '@/domain/entities/QuizAnswers'
import type { BudgetItem } from '@/domain/entities/SendRecommendationForm'
import { getRecommendedMemoryCardSize } from '@/domain/services/getRecommendedMemoryCardSize'

const HWK_PRICE = 70000
const INSTALLATION_PRICE = 210000

function parsePrice(display: string): number {
  const cleaned = display.replace(/[^0-9.,]/g, '').replace(/\./g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}

export function buildDefaultBudget(
  product: DashcamProduct,
  answers: QuizAnswers,
  memoryCards: MemoryCard[],
): { items: BudgetItem[]; total: number } {
  const dashcamPrice = parsePrice(product.priceFinalDisplay)
  const items: BudgetItem[] = [{ label: product.name, price: dashcamPrice }]

  let cardPrice = 0

  if (product.includedMemoryCardSize != null) {
    // Scenario 2: memory card included in dashcam price
    items.push({ label: `Memoria incluida (${product.includedMemoryCardSize} GB)`, price: 0 })
  } else {
    // Scenario 1: separate memory card purchase
    const recommendedSize = getRecommendedMemoryCardSize(answers.vehicleUsage)
    const card = memoryCards.find((c) => c.size === recommendedSize) ?? memoryCards[0]
    cardPrice = card ? parsePrice(card.priceFinalDisplay) : 0
    if (card) {
      items.push({ label: `Tarjeta ${card.name}`, price: cardPrice })
    }
  }

  let total = dashcamPrice + cardPrice

  if (answers.parkingMode === 'si') {
    items.push({ label: 'Hardwire Kit (HWK)', price: HWK_PRICE })
    total += HWK_PRICE
  }

  if (answers.installation === 'si') {
    items.push({ label: 'Instalacion profesional', price: INSTALLATION_PRICE })
    total += INSTALLATION_PRICE
  }

  return { items, total }
}
