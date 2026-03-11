import { Wrench, Package } from 'lucide-react'
import { OptionRow } from '@/components/quiz/OptionRow'
import type { Installation } from '@/domain/value-objects/Installation'
import { STEP6 } from '@/content/quiz/steps'

const INSTALL_ICONS = { si: Wrench, no: Package } as const

interface Step6Props {
  installation?: Installation
  onChange: (value: Installation) => void
}

export function Step6({ installation, onChange }: Step6Props) {
  return (
    <div className="flex flex-col gap-5">
      {/* Step title */}
      <div className="flex items-start gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-success/10">
          <Wrench className="h-[18px] w-[18px] text-success" />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-[16px] font-semibold text-foreground md:text-[22px] md:font-bold">
            {STEP6.title}
          </p>
          <p className="text-[12px] text-muted-foreground md:text-[14px]">
            {STEP6.subtitle}
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {STEP6.options.map((opt) => (
          <OptionRow
            key={opt.value}
            icon={INSTALL_ICONS[opt.value]}
            title={opt.title}
            description={opt.description}
            isActive={installation === opt.value}
            onClick={() => onChange(opt.value)}
            accentColor="green"
          />
        ))}
      </div>
    </div>
  )
}
