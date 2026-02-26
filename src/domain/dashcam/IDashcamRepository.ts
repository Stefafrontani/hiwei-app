import type { DashcamProduct } from './DashcamProduct'

export interface IDashcamRepository {
  getAll(): DashcamProduct[]
  getById(id: string): DashcamProduct | undefined
}
