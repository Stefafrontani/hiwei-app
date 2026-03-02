import type { DashcamProduct } from '@/domain/entities/DashcamProduct'

export interface IDashcamRepository {
  getAll(): Promise<DashcamProduct[]>
  getById(id: string): Promise<DashcamProduct | undefined>
}
