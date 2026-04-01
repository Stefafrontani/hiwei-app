'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Headphones, RotateCcw, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { MainRecommendationCard } from '@/components/result/MainRecommendationCard'
import { BudgetBreakdown } from '@/components/result/BudgetBreakdown'
import { ResultDesktopSidebar } from '@/components/result/ResultDesktopSidebar'
import { ContactMethodOverlay } from '@/components/overlays/ContactMethodOverlay'
import { SendRecommendationOverlay } from '@/components/overlays/SendRecommendationOverlay'
import { LoadingScreen } from '@/components/result/LoadingScreen'
import { MatchReveal } from '@/components/result/MatchReveal'
import { ErrorScreen } from '@/components/result/ErrorScreen'
import { createEmptyAnswers } from '@/domain/entities/QuizAnswers'
import type { QuizAnswers } from '@/domain/entities/QuizAnswers'
import type { RecommendationResult } from '@/application/use-cases/dashcam/GetRecommendation/GetRecommendation.dto'
import type { MemoryCard } from '@/domain/entities/MemoryCard'

type Phase = 'loading' | 'reveal' | 'results'

/* Flow: Recommendation - (1): UI */
export default function ResultadoPage() {
  const router = useRouter()
  const [answers, setAnswers] = useState<QuizAnswers>(createEmptyAnswers)
  const [result, setResult] = useState<RecommendationResult | null>(null)
  const [phase, setPhase] = useState<Phase>('loading')
  const [error, setError] = useState<string | null>(null)
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([])
  const [recommendationId, setRecommendationId] = useState<string | null>(null)
  const [expiresAt, setExpiresAt] = useState('')
  const [showContact, setShowContact] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [showSend, setShowSend] = useState(false)

  const answersRef = useRef<QuizAnswers>(createEmptyAnswers())

  const fetchRecommendation = useCallback((parsed: QuizAnswers) => {
    const raw = JSON.stringify(parsed)
    setError(null)
    setPhase('loading')

    Promise.all([
      fetch('/api/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: raw,
      }).then((r) => r.json()),
      fetch('/api/memory-cards').then((r) => r.json()),
    ])
      .then(([recData, cardsData]) => {
        if (recData.error) throw new Error(recData.error)
        setResult(recData.data)
        if (recData.data?.recommendationId) setRecommendationId(recData.data.recommendationId)
        setExpiresAt(recData.data.expiresAt)
        if (cardsData.data) setMemoryCards(cardsData.data)

        localStorage.setItem('hiwei-recommendation', JSON.stringify({
          answers: raw,
          result: recData.data,
          recommendationId: recData.data?.recommendationId ?? null,
          expiresAt: recData.data.expiresAt,
          memoryCards: cardsData.data ?? [],
        }))
      })
      .then(() => setPhase('reveal'))
      .catch((e) => setError(e.message))
  }, [])

  const handleRetry = useCallback(() => {
    fetchRecommendation(answersRef.current)
  }, [fetchRecommendation])

  useEffect(() => {
    const raw = localStorage.getItem('hiwei-quiz')
    if (!raw) {
      // No quiz answers — try loading from cached recommendation
      const cached = localStorage.getItem('hiwei-recommendation')
      if (cached) {
        try {
          const cachedData = JSON.parse(cached)
          setAnswers({ ...createEmptyAnswers(), ...JSON.parse(cachedData.answers) })
          setResult(cachedData.result)
          setRecommendationId(cachedData.recommendationId)
          setExpiresAt(cachedData.expiresAt)
          setMemoryCards(cachedData.memoryCards ?? [])
          setPhase('results')
          return
        } catch { /* fall through to redirect */ }
      }
      router.replace('/cotiza-tu-dashcam')
      return
    }

    const parsed = { ...createEmptyAnswers(), ...JSON.parse(raw) }
    setAnswers(parsed)
    answersRef.current = parsed

    // Check localStorage cache — skip API if answers haven't changed
    const cached = localStorage.getItem('hiwei-recommendation')
    if (cached) {
      try {
        const cachedData = JSON.parse(cached)
        if (cachedData.answers === raw) {
          setResult(cachedData.result)
          setRecommendationId(cachedData.recommendationId)
          setExpiresAt(cachedData.expiresAt)
          setMemoryCards(cachedData.memoryCards ?? [])
          setPhase('results')
          return
        }
      } catch {
        localStorage.removeItem('hiwei-recommendation')
      }
    }

    fetchRecommendation(parsed)
  }, [router, fetchRecommendation])

  const handleRestart = () => {
    localStorage.removeItem('hiwei-quiz')
    router.push('/cotiza-tu-dashcam')
  }

  const productName = result?.main.product.name

  const handleRevealComplete = useCallback(() => {
    setPhase('results')
  }, [])

  return (
    <div className="quiz-gradient grain-overlay flex h-dvh flex-col overflow-hidden">
      <SiteHeader activeNav="cotizador" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 overflow-hidden">
        {/* Main scrollable column */}
        <main className="flex flex-1 flex-col overflow-y-auto no-scrollbar">

          <AnimatePresence mode="wait">
            {error && (
              <ErrorScreen onRetry={handleRetry} onRestart={handleRestart} />
            )}
            {!error && phase === 'loading' && <LoadingScreen />}
            {!error && phase === 'reveal' && result && (
              <MatchReveal
                onComplete={handleRevealComplete}
              />
            )}

          {/* Content */}
          {!error && phase === 'results' && result && (
            <motion.div
              key="results-screen"
              className="flex w-full flex-col gap-4 px-5 py-4 pb-20 md:px-8 md:py-8 md:pb-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <MainRecommendationCard product={result.main.product} matchScore={result.main.matchScore} />
              <BudgetBreakdown product={result.main.product} answers={answers} memoryCards={memoryCards} onSendRecommendation={() => setShowSend(true)} />

              {expiresAt && (
                <div className="flex items-center gap-1.5 rounded-lg bg-info px-3 py-2">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-foreground" />
                  <p className="text-xs font-semibold text-foreground">
                    Oferta válida hasta el {new Date(expiresAt).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                </div>
              )}

              {/* Restart prompt (mobile) */}
              <div className="flex flex-col items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-5 text-center md:hidden">
                <p className="text-sm font-semibold text-foreground">¿No es lo que buscabas?</p>
                <p className="text-xs leading-relaxed text-muted-foreground">Podés ajustar tus respuestas y encontrar la dashcam ideal.</p>
                <Button variant="outline" onClick={handleRestart} className="mt-1">
                  <RotateCcw className="h-3.5 w-3.5" />
                  Empezar de nuevo
                </Button>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </main>

        {/* Desktop CTA Sidebar */}
        {!error && phase === 'results' && result && (
          <ResultDesktopSidebar
            onContactOpen={() => setShowContact(true)}
            onSendOpen={() => setShowSend(true)}
            onRestart={handleRestart}
            answers={answers}
          />
        )}
      </div>

      {/* Overlays (Drawer on mobile, Dialog on desktop) */}
      <ContactMethodOverlay
        open={showContact}
        onClose={() => setShowContact(false)}
        showEmailForm={showEmailForm}
        onEmailFormOpen={() => setShowEmailForm(true)}
        onEmailFormClose={() => setShowEmailForm(false)}
        whatsAppProps={{ answers, productName }}
      />
      <SendRecommendationOverlay open={showSend} onClose={() => setShowSend(false)} recommendationId={recommendationId} />

      {/* Fixed bottom CTA — mobile only */}
      {!error && phase === 'results' && result && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.06] backdrop-blur-xl bg-background/60 px-4 py-3 md:hidden">
          <Button variant="brand" size="xl" className="w-full" onClick={() => setShowContact(true)}>
            <Headphones className="h-4 w-4" />
            Consultanos
          </Button>
        </div>
      )}
    </div>
  )
}
