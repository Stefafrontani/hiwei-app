import type { ContactAdvisorForm } from '@/types/dashcam'

export interface IContactRepository {
  save(form: ContactAdvisorForm): Promise<void>
}
