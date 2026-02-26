import { ClipboardList } from 'lucide-react'
import type { QuizAnswers } from '@/domain/dashcam/QuizAnswers'

const VEHICLE_LABELS: Record<string, string> = {
  auto: 'Auto', pickup: 'Pickup', suv: 'SUV', moto: 'Moto',
}
const QUALITY_LABELS: Record<string, string> = {
  'muy-buena': 'Muy buena', superior: 'Superior',
}
const CAMERA_LABELS: Record<string, string> = {
  frontal: 'Frontal',
  'frontal-trasera': 'Frontal + Trasera',
  'frontal-trasera-interior': 'F+T+Interior',
}
const EXTRA_LABELS: Record<string, string> = {
  'filtro-polarizador': 'Polarizador',
  'control-bluetooth': 'Bluetooth',
  'modo-estacionamiento': 'Estacionamiento',
}

interface ConfigSummaryCardProps {
  answers: QuizAnswers
}

export function ConfigSummaryCard({ answers }: ConfigSummaryCardProps) {
  const tags: { label: string; active: boolean }[] = []

  if (answers.vehicleType) tags.push({ label: VEHICLE_LABELS[answers.vehicleType] ?? answers.vehicleType, active: true })
  if (answers.videoQuality) tags.push({ label: QUALITY_LABELS[answers.videoQuality] ?? answers.videoQuality, active: false })
  if (answers.cameraPosition) tags.push({ label: CAMERA_LABELS[answers.cameraPosition] ?? answers.cameraPosition, active: false })
  if (answers.recordingTime) tags.push({ label: answers.recordingTime, active: false })
  answers.extras.forEach((e) => tags.push({ label: EXTRA_LABELS[e] ?? e, active: false }))

  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-[#E4E4E7] bg-white p-3.5 md:p-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EFF6FF]">
          <ClipboardList className="h-3.5 w-3.5 text-[#2563EB]" />
        </div>
        <span className="text-[13px] font-semibold text-[#18181B] md:text-[14px]">Tu configuración</span>
      </div>
      {/* Divider */}
      <div className="h-px bg-[#F4F4F5]" />
      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, i) => (
          <span
            key={i}
            className={`rounded-md px-2 py-1 text-[11px] font-medium md:text-[12px]
              ${tag.active
                ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold'
                : 'bg-[#F4F4F5] text-[#71717A]'}`}
          >
            {tag.label}
          </span>
        ))}
      </div>
    </div>
  )
}
