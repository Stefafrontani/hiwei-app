import type { DashcamProduct } from './DashcamProduct'

export interface IDashcamRepository {
  getAll(): Promise<DashcamProduct[]>
  getById(id: string): Promise<DashcamProduct | undefined>
}
