'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Camera, Gift, Headphones, Send, RotateCcw } from 'lucide-react'
import { AppHeader } from '@/components/quiz/AppHeader'
import { ConfigSummaryCard } from '@/components/result/ConfigSummaryCard'
import { MainRecommendationCard } from '@/components/result/MainRecommendationCard'
import { InstallationCard } from '@/components/result/InstallationCard'
import { AlternativesSection } from '@/components/result/AlternativesSection'
import { ResultDesktopSidebar } from '@/components/result/ResultDesktopSidebar'
import { ContactAdvisorOverlay } from '@/components/overlays/ContactAdvisorOverlay'
import { SendRecommendationOverlay } from '@/components/overlays/SendRecommendationOverlay'
import { createEmptyAnswers } from '@/domain/dashcam/QuizAnswers'
import type { QuizAnswers } from '@/domain/dashcam/QuizAnswers'
import type { RecommendationResult } from '@/application/dashcam/GetRecommendationUseCase'

export default function ResultadoPage() {
  const router = useRouter()
  const [answers] = useState<QuizAnswers>(() => {
    if (typeof window === 'undefined') return createEmptyAnswers()
    const raw = localStorage.getItem('hiwei-quiz')
    if (!raw) return createEmptyAnswers()
    return { ...createEmptyAnswers(), ...JSON.parse(raw) }
  })
  const [result, setResult] = useState<RecommendationResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showContact, setShowContact] = useState(false)
  const [showSend, setShowSend] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('hiwei-quiz')
    if (!raw) {
      router.replace('/quiz')
      return
    }

    fetch('/api/recommendation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setResult(data.data)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [router, answers])

  const handleRestart = () => {
    localStorage.removeItem('hiwei-quiz')
    router.push('/quiz')
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      <AppHeader />

      {/* Desktop layout: main column + CTA sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main scrollable column */}
        <main className="flex flex-1 flex-col overflow-y-auto">
          {/* Success Banner */}
          <div className="flex flex-col gap-1 bg-[#F0FDF4] px-5 py-3.5 md:px-12">
            <p className="text-[14px] font-bold text-[#16A34A] md:text-[16px]">
              ¡Tu recomendación está lista!
            </p>
            <p className="text-[12px] text-[#4ADE80] md:text-[13px]">
              Basada en tu configuración personalizada
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EFF6FF]">
                <Camera className="h-8 w-8 animate-pulse text-[#2563EB]" />
              </div>
              <p className="text-[16px] font-semibold text-[#18181B]">Calculando tu recomendación...</p>
              <p className="text-[13px] text-[#71717A]">Analizando tus respuestas</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="m-4 flex flex-col items-center gap-3 rounded-xl bg-[#FEF2F2] p-6 text-center">
              <p className="text-[16px] font-semibold text-[#DC2626]">Algo salió mal</p>
              <p className="text-[13px] text-[#71717A]">{error}</p>
              <button onClick={() => router.push('/quiz')} className="text-[13px] font-semibold text-[#2563EB] underline">
                Intentar de nuevo
              </button>
            </div>
          )}

          {/* Content */}
          {result && !loading && (
            <div className="flex flex-col gap-4 px-4 py-4 md:px-12 md:py-8">
              {/* Mobile CTA Beneficios (hidden on desktop — shown in sidebar) */}
              <Link
                href="/beneficios"
                className="flex h-[54px] w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-b from-[#2563EB] to-[#1D4ED8] text-[15px] font-bold text-white transition-opacity hover:opacity-90 md:hidden"
              >
                <Gift className="h-5 w-5" />
                Obtener beneficios exclusivos
              </Link>

              {/* Config Summary */}
              <ConfigSummaryCard answers={answers} />

              {/* Main Recommendation */}
              <MainRecommendationCard product={result.main.product} />

              {/* Installation card (only when user chose installation) */}
              {answers.installation === 'si' && <InstallationCard />}

              {/* Alternatives */}
              <AlternativesSection alternatives={result.alternatives} />

              {/* Mobile CTAs (hidden on desktop — shown in sidebar) */}
              <div className="flex flex-col gap-3 md:hidden">
                <button
                  onClick={() => setShowContact(true)}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#2563EB] bg-white text-[14px] font-semibold text-[#2563EB] transition-colors hover:bg-[#EFF6FF]"
                >
                  <Headphones className="h-4 w-4" />
                  Contactar con un asesor
                </button>
                <button
                  onClick={() => setShowSend(true)}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#E4E4E7] bg-white text-[14px] font-medium text-[#71717A] transition-colors hover:bg-[#F4F4F5]"
                >
                  <Send className="h-4 w-4" />
                  Enviar recomendación
                </button>
                <button
                  onClick={handleRestart}
                  className="flex items-center justify-center gap-1.5 text-[13px] font-medium text-[#A1A1AA] transition-colors hover:text-[#71717A]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Empezar de nuevo
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Desktop CTA Sidebar */}
        {result && !loading && (
          <ResultDesktopSidebar
            showContact={showContact}
            showSend={showSend}
            onContactOpen={() => setShowContact(true)}
            onContactClose={() => setShowContact(false)}
            onSendOpen={() => setShowSend(true)}
            onSendClose={() => setShowSend(false)}
            onRestart={handleRestart}
          />
        )}
      </div>

      {/* Mobile overlays */}
      <ContactAdvisorOverlay open={showContact} onClose={() => setShowContact(false)} />
      <SendRecommendationOverlay open={showSend} onClose={() => setShowSend(false)} />
    </div>
  )
}
