export interface GetDbHealthResult {
  status: 'ok' | 'error'
  productCount?: number
  detail?: string
}
