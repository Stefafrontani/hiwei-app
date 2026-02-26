import { createServerClient } from '@/lib/supabase/server'
import type { ISendRecommendationRepository } from '@/domain/dashcam/ISendRecommendationRepository'
import type { SendRecommendationForm } from '@/types/dashcam'

export class SupabaseSendRecommendationRepository implements ISendRecommendationRepository {
  async save(form: SendRecommendationForm): Promise<void> {
    const client = createServerClient()
    const { error } = await client.from('sent_recommendations').insert({
      name: form.name,
      email: form.email,
      phone: form.phone ?? null,
    })
    if (error) throw new Error(`Failed to save sent recommendation: ${error.message}`)
  }
}
