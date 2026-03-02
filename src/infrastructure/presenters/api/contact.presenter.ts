import type { ApiResponse } from '@/types'
import type { ContactAdvisorResult } from '@/application/use-cases/dashcam/ContactAdvisor/ContactAdvisor.dto'

export function presentContact(result: ContactAdvisorResult): ApiResponse<ContactAdvisorResult> {
  return {
    data: result,
    message: '¡Solicitud enviada! Un asesor te va a contactar a la brevedad.',
  }
}
