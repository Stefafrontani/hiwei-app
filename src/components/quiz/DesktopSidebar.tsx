import type { QuizAnswers } from '@/domain/entities/QuizAnswers'
import { buildWhatsAppUrl } from '@/lib/buildWhatsAppUrl'
import { QuizSummarySteps } from './QuizSummarySteps'

interface DesktopSidebarProps {
  currentStep: number
  answers: QuizAnswers
}

export function DesktopSidebar({ currentStep, answers }: DesktopSidebarProps) {
  return (
    <aside className="hidden w-80 shrink-0 flex-col border-l border-border bg-muted/30 md:flex">
      <QuizSummarySteps answers={answers} currentStep={currentStep} />

      {/* Bottom CTA */}
      <div className="mt-auto border-t border-border bg-card p-5">
        <a
          href={buildWhatsAppUrl({ answers, currentStep })}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-[46px] w-full items-center justify-center gap-2 rounded-[10px] bg-whatsapp text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </aside>
  )
}
