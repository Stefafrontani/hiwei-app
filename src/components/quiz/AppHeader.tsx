'use client'

import { useState } from 'react'
import { Headphones, Gift } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ContactMethodOverlay } from '@/components/overlays/ContactMethodOverlay'
import type { QuizAnswers } from '@/domain/entities/QuizAnswers'

interface StepPillsProps {
  currentStep: number
  totalSteps?: number
}

function StepPills({ currentStep, totalSteps = 6 }: StepPillsProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1
        const isActive = step === currentStep
        const isCompleted = step < currentStep
        return (
          <div key={step} className="flex items-center gap-1">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-colors
                ${isActive ? 'bg-brand text-white' : isCompleted ? 'bg-brand/80 text-white' : 'bg-muted text-muted-foreground'}`}
            >
              {step}
            </div>
            {step < totalSteps && (
              <div
                className={`h-0.5 w-5 rounded-sm transition-colors ${isCompleted ? 'bg-brand' : 'bg-muted'}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

interface AppHeaderProps {
  currentStep?: number
  showStepPills?: boolean
  answers?: QuizAnswers
}

export function AppHeader({ currentStep, showStepPills = false, answers }: AppHeaderProps) {
  const [showContact, setShowContact] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)

  return (
    <>
      <header className="flex h-[60px] w-full items-center justify-between border-b border-border bg-card px-5 md:h-16 md:px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/hiwei-isotipo.png"
            alt="Hiwei"
            width={32}
            height={32}
            className="h-8 w-8 md:h-9 md:w-9"
          />
          <div className="hidden md:block">
            <p className="text-[18px] font-bold leading-none text-foreground">Hiwei</p>
          </div>
        </div>

        {/* Desktop: step pills */}
        {showStepPills && currentStep !== undefined && (
          <div className="hidden items-center md:flex">
            <StepPills currentStep={currentStep} />
          </div>
        )}

        {/* CTAs */}
        <div className="flex items-center gap-2">
          <Link
            href="/beneficios"
            className="flex items-center gap-1.5 rounded-lg border border-brand px-3 py-2 transition-opacity hover:opacity-90 md:gap-2 md:px-[18px] md:py-2.5"
          >
            <Gift className="h-3.5 w-3.5 text-brand md:h-4 md:w-4" />
            <span className="text-[11px] font-semibold text-brand md:text-[14px]">
              <span className="md:hidden">Beneficios</span>
              <span className="hidden md:inline">Beneficios exclusivos</span>
            </span>
          </Link>
          <button
            onClick={() => setShowContact(true)}
            className="flex items-center gap-1.5 rounded-lg border border-brand px-3 py-2 transition-opacity hover:opacity-90 md:gap-2 md:px-[18px] md:py-2.5"
          >
            <Headphones className="h-3.5 w-3.5 text-brand md:h-4 md:w-4" />
            <span className="text-[11px] font-semibold text-brand md:text-[14px]">Contactanos</span>
          </button>
        </div>
      </header>

      <ContactMethodOverlay
        open={showContact}
        onClose={() => setShowContact(false)}
        showEmailForm={showEmailForm}
        onEmailFormOpen={() => setShowEmailForm(true)}
        onEmailFormClose={() => setShowEmailForm(false)}
        whatsAppProps={{ answers, currentStep }}
      />
    </>
  )
}
