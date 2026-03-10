import { Video, Info } from 'lucide-react'
import { OptionRow } from '@/components/quiz/OptionRow'
import { InfoBox } from '@/components/quiz/InfoBox'
import type { VideoQuality } from '@/domain/value-objects/VideoQuality'

interface Step2Props {
  videoQuality?: VideoQuality
  onChange: (quality: VideoQuality) => void
}

export function Step2({ videoQuality, onChange }: Step2Props) {
  return (
    <div className="flex flex-col gap-5">
      {/* Step title */}
      <div className="flex items-start gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-brand/10">
          <Video className="h-[18px] w-[18px] text-brand" />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-[16px] font-semibold text-foreground md:text-[22px] md:font-bold">
            ¿Qué calidad de imagen preferís?
          </p>
          <p className="text-[12px] text-muted-foreground md:text-[14px]">
            Elegí según tus preferencias.
          </p>
        </div>
      </div>

      <InfoBox
        icon={Info}
        text="A mayor calidad, mayor nitidez en la grabación"
        variant="orange"
      />
      {/* Options */}
      <div className="flex flex-col gap-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-[1px] text-muted-foreground md:text-[12px]">
          CALIDAD DE GRABACIÓN *
        </p>

        <OptionRow
          icon={Video}
          title="Buena"
          description="La calidad es suficiente para grabar lo que importa: patentes."
          isActive={videoQuality === 'buena'}
          onClick={() => onChange('buena')}
        />

        <OptionRow
          icon={Video}
          title="Muy buena"
          description="Además de registrar lo importante, tambien captura otros detalles."
          isActive={videoQuality === 'muy-buena'}
          onClick={() => onChange('muy-buena')}
        />

        <OptionRow
          icon={Video}
          title="Calidad superior"
          description="Mejor lectura de detalles y nitidez, ideal si querés lo mejor."
          isActive={videoQuality === 'superior'}
          onClick={() => onChange('superior')}
        />
      </div>
    </div>
  )
}
