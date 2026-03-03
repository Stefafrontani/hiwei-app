'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AppHeader } from '@/components/quiz/AppHeader'
import { SubtitleBar } from '@/components/quiz/SubtitleBar'
import { ProgressBar } from '@/components/quiz/ProgressBar'
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
import type { RecordingTime } from '@/domain/value-objects/RecordingTime'
import type { Extra } from '@/domain/value-objects/Extra'
import type { Installation } from '@/domain/value-objects/Installation'

const TOTAL_STEPS = 6

const SUBTITLE_CONFIG: Record<number, { variant: 'blue' | 'green'; title: string; subtitle: string }> = {
  1: { variant: 'blue', title: 'Asesor Inteligente de Dashcams', subtitle: 'Respondé 6 preguntas y encontrá tu dashcam ideal' },
  2: { variant: 'blue', title: 'Asesor Inteligente de Dashcams', subtitle: 'Respondé 6 preguntas y encontrá tu dashcam ideal' },
  3: { variant: 'blue', title: 'Asesor Inteligente de Dashcams', subtitle: 'Respondé 6 preguntas y encontrá tu dashcam ideal' },
  4: { variant: 'blue', title: 'Asesor Inteligente de Dashcams', subtitle: 'Respondé 6 preguntas y encontrá tu dashcam ideal' },
  5: { variant: 'blue', title: 'Asesor Inteligente de Dashcams', subtitle: 'Respondé 6 preguntas y encontrá tu dashcam ideal' },
  6: { variant: 'green', title: 'Asesor Inteligente de Dashcams', subtitle: '¡Último paso! Ya casi tenés tu recomendación' },
}

export default function QuizPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [answers, setAnswers] = useState<QuizAnswers>(createEmptyAnswers)
  const [showYearError, setShowYearError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
    }
  }

  const subtitle = SUBTITLE_CONFIG[currentStep]

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Header */}
      <AppHeader currentStep={currentStep} showStepPills />

      {/* Desktop layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {/* Subtitle bar */}
          <SubtitleBar
            variant={subtitle.variant}
            title={subtitle.title}
            subtitle={subtitle.subtitle}
          />

          {/* Progress */}
          <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

          {/* Step content */}
          <div className="flex-1 overflow-y-auto px-5 py-4 md:px-12 md:py-8">
            <div className="mx-auto max-w-2xl">
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
                  cameraPosition={answers.cameraPosition}
                  onChange={(v) => update('cameraPosition', v as CameraPosition)}
                />
              )}
              {currentStep === 4 && (
                <Step4
                  recordingTime={answers.recordingTime}
                  onChange={(v) => update('recordingTime', v as RecordingTime)}
                />
              )}
              {currentStep === 5 && (
                <Step5
                  extras={answers.extras}
                  onChange={(v) => update('extras', v as Extra[])}
                />
              )}
              {currentStep === 6 && (
                <Step6
                  installation={answers.installation}
                  onChange={(v) => update('installation', v as Installation)}
                />
              )}
            </div>
          </div>

          {/* Navigation footer */}
          <NavigationFooter
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            canGoNext={canGoNext}
            onBack={handleBack}
            onNext={handleNext}
            isLoading={isLoading}
          />
        </main>

        {/* Desktop sidebar */}
        <DesktopSidebar currentStep={currentStep} answers={answers} />
      </div>
    </div>
  )
}
