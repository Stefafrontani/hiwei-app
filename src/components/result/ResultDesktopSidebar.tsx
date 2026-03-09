'use client'

import Link from 'next/link'
import { Gift, Headphones, Send, RotateCcw } from 'lucide-react'
import { ContactMethodOverlay } from '@/components/overlays/ContactMethodOverlay'
import { SendRecommendationOverlay } from '@/components/overlays/SendRecommendationOverlay'
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
      <aside className="hidden w-[360px] shrink-0 flex-col border-l border-border bg-card md:flex">
        {/* Top content */}
        <div className="flex flex-1 flex-col gap-4 p-7">
          <div className="flex flex-col gap-1">
            <p className="text-[16px] font-bold text-foreground">¿Qué querés hacer?</p>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              Elegí una opción para continuar con tu experiencia Hiwei.
            </p>
          </div>

          {/* CTA Beneficios */}
          <div className="flex flex-col gap-1.5">
            <Link
              href="/beneficios"
              className="flex h-[54px] w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-b from-brand to-brand/90 text-[15px] font-bold text-white transition-opacity hover:opacity-90"
            >
              <Gift className="h-5 w-5" />
              Obtener beneficios exclusivos
            </Link>
            <p className="text-[11px] text-muted-foreground">
              Accedé a descuentos, ofertas, prioridad en stock, noticias y más.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-muted" />

          {/* Contact CTA */}
          <button
            onClick={onContactOpen}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-brand bg-card text-[14px] font-semibold text-brand transition-colors hover:bg-brand/10"
          >
            <Headphones className="h-4 w-4" />
            Consultanos
          </button>

          {/* Send CTA */}
          <button
            onClick={onSendOpen}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card text-[14px] font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            <Send className="h-4 w-4" />
            Enviarme la recomendación
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4">
          <button
            onClick={onRestart}
            className="flex w-full items-center justify-center gap-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Empezar de nuevo
          </button>
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
