import type { MemoryCard } from '@/domain/entities/MemoryCard'

export function getExpandableMemoryCards(includedSize: number, allCards: MemoryCard[]): MemoryCard[] {
  return allCards.filter(card => card.size > includedSize)
}
