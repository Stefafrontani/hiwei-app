import type { QuizAnswers } from '@/domain/entities/QuizAnswers'
import { QuizSummarySteps } from './QuizSummarySteps'

interface DesktopSidebarProps {
  currentStep: number
  answers: QuizAnswers
}

export function DesktopSidebar({ currentStep, answers }: DesktopSidebarProps) {
  return (
    <aside className="hidden w-[340px] shrink-0 flex-col md:flex glass-card border-l border-white/5 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand/5 via-transparent to-transparent" />
      <div className="relative flex flex-1 flex-col">
        <QuizSummarySteps answers={answers} currentStep={currentStep} />
      </div>
    </aside>
  )
}
