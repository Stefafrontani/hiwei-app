export interface ILeadRepository {
  upsertByEmail(data: { name: string; email: string; phone?: string }): Promise<string>
}
