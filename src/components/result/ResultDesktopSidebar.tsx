'use client'

import { LayoutList, Check, Headphones, Send, RotateCcw } from 'lucide-react'
import { ContactMethodOverlay } from '@/components/overlays/ContactMethodOverlay'
import { SendRecommendationOverlay } from '@/components/overlays/SendRecommendationOverlay'
import type { QuizAnswers } from '@/domain/entities/QuizAnswers'

const STEP_CONFIG = [
  { step: 1, label: 'Vehículo', getSummary: (a: QuizAnswers) => a.vehicleType ? `${a.vehicleType.charAt(0).toUpperCase() + a.vehicleType.slice(1)} · Año: ${a.vehicleYear ?? '—'}` : '—' },
  { step: 2, label: 'Calidad de grabación', getSummary: (a: QuizAnswers) => a.videoQuality ? (a.videoQuality === 'muy-buena' ? 'Muy buena' : a.videoQuality === 'buena' ? 'Buena' : 'Superior') : '—' },
  { step: 3, label: 'Cantidad de cámaras', getSummary: (a: QuizAnswers) => {
    const labels: Record<number, string> = { 1: 'Solo frontal', 2: 'Frontal + Trasera', 3: 'Frontal + Trasera + Interior' }
    return a.cameraPositions?.length ? labels[a.cameraPositions.length] ?? `${a.cameraPositions.length} cámaras` : '—'
  }},
  { step: 4, label: 'Uso del vehículo', getSummary: (a: QuizAnswers) => {
    const labels: Record<string, string> = { commute: 'Ir al trabajo', work_tool: 'Herramienta de trabajo', recreational: 'Paseo / recreativo', other: 'No sé / Otro' }
    return a.vehicleUsage ? labels[a.vehicleUsage] ?? a.vehicleUsage : '—'
  }},
  { step: 5, label: 'Modo estacionamiento', getSummary: (a: QuizAnswers) => a.parkingMode === 'si' ? 'Sí' : a.parkingMode === 'no' ? 'No' : '—' },
  { step: 6, label: 'Instalación', getSummary: (a: QuizAnswers) => a.installation === 'si' ? 'Con instalación' : a.installation === 'no' ? 'Sin instalación' : '—' },
]

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
        <div className="flex items-center gap-2 border-b border-border bg-card px-6 py-5">
          <LayoutList className="h-4 w-4 text-brand" />
          <span className="text-[14px] font-semibold text-foreground">Resumen</span>
        </div>

        <div className="flex flex-col gap-1 overflow-y-auto p-3">
          {answers && STEP_CONFIG.map(({ step, label, getSummary }) => {
            const summary = getSummary(answers)
            return (
              <div
                key={step}
                className="flex flex-col gap-1.5 rounded-lg border border-border bg-card px-3.5 py-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase text-brand">
                    {label}
                  </span>
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-brand">
                    <Check className="h-2.5 w-2.5 text-white" />
                  </div>
                </div>
                <span className="text-[12px] font-medium text-muted-foreground">
                  {summary}
                </span>
              </div>
            )
          })}
        </div>

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
