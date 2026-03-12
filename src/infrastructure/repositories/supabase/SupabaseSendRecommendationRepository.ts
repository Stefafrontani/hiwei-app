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
        expires_at: form.expiresAt,
      })
      .select('id')
      .single()

    if (error || !data) throw new Error(`Failed to save recommendation: ${error?.message}`)
    return data.id
  }

  async findById(id: string): Promise<SendRecommendationForm | null> {
    const client = createServerClient()
    const { data, error } = await client
      .from('recommendation_sent')
      .select('quiz_answers, recommended_product_id, recommended_product_name, match_score, budget_items, budget_total, expires_at')
      .eq('id', id)
      .single()

    if (error || !data) return null

    return {
      quizAnswers: data.quiz_answers,
      recommendedProductId: data.recommended_product_id,
      recommendedProductName: data.recommended_product_name,
      matchScore: data.match_score,
      budgetItems: data.budget_items,
      budgetTotal: data.budget_total,
      expiresAt: data.expires_at,
    }
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
