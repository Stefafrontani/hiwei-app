import { createServerClient } from '@/infrastructure/supabase/server'
import type { IMemoryCardRepository } from '@/domain/ports/IMemoryCardRepository'
import type { MemoryCard } from '@/domain/entities/MemoryCard'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToMemoryCard(row: Record<string, any>): MemoryCard {
  return {
    id: row.id as number,
    size: row.size as number,
    name: row.name as string,
    priceDisplay: row.price_display as string,
    priceFinalDisplay: row.price_final_display as string,
    discount: row.discount as number,
    priceAllCashDisplay: row.price_all_cash_display as string,
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
