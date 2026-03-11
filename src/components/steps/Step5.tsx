import { Car, X, Check, Info } from 'lucide-react'
import { OptionRow } from '@/components/quiz/OptionRow'
import { InfoBox } from '@/components/quiz/InfoBox'
import type { ParkingMode } from '@/domain/value-objects/ParkingMode'
import { STEP5 } from '@/content/quiz/steps'

const PARKING_ICONS = { si: Check, no: X } as const

interface Step5Props {
  parkingMode?: ParkingMode
  onChange: (mode: ParkingMode) => void
}

export function Step5({ parkingMode, onChange }: Step5Props) {
  return (
    <div className="flex flex-col gap-5">
      {/* Step title */}
      <div className="flex items-start gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-brand/10">
          <Car className="h-[18px] w-[18px] text-brand" />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-[16px] font-semibold text-foreground md:text-[22px] md:font-bold">
            {STEP5.title}
          </p>
          <p className="text-[12px] text-muted-foreground md:text-[14px]">
            {STEP5.subtitle}
          </p>
        </div>
      </div>

      <InfoBox
        icon={Info}
        text={STEP5.infoText}
        variant="amber"
      />
      
      {/* Options */}
      <div className="flex flex-col gap-3">
        {STEP5.options.map((opt) => (
          <OptionRow
            key={opt.value}
            icon={PARKING_ICONS[opt.value]}
            title={opt.title}
            description={opt.description}
            isActive={parkingMode === opt.value}
            onClick={() => onChange(opt.value)}
          />
        ))}
      </div>
    </div>
  )
}
