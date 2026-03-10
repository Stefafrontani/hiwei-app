import { createServerClient } from '@/infrastructure/supabase/server'
import type { IMemoryCardRepository } from '@/domain/ports/IMemoryCardRepository'
import type { MemoryCard } from '@/domain/entities/MemoryCard'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToMemoryCard(row: Record<string, any>): MemoryCard {
  return {
    id: row.id as number,
    size: row.size as number,
    name: row.name as string,
    basePrice: row.base_price as number,
  }
}

export class SupabaseMemoryCardRepository implements IMemoryCardRepository {
  async getAll(): Promise<MemoryCard[]> {
    const client = createServerClient()
    const { data, error } = await client
      .from('memory_card')
      .select('*')
      .order('size', { ascending: true })

    if (error) throw new Error(`Failed to fetch memory cards: ${error.message}`)
    return (data ?? []).map(rowToMemoryCard)
  }
}
