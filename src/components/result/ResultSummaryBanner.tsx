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
      <p className="text-[14px] font-bold text-success md:text-[16px]">
        ¡Listo! Ya tenemos tu recomendación
      </p>
      {chips.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {chips.map((chip, i) => (
            <span
              key={i}
              className="rounded-md bg-success/10 px-2 py-1 text-[11px] font-medium text-success/80 md:text-[12px]"
            >
              {chip}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
