import { LayoutList, Check } from 'lucide-react'
import type { QuizAnswers } from '@/domain/entities/QuizAnswers'

const STEP_CONFIG = [
  { step: 1, label: 'Vehículo', getSummary: (a: QuizAnswers) => a.vehicleType ? `${a.vehicleType.charAt(0).toUpperCase() + a.vehicleType.slice(1)} · Año: ${a.vehicleYear ?? '—'}` : 'Pendiente' },
  { step: 2, label: 'Calidad de grabación', getSummary: (a: QuizAnswers) => a.videoQuality ? (a.videoQuality === 'muy-buena' ? 'Muy buena' : a.videoQuality === 'buena' ? 'Buena' : 'Superior') : 'Pendiente' },
  { step: 3, label: 'Cantidad de cámaras', getSummary: (a: QuizAnswers) => {
    const labels: Record<number, string> = { 1: 'Solo frontal', 2: 'Frontal + Trasera', 3: 'Frontal + Trasera + Interior' }
    return a.cameraPositions?.length ? labels[a.cameraPositions.length] ?? `${a.cameraPositions.length} cámaras` : 'Pendiente'
  }},
  { step: 4, label: 'Uso del vehículo', getSummary: (a: QuizAnswers) => {
    const labels: Record<string, string> = { commute: 'Ir al trabajo', work_tool: 'Herramienta de trabajo', recreational: 'Paseo / recreativo', other: 'No sé / Otro' }
    return a.vehicleUsage ? labels[a.vehicleUsage] ?? a.vehicleUsage : 'Pendiente'
  }},
  { step: 5, label: 'Modo estacionamiento', getSummary: (a: QuizAnswers) => a.parkingMode === 'si' ? 'Sí' : a.parkingMode === 'no' ? 'No' : 'Pendiente' },
  { step: 6, label: 'Instalación', getSummary: (a: QuizAnswers) => a.installation === 'si' ? 'Con instalación' : a.installation === 'no' ? 'Sin instalación' : 'Pendiente' },
]

interface QuizSummaryStepsProps {
  answers: QuizAnswers
  currentStep?: number
}

export function QuizSummarySteps({ answers, currentStep }: QuizSummaryStepsProps) {
  const allCompleted = currentStep === undefined

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-2.5 px-6 py-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/15">
          <LayoutList className="h-3.5 w-3.5 text-brand" />
        </div>
        <span className="text-[15px] font-bold text-foreground tracking-tight">Resumen</span>
      </div>

      {/* Vertical stepper */}
      <div className="flex flex-col px-5 pb-4">
        {STEP_CONFIG.map(({ step, label, getSummary }, index) => {
          const isActive = !allCompleted && step === currentStep
          const isCompleted = allCompleted || step < (currentStep ?? 0)
          const summary = getSummary(answers)
          const isPending = summary === 'Pendiente'
          const isLast = index === STEP_CONFIG.length - 1

          return (
            <div key={step} className="flex gap-3">
              {/* Vertical line + circle */}
              <div className="flex flex-col items-center">
                {/* Circle indicator */}
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300
                    ${isCompleted && !isPending
                      ? 'bg-brand'
                      : isActive
                        ? 'border-2 border-brand bg-brand/10 animate-glow-pulse'
                        : 'border border-dashed border-muted-foreground/30 bg-transparent'}`}
                >
                  {isCompleted && !isPending ? (
                    <Check className="h-3 w-3 text-brand-foreground" />
                  ) : (
                    <span className={`text-[10px] font-bold
                      ${isActive ? 'text-brand' : 'text-muted-foreground/40'}`}>
                      {step}
                    </span>
                  )}
                </div>
                {/* Connecting line */}
                {!isLast && (
                  <div
                    className={`w-[2px] flex-1 min-h-4 rounded-full transition-all duration-300
                      ${isCompleted && !isPending ? 'bg-brand/50' : 'bg-border/30'}`}
                  />
                )}
              </div>

              {/* Content */}
              <div className={`flex flex-col gap-0.5 pb-4 transition-all duration-300
                ${isActive ? 'pt-0.5' : ''}`}
              >
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300
                    ${isActive || isCompleted ? 'text-brand' : 'text-muted-foreground/50'}`}
                >
                  {label}
                </span>
                <span
                  className={`text-[12px] font-medium transition-colors duration-300
                    ${isPending
                      ? isActive ? 'text-muted-foreground' : 'text-muted-foreground/30'
                      : 'text-foreground/80'}`}
                >
                  {summary}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
