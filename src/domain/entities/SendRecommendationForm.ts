import type { QuizAnswers } from './QuizAnswers'

export interface BudgetItem {
  label: string
  price: number
}

export interface SendRecommendationForm {
  quizAnswers: QuizAnswers
  recommendedProductId: string
  recommendedProductName: string
  matchScore: number
  budgetItems: BudgetItem[]
  budgetTotal: number
  expiresAt: string
  specs: string[]
  ecommerceUrl: string
}
