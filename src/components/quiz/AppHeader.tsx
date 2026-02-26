'use client'

import { MessageCircle, Camera } from 'lucide-react'

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
}

export function AppHeader({ currentStep, showStepPills = false }: AppHeaderProps) {
  return (
    <header className="flex h-[60px] w-full items-center justify-between border-b border-border bg-card px-5 md:h-16 md:px-12">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-brand md:h-9 md:w-9 md:rounded-[10px]">
          <Camera className="h-4 w-4 text-white md:h-[18px] md:w-[18px]" />
        </div>
        <div className="hidden md:block">
          <p className="text-[18px] font-bold leading-none text-foreground">Hiwei</p>
          <p className="text-[12px] text-muted-foreground">Asesor Inteligente de Dashcams</p>
        </div>
        <span className="text-[16px] font-bold text-foreground md:hidden">Hiwei</span>
      </div>

      {/* Desktop: step pills */}
      {showStepPills && currentStep !== undefined && (
        <div className="hidden items-center md:flex">
          <StepPills currentStep={currentStep} />
        </div>
      )}

      {/* WhatsApp CTA */}
      <a
        href="https://wa.me/5491100000000"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-lg bg-whatsapp px-3 py-2 text-white transition-opacity hover:opacity-90 md:gap-2 md:px-[18px] md:py-2.5"
      >
        <MessageCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
        <span className="text-[11px] font-semibold md:text-[14px]">
          <span className="md:hidden">WhatsApp</span>
          <span className="hidden md:inline">Hablar por WhatsApp</span>
        </span>
      </a>
    </header>
  )
}
