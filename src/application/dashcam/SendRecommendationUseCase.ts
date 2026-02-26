import type { SendRecommendationForm } from '@/types/dashcam'
import type { ISendRecommendationRepository } from '@/domain/dashcam/ISendRecommendationRepository'

export class SendRecommendationUseCase {
  constructor(private readonly repository?: ISendRecommendationRepository) {}

  async execute(form: SendRecommendationForm): Promise<{ success: boolean }> {
    if (!form.name.trim() || !form.email.trim()) {
      throw new Error('Nombre y email son obligatorios')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      throw new Error('El email no es válido')
    }
    await this.repository?.save(form)
    return { success: true }
  }
}
