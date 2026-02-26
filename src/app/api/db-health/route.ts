import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import type { ApiResponse } from '@/types'

interface DbHealthResult {
  status: 'ok' | 'error'
  productCount?: number
  detail?: string
}

/**
 * GET /api/db-health
 * Smoke test: verifies Supabase connectivity and runs a simple query.
 */
export async function GET() {
  try {
    const client = createServerClient()
    const { count, error } = await client
      .from('dashcam_products')
      .select('*', { count: 'exact', head: true })

    if (error) throw new Error(error.message)

    return NextResponse.json<ApiResponse<DbHealthResult>>({
      data: { status: 'ok', productCount: count ?? 0 },
      message: 'Database connection successful',
    })
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json<ApiResponse<DbHealthResult>>(
      { data: { status: 'error', detail }, error: 'Database connection failed' },
      { status: 503 }
    )
  }
}
