'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Headphones, Send, RotateCcw } from 'lucide-react'
import { AppHeader } from '@/components/quiz/AppHeader'
import { ResultSummaryBanner } from '@/components/result/ResultSummaryBanner'
import { MainRecommendationCard } from '@/components/result/MainRecommendationCard'
import { BudgetBreakdown } from '@/components/result/BudgetBreakdown'
import { AlternativesSection } from '@/components/result/AlternativesSection'
import { ResultDesktopSidebar } from '@/components/result/ResultDesktopSidebar'
import { ContactMethodOverlay } from '@/components/overlays/ContactMethodOverlay'
import { SendRecommendationOverlay } from '@/components/overlays/SendRecommendationOverlay'
import { createEmptyAnswers } from '@/domain/entities/QuizAnswers'
import type { QuizAnswers } from '@/domain/entities/QuizAnswers'
import type { RecommendationResult } from '@/application/use-cases/dashcam/GetRecommendation/GetRecommendation.dto'
import type { MemoryCard } from '@/domain/entities/MemoryCard'

/* Flow: Recommendation - (1): UI */
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
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([])
  const [recommendationId, setRecommendationId] = useState<string | null>(null)
  const [showContact, setShowContact] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [showSend, setShowSend] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('hiwei-quiz')
    if (!raw) {
      router.replace('/quiz')
      return
    }

    // Check localStorage cache — skip API if answers haven't changed
    const cached = localStorage.getItem('hiwei-recommendation')
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        if (parsed.answers === raw) {
          setResult(parsed.result)
          setRecommendationId(parsed.recommendationId)
          setMemoryCards(parsed.memoryCards ?? [])
          setLoading(false)
          return
        }
      } catch {
        localStorage.removeItem('hiwei-recommendation')
      }
    }

    Promise.all([
      fetch('/api/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      }).then((r) => r.json()),
      fetch('/api/memory-cards').then((r) => r.json()),
    ])
      .then(([recData, cardsData]) => {
        if (recData.error) throw new Error(recData.error)
        setResult(recData.data)
        if (recData.data?.recommendationId) setRecommendationId(recData.data.recommendationId)
        if (cardsData.data) setMemoryCards(cardsData.data)

        // Cache in localStorage for this session
        localStorage.setItem('hiwei-recommendation', JSON.stringify({
          answers: raw,
          result: recData.data,
          recommendationId: recData.data?.recommendationId ?? null,
          memoryCards: cardsData.data ?? [],
        }))
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [router, answers])

  const handleRestart = () => {
    localStorage.removeItem('hiwei-quiz')
    localStorage.removeItem('hiwei-recommendation')
    router.push('/quiz')
  }

  const productName = result?.main.product.name

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <AppHeader />

      {/* Desktop layout: main column + CTA sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main scrollable column */}
        <main className="flex flex-1 flex-col overflow-y-auto">
          {/* Summary Banner */}
          {result && !loading && <ResultSummaryBanner answers={answers} />}

          {/* Loading */}
          {loading && (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
                <Camera className="h-8 w-8 animate-pulse text-brand" />
              </div>
              <p className="text-[16px] font-semibold text-foreground">Calculando tu recomendación...</p>
              <p className="text-[13px] text-muted-foreground">Analizando tus respuestas</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="m-4 flex flex-col items-center gap-3 rounded-xl bg-destructive/10 p-6 text-center">
              <p className="text-[16px] font-semibold text-destructive">Algo salió mal</p>
              <p className="text-[13px] text-muted-foreground">{error}</p>
              <button onClick={() => router.push('/quiz')} className="text-[13px] font-semibold text-brand underline">
                Intentar de nuevo
              </button>
            </div>
          )}

          {/* Content */}
          {result && !loading && (
            <div className="flex flex-col gap-4 px-4 py-4 md:px-12 md:py-8">
              {/* Main Recommendation */}
              <MainRecommendationCard product={result.main.product} matchScore={result.main.matchScore} onSendRecommendation={() => setShowSend(true)} />

              {/* Budget Breakdown */}
              <BudgetBreakdown product={result.main.product} answers={answers} memoryCards={memoryCards} />

              {/* Alternatives — hidden temporarily, will be redesigned with more detail */}
              {/* <AlternativesSection alternatives={result.alternatives} /> */}

              {/* Mobile CTAs (hidden on desktop — shown in sidebar) */}
              <div className="flex flex-col gap-3 md:hidden">
                <button
                  onClick={() => setShowContact(true)}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-brand bg-card text-[14px] font-semibold text-brand transition-colors hover:bg-brand/10"
                >
                  <Headphones className="h-4 w-4" />
                  Consultanos
                </button>
                <button
                  onClick={() => setShowSend(true)}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card text-[14px] font-medium text-muted-foreground transition-colors hover:bg-muted"
                >
                  <Send className="h-4 w-4" />
                  Enviarme la recomendación
                </button>
                <button
                  onClick={handleRestart}
                  className="flex items-center justify-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
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
            showEmailForm={showEmailForm}
            onContactOpen={() => setShowContact(true)}
            onContactClose={() => setShowContact(false)}
            onEmailFormOpen={() => setShowEmailForm(true)}
            onEmailFormClose={() => setShowEmailForm(false)}
            onSendOpen={() => setShowSend(true)}
            onSendClose={() => setShowSend(false)}
            onRestart={handleRestart}
            recommendationId={recommendationId}
            answers={answers}
            productName={productName}
          />
        )}
      </div>

      {/* Mobile overlays */}
      <ContactMethodOverlay
        open={showContact}
        onClose={() => setShowContact(false)}
        showEmailForm={showEmailForm}
        onEmailFormOpen={() => setShowEmailForm(true)}
        onEmailFormClose={() => setShowEmailForm(false)}
        whatsAppProps={{ answers, productName }}
      />
      <SendRecommendationOverlay open={showSend} onClose={() => setShowSend(false)} recommendationId={recommendationId} />
    </div>
  )
}
