import type { RegisterBenefitsForm } from '@/application/dashcam/RegisterBenefitsUseCase'

export interface IBenefitsRepository {
  save(form: RegisterBenefitsForm): Promise<void>
}
