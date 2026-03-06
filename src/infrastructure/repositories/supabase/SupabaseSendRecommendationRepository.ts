import { createServerClient } from '@/infrastructure/supabase/server'
import type { ISendRecommendationRepository } from '@/domain/ports/ISendRecommendationRepository'
import type { SendRecommendationForm } from '@/domain/entities/SendRecommendationForm'

export class SupabaseSendRecommendationRepository implements ISendRecommendationRepository {
  async save(form: SendRecommendationForm): Promise<void> {
    const client = createServerClient()
    const { error } = await client.from('recommendation_sent').insert({
      name: form.name ?? null,
      email: form.email ?? null,
      phone: form.phone ?? null,
      quiz_answers: form.quizAnswers,
      recommended_product_id: form.recommendedProductId,
      recommended_product_name: form.recommendedProductName,
      match_score: form.matchScore,
      budget_items: form.budgetItems,
      budget_total: form.budgetTotal,
    })
    if (error) throw new Error(`Failed to save sent recommendation: ${error.message}`)
  }
}
