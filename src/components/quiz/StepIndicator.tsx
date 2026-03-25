import { Check } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

const STEP_LABELS: Record<number, string> = {
  1: 'Vehículo',
  2: 'Calidad',
  3: 'Cámaras',
  4: 'Uso',
  5: 'Extras',
  6: 'Instalación',
}

interface StepIndicatorProps {
  currentStep: number
  totalSteps?: number
}

export function StepIndicator({ currentStep, totalSteps = 6 }: StepIndicatorProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1)
  const percent = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)
  const isLastStep = currentStep === totalSteps

  // Explicit classes for Tailwind JIT — no dynamic interpolation
  const completedCircle = isLastStep
    ? 'bg-success text-success-foreground'
    : 'bg-brand text-brand-foreground'
  const currentCircle = isLastStep
    ? 'border-2 border-success bg-background text-success animate-glow-pulse'
    : 'border-2 border-brand bg-background text-brand animate-glow-pulse'
  const currentLabel = isLastStep ? 'text-success font-semibold' : 'text-brand font-semibold'

  return (
    <>
      {/* Desktop: horizontal stepper with circles */}
      <div className="hidden md:block px-8 pt-6 pb-2">
        <div className="relative flex items-center justify-between">
          {/* Connecting line (background) */}
          <div className="absolute top-4 left-4 right-4 h-[2px] bg-border/50 rounded-full" />
          {/* Connecting line (filled) */}
          <div
            className="absolute top-4 left-4 right-4 h-[2px] origin-left rounded-full transition-all duration-500 ease-out"
            style={{
              transform: `scaleX(${currentStep === 1 ? 0 : (currentStep - 1) / (totalSteps - 1)})`,
              background: isLastStep ? 'var(--success)' : 'var(--brand)',
            }}
          />

          {steps.map((step) => {
            const isCompleted = step < currentStep
            const isCurrent = step === currentStep

            return (
              <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold transition-all duration-300
                    ${isCompleted
                      ? completedCircle
                      : isCurrent
                        ? currentCircle
                        : 'border border-border/60 bg-muted/30 text-muted-foreground/50'}`}
                >
                  {isCompleted ? <Check className="h-3.5 w-3.5" /> : step}
                </div>
                <span
                  className={`text-[10px] font-medium transition-colors duration-300
                    ${isCurrent
                      ? currentLabel
                      : isCompleted
                        ? 'text-muted-foreground'
                        : 'text-muted-foreground/40'}`}
                >
                  {STEP_LABELS[step]}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile: compact step + segmented progress */}
      <div className="flex flex-col gap-2 px-5 pt-4 pb-2 md:hidden">
        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-semibold tracking-[1px] uppercase ${isLastStep ? 'text-success' : 'text-muted-foreground'}`}>
            Paso {currentStep} de {totalSteps}
          </span>
          <span className={`text-[12px] font-semibold ${isLastStep ? 'text-success' : 'text-brand'}`}>
            {STEP_LABELS[currentStep]}
          </span>
        </div>
        <Progress
          value={percent === 0 ? 5 : percent}
          className={`h-1.5 bg-muted/50 ${isLastStep
            ? '[&>[data-slot=progress-indicator]]:bg-success'
            : '[&>[data-slot=progress-indicator]]:bg-brand'}`}
        />
      </div>
    </>
  )
}
