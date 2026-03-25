'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SubtitleBar } from '@/components/quiz/SubtitleBar'
import { StepIndicator } from '@/components/quiz/StepIndicator'
import { NavigationFooter } from '@/components/quiz/NavigationFooter'
import { DesktopSidebar } from '@/components/quiz/DesktopSidebar'
import { Step1 } from '@/components/steps/Step1'
import { Step2 } from '@/components/steps/Step2'
import { Step3 } from '@/components/steps/Step3'
import { Step4 } from '@/components/steps/Step4'
import { Step5 } from '@/components/steps/Step5'
import { Step6 } from '@/components/steps/Step6'
import { createEmptyAnswers, isStepComplete } from '@/domain/entities/QuizAnswers'
import type { QuizAnswers } from '@/domain/entities/QuizAnswers'
import type { VehicleType } from '@/domain/value-objects/VehicleType'
import type { VideoQuality } from '@/domain/value-objects/VideoQuality'
import type { CameraPosition } from '@/domain/value-objects/CameraPosition'
import type { VehicleUsage } from '@/domain/value-objects/VehicleUsage'
import type { ParkingMode } from '@/domain/value-objects/ParkingMode'
import type { Installation } from '@/domain/value-objects/Installation'
import { SUBTITLE_CONFIG, PREVIOUS_RECOMMENDATION } from '@/content/quiz/subtitles'
import { useIsMobile } from '@/hooks/use-mobile'

const TOTAL_STEPS = 6

export default function QuizPage() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [currentStep, setCurrentStep] = useState(1)
  const [answers, setAnswers] = useState<QuizAnswers>(createEmptyAnswers)
  const [showYearError, setShowYearError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [previousProductName, setPreviousProductName] = useState<string | null>(null)

  useEffect(() => {
    try {
      const cached = localStorage.getItem('hiwei-recommendation')
      if (!cached) return
      const parsed = JSON.parse(cached)
      setPreviousProductName(parsed.result?.main?.product?.name ?? null)
    } catch { /* ignore */ }
  }, [])

  const update = useCallback(<K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }, [])

  const canGoNext = isStepComplete(answers, currentStep)

  const handleNext = () => {
    if (currentStep === 1 && !answers.vehicleYear) {
      setShowYearError(true)
      return
    }
    if (!canGoNext) return

    if (currentStep === TOTAL_STEPS) {
      setIsLoading(true)
      localStorage.setItem('hiwei-quiz', JSON.stringify(answers))
      router.push('/resultado')
      return
    }

    setShowYearError(false)
    setCurrentStep((s) => s + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1)
      setShowYearError(false)
      setIsLoading(false)
    }
  }

  const subtitle = SUBTITLE_CONFIG[currentStep]

  return (
    <div className="quiz-gradient grain-overlay flex h-dvh flex-col overflow-hidden">
      <SiteHeader activeNav="cotizador" answers={answers} currentStep={currentStep} />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 overflow-hidden">

        {/* Main content */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {/* Previous recommendation — above hero banner */}
          {currentStep === 1 && previousProductName && (
            <div className="px-5 pt-2 pb-1 md:px-8 md:pt-4 md:pb-0">
              <Link
                href="/resultado"
                className="flex items-center justify-between rounded-xl px-4 py-2.5 transition-all duration-200
                  glass-card border-brand/20 hover:border-brand/40 hover:shadow-[0_0_20px_2px_oklch(0.8339_0.1432_93.43/0.12)]"
              >
                <div className="flex flex-col">
                  <span className="text-[11px] text-muted-foreground">{PREVIOUS_RECOMMENDATION.label}</span>
                  <span className="text-[14px] font-semibold text-foreground">{previousProductName}</span>
                </div>
                <div className="flex items-center gap-1 text-[13px] font-semibold text-brand">
                  {PREVIOUS_RECOMMENDATION.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            </div>
          )}

          {/* Step indicator — mobile only, above hero banner */}
          {isMobile && <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />}

          {/* Hero banner */}
          <SubtitleBar
            variant={subtitle.variant}
            title={subtitle.title}
            subtitle={subtitle.subtitle}
          />

          {/* Step content */}
          <div className="flex-1 overflow-y-auto px-5 py-5 md:px-8 md:py-8">
            <div key={currentStep}>
              {currentStep === 1 && (
                <Step1
                  vehicleType={answers.vehicleType}
                  vehicleYear={answers.vehicleYear}
                  showYearError={showYearError}
                  onVehicleTypeChange={(v) => update('vehicleType', v as VehicleType)}
                  onVehicleYearChange={(y) => { update('vehicleYear', y); setShowYearError(false) }}
                />
              )}
              {currentStep === 2 && (
                <Step2
                  videoQuality={answers.videoQuality}
                  onChange={(v) => update('videoQuality', v as VideoQuality)}
                />
              )}
              {currentStep === 3 && (
                <Step3
                  cameraPositions={answers.cameraPositions}
                  onChange={(v) => update('cameraPositions', v as CameraPosition[])}
                />
              )}
              {currentStep === 4 && (
                <Step4
                  vehicleUsage={answers.vehicleUsage}
                  onChange={(v) => update('vehicleUsage', v as VehicleUsage)}
                />
              )}
              {currentStep === 5 && (
                <Step5
                  parkingMode={answers.parkingMode}
                  onChange={(v) => update('parkingMode', v as ParkingMode)}
                />
              )}
              {currentStep === 6 && (
                <Step6
                  installation={answers.installation}
                  onChange={(v) => update('installation', v as Installation)}
                />
              )}

              {/* Desktop navigation */}
              <div className="hidden md:block">
                <NavigationFooter
                  currentStep={currentStep}
                  totalSteps={TOTAL_STEPS}
                  canGoNext={canGoNext}
                  onBack={handleBack}
                  onNext={handleNext}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Mobile navigation */}
          <div className="pb-20 md:hidden">
            <NavigationFooter
              currentStep={currentStep}
              totalSteps={TOTAL_STEPS}
              canGoNext={canGoNext}
              onBack={handleBack}
              onNext={handleNext}
              isLoading={isLoading}
              variant="mobile"
            />
          </div>
        </main>

        {/* Desktop sidebar */}
        <DesktopSidebar currentStep={currentStep} answers={answers} />
      </div>
    </div>
  )
}
