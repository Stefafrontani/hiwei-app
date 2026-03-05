import type { MemoryCard } from '@/domain/entities/MemoryCard'

export interface IMemoryCardRepository {
  getAll(): Promise<MemoryCard[]>
}
