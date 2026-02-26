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
  const barColor = isLastStep ? 'bg-[#16A34A]' : 'bg-[#2563EB]'
  const barBg = isLastStep ? 'bg-[#BBF7D0]' : 'bg-[#E4E4E7]'
  const labelColor = isLastStep ? 'text-[#16A34A]' : 'text-[#2563EB]'
  const stepColor = isLastStep ? 'text-[#16A34A]' : 'text-[#A1A1AA]'

  return (
    <div className="flex flex-col gap-2 px-5 pb-2 pt-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-semibold tracking-[1px] uppercase ${stepColor}`}>
          PASO {currentStep} DE {totalSteps}
        </span>
        <span className={`text-[12px] font-semibold ${labelColor}`}>
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

      {/* Dot indicators */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1
          const isActive = step === currentStep
          const isCompleted = step < currentStep
          const dotColor =
            isActive || isCompleted
              ? isLastStep
                ? 'bg-[#16A34A]'
                : 'bg-[#2563EB]'
              : 'bg-[#E4E4E7]'
          return (
            <div
              key={step}
              className={`rounded-full transition-all ${isActive ? 'h-2 w-2' : 'h-1.5 w-1.5'} ${dotColor}`}
            />
          )
        })}
      </div>
    </div>
  )
}
