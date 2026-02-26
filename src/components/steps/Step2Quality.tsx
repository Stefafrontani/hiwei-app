import { Video, Info } from 'lucide-react'
import { OptionRow } from '@/components/quiz/OptionRow'
import { InfoBox } from '@/components/quiz/InfoBox'
import type { VideoQuality } from '@/types/dashcam'

interface Step2QualityProps {
  videoQuality?: VideoQuality
  onChange: (quality: VideoQuality) => void
}

export function Step2Quality({ videoQuality, onChange }: Step2QualityProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Step title */}
      <div className="flex items-start gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EFF6FF]">
          <Video className="h-[18px] w-[18px] text-[#2563EB]" />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-[16px] font-semibold text-[#18181B] md:text-[22px] md:font-bold">
            ¿Qué calidad de imagen preferís?
          </p>
          <p className="text-[12px] text-[#71717A] md:text-[14px]">
            Elegí según tu prioridad de uso
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-[1px] text-[#A1A1AA] md:text-[12px]">
          CALIDAD DE GRABACIÓN *
        </p>

        <OptionRow
          icon={Video}
          title="Muy buena (recomendada)"
          description="Se ve excelente para el uso diario."
          isActive={videoQuality === 'muy-buena'}
          onClick={() => onChange('muy-buena')}
          badge="Recomendada"
        />

        <OptionRow
          icon={Video}
          title="Calidad superior (máximo detalle)"
          description="Mejor lectura de detalles y nitidez, ideal si querés lo mejor."
          isActive={videoQuality === 'superior'}
          onClick={() => onChange('superior')}
        />
      </div>

      <InfoBox
        icon={Info}
        text="A mayor calidad, mayor consumo de memoria y mayor precio"
        variant="orange"
      />
    </div>
  )
}
