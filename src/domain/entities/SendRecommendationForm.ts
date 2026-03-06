import type { QuizAnswers } from './QuizAnswers'

export interface BudgetItem {
  label: string
  price: number
}

export interface SendRecommendationForm {
  name?: string
  email?: string
  phone?: string
  quizAnswers: QuizAnswers
  recommendedProductId: string
  recommendedProductName: string
  matchScore: number
  budgetItems: BudgetItem[]
  budgetTotal: number
}
