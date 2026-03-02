import type { RegisterBenefitsForm } from '@/domain/entities/RegisterBenefitsForm'

export interface IBenefitsRepository {
  save(form: RegisterBenefitsForm): Promise<void>
}
