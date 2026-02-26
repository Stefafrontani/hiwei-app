import { Timer, Info } from 'lucide-react'
import { OptionCard } from '@/components/quiz/OptionCard'
import { InfoBox } from '@/components/quiz/InfoBox'
import type { RecordingTime } from '@/types/dashcam'

const TIME_OPTIONS: { value: RecordingTime; label: string; subLabel: string }[] = [
  { value: '1h', label: '1 h', subLabel: 'Básico' },
  { value: '2h', label: '2 h', subLabel: 'Popular' },
  { value: '4h', label: '4 h', subLabel: 'Recomendado' },
  { value: '8h', label: '8 h', subLabel: 'Máximo' },
]

interface Step4TimeProps {
  recordingTime?: RecordingTime
  onChange: (time: RecordingTime) => void
}

export function Step4Time({ recordingTime, onChange }: Step4TimeProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Step title */}
      <div className="flex items-start gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-brand/10">
          <Timer className="h-[18px] w-[18px] text-brand" />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-[16px] font-semibold text-foreground md:text-[22px] md:font-bold">
            ¿Cuánto tiempo querés grabar?
          </p>
          <p className="text-[12px] text-muted-foreground md:text-[14px]">
            La grabación es continua en bucle
          </p>
        </div>
      </div>

      {/* Time grid */}
      <div className="flex flex-col gap-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-[1px] text-muted-foreground md:text-[12px]">
          TIEMPO CONTINUO DE GRABACIÓN *
        </p>
        <div className="flex flex-wrap gap-2.5">
          {TIME_OPTIONS.map(({ value, label, subLabel }) => (
            <OptionCard
              key={value}
              icon={Timer}
              label={label}
              subLabel={subLabel}
              isActive={recordingTime === value}
              onClick={() => onChange(value)}
            />
          ))}
        </div>
      </div>

      <InfoBox
        icon={Info}
        text="La dashcam graba en bucle sobreescribiendo los archivos más antiguos."
        variant="blue"
      />
    </div>
  )
}
