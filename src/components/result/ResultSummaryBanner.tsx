import { Badge } from '@/components/ui/badge'
import type { QuizAnswers } from '@/domain/entities/QuizAnswers'

const VEHICLE_LABELS: Record<string, string> = {
  auto: 'Auto', pickup: 'Pickup', suv: 'SUV',
}
const QUALITY_LABELS: Record<string, string> = {
  'buena': 'Calidad buena',
  'muy-buena': 'Calidad muy buena',
  'superior': 'Calidad superior',
}
const CAMERA_COUNT_LABELS: Record<number, string> = {
  1: 'Frontal',
  2: 'Frontal + Trasera',
  3: 'Frontal + Trasera + Interior',
}
const USAGE_LABELS: Record<string, string> = {
  commute: 'Uso diario', work_tool: 'Trabajo', recreational: 'Recreativo', other: 'Otro',
}

interface ResultSummaryBannerProps {
  answers: QuizAnswers
}

export function ResultSummaryBanner({ answers }: ResultSummaryBannerProps) {
  const chips: string[] = []

  if (answers.vehicleType) chips.push(VEHICLE_LABELS[answers.vehicleType] ?? answers.vehicleType)
  if (answers.videoQuality) chips.push(QUALITY_LABELS[answers.videoQuality] ?? answers.videoQuality)
  if (answers.cameraPositions?.length) chips.push(CAMERA_COUNT_LABELS[answers.cameraPositions.length] ?? `${answers.cameraPositions.length} cámaras`)
  if (answers.vehicleUsage) chips.push(USAGE_LABELS[answers.vehicleUsage] ?? answers.vehicleUsage)
  if (answers.parkingMode === 'si') chips.push('Modo estacionamiento')

  return (
    <div className="px-5 py-3.5 md:px-8">
      <p className="text-sm font-bold text-success md:text-base">
        ¡Listo! Ya tenemos tu recomendación
      </p>
      {chips.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {chips.map((chip, i) => (
            <Badge
              key={i}
              className="border-success/30 bg-success/10 text-success/80 rounded-md px-2 py-1 text-xs font-medium"
            >
              {chip}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
