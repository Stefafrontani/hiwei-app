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
    <div className="flex flex-col gap-6">
      {/* Step title */}
      <div className="animate-fade-in-up flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10">
          <Car className="h-5 w-5 text-brand" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[18px] font-bold text-foreground md:text-[26px] md:tracking-tight">
            {STEP5.title}
          </p>
          <p className="text-[12px] text-muted-foreground md:text-[14px]">
            {STEP5.subtitle}
          </p>
        </div>
      </div>

      <div className="animate-fade-in-up" style={{ '--delay': '80ms' } as React.CSSProperties}>
        <InfoBox
          icon={Info}
          text={STEP5.infoText}
          variant="amber"
        />
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {STEP5.options.map((opt, i) => (
          <div key={opt.value} className="animate-fade-in-up" style={{ '--delay': `${140 + i * 50}ms` } as React.CSSProperties}>
            <OptionRow
              icon={PARKING_ICONS[opt.value]}
              title={opt.title}
              description={opt.description}
              isActive={parkingMode === opt.value}
              onClick={() => onChange(opt.value)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
