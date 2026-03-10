import type { DashcamProduct } from '@/domain/entities/DashcamProduct'
import type { MemoryCard } from '@/domain/entities/MemoryCard'
import type { QuizAnswers } from '@/domain/entities/QuizAnswers'
import type { BudgetItem } from '@/domain/entities/SendRecommendationForm'
import { getRecommendedMemoryCardSize } from '@/domain/services/getRecommendedMemoryCardSize'
import { HWK_PRICE, INSTALLATION_PRICE } from '@/lib/constants'

export function buildDefaultBudget(
  product: DashcamProduct,
  answers: QuizAnswers,
  memoryCards: MemoryCard[],
): { items: BudgetItem[]; total: number } {
  const applyDiscount = (price: number) => Math.round(price * (1 - product.discount))

  const dashcamPrice = applyDiscount(product.basePrice)
  const items: BudgetItem[] = [{ label: product.name, price: dashcamPrice }]

  let cardPrice = 0

  if (product.includedMemoryCardSize != null) {
    items.push({ label: `Memoria incluida (${product.includedMemoryCardSize} GB)`, price: 0 })
  } else {
    const recommendedSize = getRecommendedMemoryCardSize(answers.vehicleUsage)
    const card = memoryCards.find((c) => c.size === recommendedSize) ?? memoryCards[0]
    cardPrice = card ? applyDiscount(card.basePrice) : 0
    if (card) {
      items.push({ label: `Tarjeta ${card.name}`, price: cardPrice })
    }
  }

  let total = dashcamPrice + cardPrice
  console.log(dashcamPrice)
  console.log(cardPrice)

  if (answers.parkingMode === 'si') {
    const hwkPrice = applyDiscount(HWK_PRICE)
    items.push({ label: 'Hardwire Kit (HWK)', price: hwkPrice })
    console.log(hwkPrice)
    total += hwkPrice
  }

  if (answers.installation === 'si') {
    const installPrice = applyDiscount(INSTALLATION_PRICE)
    items.push({ label: 'Instalacion profesional', price: installPrice })
    console.log(installPrice)
    total += installPrice
  }

  console.log(total)
  return { items, total }
}
