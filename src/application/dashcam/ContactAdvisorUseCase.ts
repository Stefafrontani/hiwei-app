import type { ContactAdvisorForm } from '@/types/dashcam'

export class ContactAdvisorUseCase {
  execute(form: ContactAdvisorForm): { success: boolean } {
    // Validate required fields
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      throw new Error('Todos los campos obligatorios deben completarse')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      throw new Error('El email no es válido')
    }
    // In production: send to CRM/email service
    console.log('[ContactAdvisor] New contact request:', form)
    return { success: true }
  }
}
