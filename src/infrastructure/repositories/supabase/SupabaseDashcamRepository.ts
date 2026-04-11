import { createServerClient } from '@/infrastructure/supabase/server'
import type { IDashcamRepository } from '@/domain/ports/IDashcamRepository'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'
import type { CameraPosition } from '@/domain/value-objects/CameraPosition'
import type { VideoQuality } from '@/domain/value-objects/VideoQuality'
import type { DashcamVideo } from '@/domain/value-objects/DashcamVideo'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProduct(row: Record<string, any>): DashcamProduct {
  return {
    id: row.id as string,
    name: row.name as string,
    description: row.description as string,
    basePrice: row.base_price as number,
    discount: row.discount as number,
    specs: row.specs as string[],
    tags: row.tags as string[],
    cameraPositions: row.camera_positions as CameraPosition[],
    maxQuality: row.max_quality as VideoQuality,
    cycleSize: row.cycle_size as number,
    ecommerceUrl: (row.ecommerce_url as string),
    includedMemoryCardSize: (row.included_memory_card_size as number) ?? null,
    videos: (row.videos as DashcamVideo[]) ?? [],
    stock: row.stock as number,
  }
}

export class SupabaseDashcamRepository implements IDashcamRepository {
  async getAll(): Promise<DashcamProduct[]> {
    const client = createServerClient()
    const { data, error } = await client
      .from('dashcam')
      .select('*')
      .order('base_price', { ascending: true })

    if (error) throw new Error(`Failed to fetch products: ${error.message}`)
    return (data ?? []).map(rowToProduct)
  }

  async getById(id: string): Promise<DashcamProduct | undefined> {
    const client = createServerClient()
    const { data, error } = await client
      .from('dashcam')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw new Error(`Failed to fetch product: ${error.message}`)
    return data ? rowToProduct(data) : undefined
  }
}
