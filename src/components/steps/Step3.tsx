import { Camera } from 'lucide-react'
import { OptionRow } from '@/components/quiz/OptionRow'
import type { CameraPosition } from '@/domain/value-objects/CameraPosition'
import { STEP3 } from '@/content/quiz/steps'

interface Step3Props {
  cameraPositions?: CameraPosition[]
  onChange: (positions: CameraPosition[]) => void
}

function arraysEqual(a?: CameraPosition[], b?: CameraPosition[]) {
  if (!a || !b || a.length !== b.length) return false
  return a.every((v, i) => v === b[i])
}

export function Step3({ cameraPositions, onChange }: Step3Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* Step title */}
      <div className="animate-fade-in-up flex items-start gap-3">
        <div className="hidden md:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10">
          <Camera className="h-5 w-5 text-brand" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-lg font-bold text-foreground md:text-2xl md:tracking-tight">
            {STEP3.title}
          </p>
          <p className="hidden md:block text-sm text-muted-foreground">
            {STEP3.subtitle}
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        <p className="animate-fade-in-up text-[11px] font-semibold uppercase tracking-[1.5px] text-muted-foreground/70 md:text-[12px]"
          style={{ '--delay': '80ms' } as React.CSSProperties}
        >
          {STEP3.sectionLabel}
        </p>

        {STEP3.options.map((opt, i) => (
          <div key={opt.title} className="animate-fade-in-up" style={{ '--delay': `${120 + i * 50}ms` } as React.CSSProperties}>
            <OptionRow
              icon={Camera}
              title={opt.title}
              description={opt.description}
              isActive={arraysEqual(cameraPositions, opt.positions as unknown as CameraPosition[])}
              onClick={() => onChange(opt.positions as unknown as CameraPosition[])}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
