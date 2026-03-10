import type { IMemoryCardRepository } from '@/domain/ports/IMemoryCardRepository'
import type { MemoryCard } from '@/domain/entities/MemoryCard'

const MEMORY_CARDS: MemoryCard[] = [
  {
    id: 1,
    size: 32,
    name: '32 GB',
    priceDisplay: '$ 1.000 ARS',
    priceFinalDisplay: '$ 1.000 ARS',
    priceAllCashDisplay: '$ 900 ARS',
  },
  {
    id: 2,
    size: 64,
    name: '64 GB',
    priceDisplay: '$ 64.000 ARS',
    priceFinalDisplay: '$ 64.000 ARS',
    priceAllCashDisplay: '$ 58.000 ARS',
  },
  {
    id: 3,
    size: 128,
    name: '128 GB',
    priceDisplay: '$ 128.000 ARS',
    priceFinalDisplay: '$ 128.000 ARS',
    priceAllCashDisplay: '$ 115.000 ARS',
  },
  {
    id: 4,
    size: 256,
    name: '256 GB',
    priceDisplay: '$ 256.000 ARS',
    priceFinalDisplay: '$ 256.000 ARS',
    priceAllCashDisplay: '$ 230.000 ARS',
  },
  {
    id: 5,
    size: 512,
    name: '512 GB',
    priceDisplay: '$ 512.000 ARS',
    priceFinalDisplay: '$ 512.000 ARS',
    priceAllCashDisplay: '$ 470.000 ARS',
  },
]

export class InMemoryMemoryCardRepository implements IMemoryCardRepository {
  async getAll(): Promise<MemoryCard[]> {
    return Promise.resolve(MEMORY_CARDS)
  }
}
