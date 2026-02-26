'use client'

import Link from 'next/link'
import { Gift, Headphones, Send, RotateCcw } from 'lucide-react'
import { ContactAdvisorOverlay } from '@/components/overlays/ContactAdvisorOverlay'
import { SendRecommendationOverlay } from '@/components/overlays/SendRecommendationOverlay'

interface ResultDesktopSidebarProps {
  showContact: boolean
  showSend: boolean
  onContactOpen: () => void
  onContactClose: () => void
  onSendOpen: () => void
  onSendClose: () => void
  onRestart: () => void
}

export function ResultDesktopSidebar({
  showContact,
  showSend,
  onContactOpen,
  onContactClose,
  onSendOpen,
  onSendClose,
  onRestart,
}: ResultDesktopSidebarProps) {
  return (
    <>
      <aside className="hidden w-[360px] shrink-0 flex-col border-l border-[#E4E4E7] bg-white md:flex">
        {/* Top content */}
        <div className="flex flex-1 flex-col gap-4 p-7">
          <div className="flex flex-col gap-1">
            <p className="text-[16px] font-bold text-[#18181B]">¿Qué querés hacer?</p>
            <p className="text-[13px] leading-relaxed text-[#71717A]">
              Elegí una opción para continuar con tu experiencia Hiwei.
            </p>
          </div>

          {/* CTA Beneficios */}
          <div className="flex flex-col gap-1.5">
            <Link
              href="/beneficios"
              className="flex h-[54px] w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-b from-[#2563EB] to-[#1D4ED8] text-[15px] font-bold text-white transition-opacity hover:opacity-90"
            >
              <Gift className="h-5 w-5" />
              Obtener beneficios exclusivos
            </Link>
            <p className="text-[11px] text-[#A1A1AA]">
              Accedé a descuentos, prioridad en stock y más.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#F4F4F5]" />

          {/* Contact CTA */}
          <button
            onClick={onContactOpen}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#2563EB] bg-white text-[14px] font-semibold text-[#2563EB] transition-colors hover:bg-[#EFF6FF]"
          >
            <Headphones className="h-4 w-4" />
            Contactar con un asesor
          </button>

          {/* Send CTA */}
          <button
            onClick={onSendOpen}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#E4E4E7] bg-white text-[14px] font-medium text-[#71717A] transition-colors hover:bg-[#F4F4F5]"
          >
            <Send className="h-4 w-4" />
            Enviar recomendación
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-[#E4E4E7] px-6 py-4">
          <button
            onClick={onRestart}
            className="flex w-full items-center justify-center gap-2 text-[13px] font-medium text-[#A1A1AA] transition-colors hover:text-[#71717A]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Empezar de nuevo
          </button>
        </div>
      </aside>

      <ContactAdvisorOverlay open={showContact} onClose={onContactClose} />
      <SendRecommendationOverlay open={showSend} onClose={onSendClose} />
    </>
  )
}
