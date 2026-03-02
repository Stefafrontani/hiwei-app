import { createServerClient } from '@/infrastructure/supabase/server'
import type { IDbHealthRepository } from '@/domain/ports/IDbHealthRepository'

export class SupabaseDbHealthRepository implements IDbHealthRepository {
  async countProducts(): Promise<number> {
    const client = createServerClient()
    const { count, error } = await client
      .from('dashcam_products')
      .select('*', { count: 'exact', head: true })

    if (error) throw new Error(`Failed to count products: ${error.message}`)
    return count ?? 0
  }
}
