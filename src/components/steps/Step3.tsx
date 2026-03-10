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
    <div className="flex flex-col gap-5">
      {/* Step title */}
      <div className="flex items-start gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-brand/10">
          <Camera className="h-[18px] w-[18px] text-brand" />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-[16px] font-semibold text-foreground md:text-[22px] md:font-bold">
            {STEP3.title}
          </p>
          <p className="text-[12px] text-muted-foreground md:text-[14px]">
            {STEP3.subtitle}
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-[1px] text-muted-foreground md:text-[12px]">
          {STEP3.sectionLabel}
        </p>

        {STEP3.options.map((opt) => (
          <OptionRow
            key={opt.title}
            icon={Camera}
            title={opt.title}
            description={opt.description}
            isActive={arraysEqual(cameraPositions, opt.positions as unknown as CameraPosition[])}
            onClick={() => onChange(opt.positions as unknown as CameraPosition[])}
          />
        ))}
      </div>
    </div>
  )
}
