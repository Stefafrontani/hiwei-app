import { ClipboardList } from 'lucide-react'
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

interface ConfigSummaryCardProps {
  answers: QuizAnswers
}

export function ConfigSummaryCard({ answers }: ConfigSummaryCardProps) {
  const tags: { label: string; active: boolean }[] = []

  if (answers.vehicleType) tags.push({ label: VEHICLE_LABELS[answers.vehicleType] ?? answers.vehicleType, active: false })
  if (answers.videoQuality) tags.push({ label: QUALITY_LABELS[answers.videoQuality] ?? answers.videoQuality, active: false })
  if (answers.cameraPositions?.length) tags.push({ label: CAMERA_COUNT_LABELS[answers.cameraPositions.length] ?? `${answers.cameraPositions.length} cámaras`, active: false })
  const usageLabels: Record<string, string> = {
    commute: 'Uso diario', work_tool: 'Trabajo', recreational: 'Recreativo', other: 'Otro',
  }
  if (answers.vehicleUsage) tags.push({ label: usageLabels[answers.vehicleUsage] ?? answers.vehicleUsage, active: false })
  if (answers.parkingMode === 'si') tags.push({ label: 'Modo estacionamiento', active: false })

  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-border bg-card p-3.5 md:p-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10">
          <ClipboardList className="h-3.5 w-3.5 text-brand" />
        </div>
        <span className="text-[13px] font-semibold text-foreground md:text-[14px]">Recordá tus preferencias</span>
      </div>
      {/* Divider */}
      <div className="h-px bg-muted" />
      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, i) => (
          <span
            key={i}
            className={`rounded-md px-2 py-1 text-[11px] font-medium md:text-[12px]
              ${tag.active
                ? 'bg-brand/10 text-brand font-semibold'
                : 'bg-muted text-muted-foreground'}`}
          >
            {tag.label}
          </span>
        ))}
      </div>
    </div>
  )
}
