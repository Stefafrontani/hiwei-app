import { LayoutList, Check } from 'lucide-react'
import type { QuizAnswers } from '@/domain/dashcam/QuizAnswers'

const STEP_CONFIG = [
  { step: 1, label: 'Vehículo', getSummary: (a: QuizAnswers) => a.vehicleType ? `${capitalize(a.vehicleType)} · Año: ${a.vehicleYear ?? '—'}` : 'Pendiente' },
  { step: 2, label: 'Calidad de grabación', getSummary: (a: QuizAnswers) => a.videoQuality ? (a.videoQuality === 'muy-buena' ? 'Muy buena' : 'Calidad superior') : 'Pendiente' },
  { step: 3, label: 'Cantidad de cámaras', getSummary: (a: QuizAnswers) => {
    const labels: Record<string, string> = {
      'frontal': 'Solo frontal',
      'frontal-trasera': 'Frontal + Trasera',
      'frontal-trasera-interior': 'Frontal + Trasera + Interior',
    }
    return a.cameraPosition ? labels[a.cameraPosition] : 'Pendiente'
  }},
  { step: 4, label: 'Tiempo de grabación', getSummary: (a: QuizAnswers) => a.recordingTime ? `${a.recordingTime} continua` : 'Pendiente' },
  { step: 5, label: 'Extras', getSummary: (a: QuizAnswers) => a.extras.length > 0 ? `${a.extras.length} extra${a.extras.length > 1 ? 's' : ''}` : 'Ninguno' },
  { step: 6, label: 'Instalación', getSummary: (a: QuizAnswers) => a.installation === 'si' ? 'Con instalación' : a.installation === 'no' ? 'Sin instalación' : 'Pendiente' },
]

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

interface DesktopSidebarProps {
  currentStep: number
  answers: QuizAnswers
}

export function DesktopSidebar({ currentStep, answers }: DesktopSidebarProps) {
  return (
    <aside className="hidden w-80 shrink-0 flex-col border-l border-[#E4E4E7] bg-[#F8F9FA] md:flex">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[#E4E4E7] bg-white px-6 py-5">
        <LayoutList className="h-4 w-4 text-[#2563EB]" />
        <span className="text-[14px] font-semibold text-[#18181B]">Resumen</span>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-1 overflow-y-auto p-3">
        {STEP_CONFIG.map(({ step, label, getSummary }) => {
          const isActive = step === currentStep
          const isCompleted = step < currentStep
          const summary = getSummary(answers)
          const isPending = summary === 'Pendiente'

          return (
            <div
              key={step}
              className={`flex flex-col gap-1.5 rounded-lg px-3.5 py-3 transition-colors
                ${isActive ? 'border border-[#2563EB] bg-[#EFF6FF]' : 'border border-[#E4E4E7] bg-white'}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-semibold uppercase
                    ${isActive ? 'text-[#2563EB]' : isCompleted ? 'text-[#2563EB]' : 'text-[#A1A1AA]'}`}
                >
                  {label}
                </span>
                <div className="flex items-center gap-1.5">
                  {isCompleted && (
                    <span className="text-[11px] text-[#93C5FD]">Paso {step}</span>
                  )}
                  {isCompleted && !isPending && (
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#2563EB]">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                </div>
              </div>
              <span
                className={`text-[12px] font-medium ${isPending ? 'text-[#D4D4D8]' : 'text-[#71717A]'}`}
              >
                {summary}
              </span>
            </div>
          )
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-auto border-t border-[#E4E4E7] bg-white p-5">
        <a
          href="https://wa.me/5491100000000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-[46px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#25D366] text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </aside>
  )
}
