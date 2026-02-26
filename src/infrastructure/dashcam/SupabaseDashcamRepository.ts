import { createServerClient } from '@/lib/supabase/server'
import type { IDashcamRepository } from '@/domain/dashcam/IDashcamRepository'
import type { DashcamProduct } from '@/domain/dashcam/DashcamProduct'
import type { CameraPosition, VideoQuality, RecordingTime } from '@/types/dashcam'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProduct(row: Record<string, any>): DashcamProduct {
  return {
    id: row.id as string,
    name: row.name as string,
    brand: row.brand as string,
    description: row.description as string,
    price: row.price as number,
    priceDisplay: row.price_display as string,
    rating: Number(row.rating),
    reviewCount: row.review_count as number,
    specs: row.specs as string[],
    features: row.features as string[],
    tags: row.tags as string[],
    cameraPositions: row.camera_positions as CameraPosition[],
    maxQuality: row.max_quality as VideoQuality,
    maxRecordingTime: row.max_recording_time as RecordingTime,
    supportsParking: row.supports_parking as boolean,
    supportsBluetooth: row.supports_bluetooth as boolean,
    supportsInstallation: row.supports_installation as boolean,
  }
}

export class SupabaseDashcamRepository implements IDashcamRepository {
  async getAll(): Promise<DashcamProduct[]> {
    const client = createServerClient()
    const { data, error } = await client
      .from('dashcam_products')
      .select('*')
      .order('price', { ascending: true })

    if (error) throw new Error(`Failed to fetch products: ${error.message}`)
    return (data ?? []).map(rowToProduct)
  }

  async getById(id: string): Promise<DashcamProduct | undefined> {
    const client = createServerClient()
    const { data, error } = await client
      .from('dashcam_products')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw new Error(`Failed to fetch product: ${error.message}`)
    return data ? rowToProduct(data) : undefined
  }
}
