'use client'

import { useState } from 'react'
import { Headphones, Send, MessageCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContactAdvisorOverlay } from '@/components/overlays/ContactAdvisorOverlay'
import { SendRecommendationOverlay } from '@/components/overlays/SendRecommendationOverlay'

interface ResultCTAsProps {
  onRestart?: () => void
}

export function ResultCTAs({ onRestart }: ResultCTAsProps) {
  const [showContact, setShowContact] = useState(false)
  const [showSend, setShowSend] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-3">
        <Button
          onClick={() => setShowContact(true)}
          className="flex h-12 w-full items-center gap-2 rounded-xl bg-[#2563EB] text-[14px] font-semibold hover:bg-[#1D4ED8]"
        >
          <Headphones className="h-4 w-4" />
          Contactar con un asesor
        </Button>

        <Button
          onClick={() => setShowSend(true)}
          variant="outline"
          className="flex h-12 w-full items-center gap-2 rounded-xl border-[#E4E4E7] text-[14px] font-semibold text-[#18181B] hover:bg-[#F4F4F5]"
        >
          <Send className="h-4 w-4" />
          Enviarme la recomendación
        </Button>

        <a
          href="https://wa.me/5491100000000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          <MessageCircle className="h-4 w-4" />
          Consultar por WhatsApp
        </a>

        {onRestart && (
          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-1.5 text-[12px] text-[#A1A1AA] transition-colors hover:text-[#71717A]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Empezar de nuevo
          </button>
        )}
      </div>

      <ContactAdvisorOverlay open={showContact} onClose={() => setShowContact(false)} />
      <SendRecommendationOverlay open={showSend} onClose={() => setShowSend(false)} />
    </>
  )
}
