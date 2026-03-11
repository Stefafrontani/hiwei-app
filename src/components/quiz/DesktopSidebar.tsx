import type { QuizAnswers } from '@/domain/entities/QuizAnswers'
import { QuizSummarySteps } from './QuizSummarySteps'

interface DesktopSidebarProps {
  currentStep: number
  answers: QuizAnswers
}

export function DesktopSidebar({ currentStep, answers }: DesktopSidebarProps) {
  return (
    <aside className="hidden w-80 shrink-0 flex-col border-l border-border bg-muted/30 md:flex">
      <QuizSummarySteps answers={answers} currentStep={currentStep} />
    </aside>
  )
}
