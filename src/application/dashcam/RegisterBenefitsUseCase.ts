import type { IBenefitsRepository } from '@/domain/dashcam/IBenefitsRepository'

export interface RegisterBenefitsForm {
  name: string
  email: string
  phone?: string
}

export class RegisterBenefitsUseCase {
  constructor(private readonly repository?: IBenefitsRepository) {}

  async execute(form: RegisterBenefitsForm): Promise<{ success: boolean }> {
    if (!form.name.trim() || !form.email.trim()) {
      throw new Error('El nombre y email son obligatorios')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      throw new Error('El email no es válido')
    }
    await this.repository?.save(form)
    return { success: true }
  }
}
