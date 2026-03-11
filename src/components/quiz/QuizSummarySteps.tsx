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
      <div className="flex items-center gap-2 border-b border-border bg-card px-6 py-5">
        <LayoutList className="h-4 w-4 text-brand" />
        <span className="text-[14px] font-semibold text-foreground">Resumen</span>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-1 overflow-y-auto p-3">
        {STEP_CONFIG.map(({ step, label, getSummary }) => {
          const isActive = !allCompleted && step === currentStep
          const isCompleted = allCompleted || step < (currentStep ?? 0)
          const summary = getSummary(answers)
          const isPending = summary === 'Pendiente'

          return (
            <div
              key={step}
              className={`flex flex-col gap-1.5 rounded-lg px-3.5 py-3 transition-colors
                ${isActive ? 'border border-brand bg-brand/10' : isPending ? 'border border-border bg-destructive/3' : 'border border-border bg-card'}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-semibold uppercase
                    ${isActive || isCompleted ? 'text-brand' : 'text-muted-foreground'}`}
                >
                  {label}
                </span>
                <div className="flex items-center gap-1.5">
                  {!allCompleted && isCompleted && (
                    <span className="text-[11px] text-brand/60">Paso {step}</span>
                  )}
                  {isCompleted && !isPending && (
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-brand">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                </div>
              </div>
              <span
                className={`text-[12px] font-medium ${isPending ? 'text-destructive' : 'text-muted-foreground'}`}
              >
                {summary}
              </span>
            </div>
          )
        })}
      </div>
    </>
  )
}
