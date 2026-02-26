import type { ContactAdvisorForm } from '@/types/dashcam'
import type { IContactRepository } from '@/domain/dashcam/IContactRepository'

export class ContactAdvisorUseCase {
  constructor(private readonly repository?: IContactRepository) {}

  async execute(form: ContactAdvisorForm): Promise<{ success: boolean }> {
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      throw new Error('Todos los campos obligatorios deben completarse')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      throw new Error('El email no es válido')
    }
    await this.repository?.save(form)
    return { success: true }
  }
}
