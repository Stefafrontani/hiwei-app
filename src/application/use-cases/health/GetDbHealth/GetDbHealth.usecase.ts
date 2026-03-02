import type { IDbHealthRepository } from '@/domain/ports/IDbHealthRepository'
import type { GetDbHealthResult } from './GetDbHealth.dto'

export class GetDbHealthUseCase {
  constructor(private readonly repository: IDbHealthRepository) {}

  async execute(): Promise<GetDbHealthResult> {
    const count = await this.repository.countProducts()
    return { status: 'ok', productCount: count }
  }
}
