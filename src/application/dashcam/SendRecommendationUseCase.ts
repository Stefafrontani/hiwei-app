import type { SendRecommendationForm } from '@/types/dashcam'

export class SendRecommendationUseCase {
  execute(form: SendRecommendationForm): { success: boolean } {
    if (!form.name.trim() || !form.email.trim()) {
      throw new Error('Nombre y email son obligatorios')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      throw new Error('El email no es válido')
    }
    // In production: send email with recommendation summary
    console.log('[SendRecommendation] Sending recommendation to:', form.email)
    return { success: true }
  }
}
