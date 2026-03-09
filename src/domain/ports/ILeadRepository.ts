import type { LeadSource } from '@/domain/entities/Lead'

export interface ILeadRepository {
  upsertByEmail(data: { name: string; email: string; phone?: string; source: LeadSource }): Promise<string>
}
