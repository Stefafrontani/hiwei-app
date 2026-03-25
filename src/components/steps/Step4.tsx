import { Timer, Info } from 'lucide-react'
import { OptionCard } from '@/components/quiz/OptionCard'
import { InfoBox } from '@/components/quiz/InfoBox'
import type { VehicleUsage } from '@/domain/value-objects/VehicleUsage'
import { STEP4 } from '@/content/quiz/steps'

interface Step4Props {
  vehicleUsage?: VehicleUsage
  onChange: (usage: VehicleUsage) => void
}

export function Step4({ vehicleUsage, onChange }: Step4Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* Step title */}
      <div className="animate-fade-in-up flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10">
          <Timer className="h-5 w-5 text-brand" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[18px] font-bold text-foreground md:text-[26px] md:tracking-tight">
            {STEP4.title}
          </p>
          <p className="text-[12px] text-muted-foreground md:text-[14px]">
            {STEP4.subtitle}
          </p>
        </div>
      </div>

      <div className="animate-fade-in-up" style={{ '--delay': '80ms' } as React.CSSProperties}>
        <InfoBox
          icon={Info}
          text={STEP4.infoText}
          variant="orange"
        />
      </div>

      {/* Usage options */}
      <div className="flex flex-col gap-3">
        <p className="animate-fade-in-up text-[11px] font-semibold uppercase tracking-[1.5px] text-muted-foreground/70 md:text-[12px]"
          style={{ '--delay': '120ms' } as React.CSSProperties}
        >
          {STEP4.sectionLabel}
        </p>
        <div className="animate-fade-in-up grid grid-cols-2 gap-3 sm:grid-cols-4"
          style={{ '--delay': '160ms' } as React.CSSProperties}
        >
          {STEP4.options.map(({ value, label, subLabel }) => (
            <OptionCard
              key={value}
              label={label}
              subLabel={subLabel}
              isActive={vehicleUsage === value}
              onClick={() => onChange(value)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
