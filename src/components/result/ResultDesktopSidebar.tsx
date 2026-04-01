'use client'

import { Headphones, Send, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DesktopSidebar } from '@/components/layout/DesktopSidebar'
import { QuizSummarySteps } from '@/components/quiz/QuizSummarySteps'
import type { QuizAnswers } from '@/domain/entities/QuizAnswers'

interface ResultDesktopSidebarProps {
  onContactOpen: () => void
  onSendOpen: () => void
  onRestart: () => void
  answers?: QuizAnswers
}

export function ResultDesktopSidebar({
  onContactOpen,
  onSendOpen,
  onRestart,
  answers,
}: ResultDesktopSidebarProps) {
  return (
    <DesktopSidebar>
      {answers && <QuizSummarySteps answers={answers} />}

      <div className="flex flex-col gap-3 border-t border-white/[0.06] p-6">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold text-foreground">¿Cómo podemos ayudarte?</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Elegí una opción para continuar.
          </p>
        </div>

        <Button variant="brand" size="xl" className="w-full" onClick={onContactOpen}>
          <Headphones className="h-4 w-4" />
          ¿Tenés dudas? Escribinos
        </Button>

        <Button variant="outline" size="xl" className="w-full" onClick={onSendOpen}>
          <Send className="h-4 w-4" />
          Recibir recomendación por mail
        </Button>

        <div className="flex flex-col items-center gap-1.5 pt-2 text-center">
          <p className="text-xs text-muted-foreground/60">¿No es lo que buscabas?</p>
          <Button variant="ghost" size="sm" onClick={onRestart} className="text-muted-foreground/60 hover:text-foreground">
            <RotateCcw className="h-3.5 w-3.5" />
            Empezar de nuevo
          </Button>
        </div>
      </div>
    </DesktopSidebar>
  )
}
