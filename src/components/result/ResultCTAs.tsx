'use client'

import { useState } from 'react'
import { Headphones, Send, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContactMethodOverlay } from '@/components/overlays/ContactMethodOverlay'
import { SendRecommendationOverlay } from '@/components/overlays/SendRecommendationOverlay'
import type { QuizAnswers } from '@/domain/entities/QuizAnswers'

interface ResultCTAsProps {
  onRestart?: () => void
  answers?: QuizAnswers
  productName?: string
}

export function ResultCTAs({ onRestart, answers, productName }: ResultCTAsProps) {
  const [showContact, setShowContact] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [showSend, setShowSend] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-3">
        <Button
          onClick={() => setShowContact(true)}
          variant="brand"
          className="flex h-12 w-full items-center gap-2 rounded-xl text-[14px] font-semibold"
        >
          <Headphones className="h-4 w-4" />
          Consultanos
        </Button>

        <Button
          onClick={() => setShowSend(true)}
          variant="outline"
          className="flex h-12 w-full items-center gap-2 rounded-xl text-[14px] font-semibold"
        >
          <Send className="h-4 w-4" />
          Enviarme la recomendación
        </Button>

        {onRestart && (
          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Empezar de nuevo
          </button>
        )}
      </div>

      <ContactMethodOverlay
        open={showContact}
        onClose={() => setShowContact(false)}
        showEmailForm={showEmailForm}
        onEmailFormOpen={() => setShowEmailForm(true)}
        onEmailFormClose={() => setShowEmailForm(false)}
        whatsAppProps={{ answers, productName }}
      />
      <SendRecommendationOverlay open={showSend} onClose={() => setShowSend(false)} />
    </>
  )
}
