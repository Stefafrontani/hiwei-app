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
    <div className="flex flex-col gap-6">
      {/* Step title */}
      <div className="animate-fade-in-up flex items-start gap-3">
        <div className="hidden md:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-success/10">
          <Wrench className="h-5 w-5 text-success" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-lg font-bold text-foreground md:text-2xl md:tracking-tight">
            {STEP6.title}
          </p>
          <p className="hidden md:block text-sm text-muted-foreground">
            {STEP6.subtitle}
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {STEP6.options.map((opt, i) => (
          <div key={opt.value} className="animate-fade-in-up" style={{ '--delay': `${100 + i * 50}ms` } as React.CSSProperties}>
            <OptionRow
              icon={INSTALL_ICONS[opt.value]}
              title={opt.title}
              description={opt.description}
              isActive={installation === opt.value}
              onClick={() => onChange(opt.value)}
              accentColor="green"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
