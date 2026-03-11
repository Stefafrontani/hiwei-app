import type { IMemoryCardRepository } from '@/domain/ports/IMemoryCardRepository'
import type { MemoryCard } from '@/domain/entities/MemoryCard'

const MEMORY_CARDS: MemoryCard[] = [
  {
    id: 1,
    size: 32,
    name: '32 GB',
    basePrice: 35000,
  },
  {
    id: 2,
    size: 64,
    name: '64 GB',
    basePrice: 50000,
  },
  {
    id: 3,
    size: 128,
    name: '128 GB',
    basePrice: 86000,
  },
  {
    id: 4,
    size: 256,
    name: '256 GB',
    basePrice: 140000,
  },
  {
    id: 5,
    size: 512,
    name: '512 GB',
    basePrice: 270000,
  },
]

export class InMemoryMemoryCardRepository implements IMemoryCardRepository {
  async getAll(): Promise<MemoryCard[]> {
    return Promise.resolve(MEMORY_CARDS)
  }
}
