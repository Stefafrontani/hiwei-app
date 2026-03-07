import { createServerClient } from '@/infrastructure/supabase/server'
import type { ISendRecommendationRepository } from '@/domain/ports/ISendRecommendationRepository'
import type { SendRecommendationForm } from '@/domain/entities/SendRecommendationForm'

export class SupabaseSendRecommendationRepository implements ISendRecommendationRepository {
  async save(form: SendRecommendationForm): Promise<string> {
    const client = createServerClient()
    const { data, error } = await client
      .from('recommendation_sent')
      .insert({
        quiz_answers: form.quizAnswers,
        recommended_product_id: form.recommendedProductId,
        recommended_product_name: form.recommendedProductName,
        match_score: form.matchScore,
        budget_items: form.budgetItems,
        budget_total: form.budgetTotal,
      })
      .select('id')
      .single()

    if (error || !data) throw new Error(`Failed to save recommendation: ${error?.message}`)
    return data.id
  }

  async assignLead(recommendationId: string, leadId: string): Promise<void> {
    const client = createServerClient()
    const { error } = await client
      .from('recommendation_sent')
      .update({ lead_id: leadId })
      .eq('id', recommendationId)

    if (error) throw new Error(`Failed to assign lead: ${error.message}`)
  }
}
