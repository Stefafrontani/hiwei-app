'use client'

import { Headphones, Send, RotateCcw } from 'lucide-react'
import { ContactMethodOverlay } from '@/components/overlays/ContactMethodOverlay'
import { SendRecommendationOverlay } from '@/components/overlays/SendRecommendationOverlay'
import { QuizSummarySteps } from '@/components/quiz/QuizSummarySteps'
import type { QuizAnswers } from '@/domain/entities/QuizAnswers'

interface ResultDesktopSidebarProps {
  showContact: boolean
  showSend: boolean
  showEmailForm: boolean
  onContactOpen: () => void
  onContactClose: () => void
  onEmailFormOpen: () => void
  onEmailFormClose: () => void
  onSendOpen: () => void
  onSendClose: () => void
  onRestart: () => void
  recommendationId?: string | null
  answers?: QuizAnswers
  productName?: string
}

export function ResultDesktopSidebar({
  showContact,
  showSend,
  showEmailForm,
  onContactOpen,
  onContactClose,
  onEmailFormOpen,
  onEmailFormClose,
  onSendOpen,
  onSendClose,
  onRestart,
  recommendationId,
  answers,
  productName,
}: ResultDesktopSidebarProps) {
  return (
    <>
      <aside className="hidden w-[360px] shrink-0 flex-col border-l border-border bg-muted/30 md:flex">
        {/* Section 1: Quiz Summary */}
        {answers && <QuizSummarySteps answers={answers} />}

        {/* Section 2: CTAs */}
        <div className="flex flex-col gap-3 border-t border-border bg-card p-6">
          <div className="flex flex-col gap-1">
            <p className="text-[14px] font-bold text-foreground">¿Cómo podemos ayudarte?</p>
            <p className="text-[12px] leading-relaxed text-muted-foreground">
              Elegí una opción para continuar.
            </p>
          </div>

          <button
            onClick={onContactOpen}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-brand bg-card text-[14px] font-semibold text-brand transition-colors hover:bg-brand/10"
          >
            <Headphones className="h-4 w-4" />
            ¿Tenés dudas? Escribinos
          </button>

          <button
            onClick={onSendOpen}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card text-[14px] font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            <Send className="h-4 w-4" />
            Recibir recomendación por mail
          </button>

          <div className="flex flex-col items-center gap-1.5 pt-2 text-center">
            <p className="text-[12px] text-muted-foreground">¿No es lo que buscabas?</p>
            <button
              onClick={onRestart}
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-foreground transition-colors hover:text-brand"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Empezar de nuevo
            </button>
          </div>
        </div>
      </aside>

      <ContactMethodOverlay
        open={showContact}
        onClose={onContactClose}
        showEmailForm={showEmailForm}
        onEmailFormOpen={onEmailFormOpen}
        onEmailFormClose={onEmailFormClose}
        whatsAppProps={{ answers, productName }}
      />
      <SendRecommendationOverlay open={showSend} onClose={onSendClose} recommendationId={recommendationId} />
    </>
  )
}
