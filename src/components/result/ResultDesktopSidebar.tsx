'use client'

import { Headphones, Send, RotateCcw } from 'lucide-react'
import { DesktopSidebar } from '@/components/layout/DesktopSidebar'
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
      <DesktopSidebar>
        {/* Quiz Summary */}
        {answers && <QuizSummarySteps answers={answers} />}

        {/* CTAs */}
        <div className="flex flex-col gap-3 border-t border-white/[0.06] p-6">
          <div className="flex flex-col gap-1">
            <p className="text-[14px] font-bold text-foreground">¿Cómo podemos ayudarte?</p>
            <p className="text-[12px] leading-relaxed text-muted-foreground">
              Elegí una opción para continuar.
            </p>
          </div>

          <button
            type="button"
            onClick={onContactOpen}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand/80 text-[14px] font-bold text-brand-foreground transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
          >
            <Headphones className="h-4 w-4" />
            ¿Tenés dudas? Escribinos
          </button>

          <button
            type="button"
            onClick={onSendOpen}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-brand/50 bg-brand/5 text-[14px] font-semibold text-brand transition-all duration-200 hover:bg-brand/10 active:scale-[0.98]"
          >
            <Send className="h-4 w-4" />
            Recibir recomendación por mail
          </button>

          <div className="flex flex-col items-center gap-1.5 pt-2 text-center">
            <p className="text-[12px] text-muted-foreground/60">¿No es lo que buscabas?</p>
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex cursor-pointer items-center gap-1.5 text-[12px] font-medium text-muted-foreground/60 transition-colors hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Empezar de nuevo
            </button>
          </div>
        </div>
      </DesktopSidebar>

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
