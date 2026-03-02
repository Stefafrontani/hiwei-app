import type { ContactAdvisorForm } from '@/domain/entities/ContactAdvisorForm'

export interface IContactRepository {
  save(form: ContactAdvisorForm): Promise<void>
}
