const STEP_LABELS: Record<number, string> = {
  1: 'Vehículo',
  2: 'Calidad de grabación',
  3: 'Cámaras',
  4: 'Tiempo de grabación',
  5: 'Extras sugeridos',
  6: 'Instalación',
}

interface ProgressBarProps {
  currentStep: number
  totalSteps?: number
}

export function ProgressBar({ currentStep, totalSteps = 6 }: ProgressBarProps) {
  const percent = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)
  const isLastStep = currentStep === totalSteps
  const barColor = isLastStep ? 'bg-info' : 'bg-brand'
  const barBg = isLastStep ? 'bg-info/30' : 'bg-muted'
  const labelColor = isLastStep ? 'text-info' : 'text-brand'
  const stepColor = isLastStep ? 'text-info' : 'text-muted-foreground'

  return (
    <div className="flex flex-col gap-2 px-5 pb-2 pt-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold tracking-[1px] uppercase ${stepColor}`}>
          PASO {currentStep} DE {totalSteps}
        </span>
        <span className={`text-xs font-semibold ${labelColor}`}>
          {STEP_LABELS[currentStep]}
        </span>
      </div>

      {/* Fill bar */}
      <div className={`h-1 w-full rounded-full ${barBg}`}>
        <div
          className={`h-1 rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${percent === 0 ? 8 : percent}%` }}
        />
      </div>
    </div>
  )
}
