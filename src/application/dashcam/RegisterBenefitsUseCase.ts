export interface RegisterBenefitsForm {
  name: string
  email: string
  phone?: string
}

export class RegisterBenefitsUseCase {
  execute(form: RegisterBenefitsForm): { success: boolean } {
    if (!form.name.trim() || !form.email.trim()) {
      throw new Error('El nombre y email son obligatorios')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      throw new Error('El email no es válido')
    }
    // In production: register in CRM/email marketing service
    console.log('[RegisterBenefits] New registration:', form)
    return { success: true }
  }
}
