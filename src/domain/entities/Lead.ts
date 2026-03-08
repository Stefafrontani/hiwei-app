export type LeadSource = 'benefits' | 'recommendation' | 'other'

export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  source: LeadSource
}
