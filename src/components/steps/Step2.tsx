import { Video, Info } from 'lucide-react'
import { OptionRow } from '@/components/quiz/OptionRow'
import { InfoBox } from '@/components/quiz/InfoBox'
import type { VideoQuality } from '@/domain/value-objects/VideoQuality'
import { STEP2 } from '@/content/quiz/steps'

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
            {STEP2.title}
          </p>
          <p className="text-[12px] text-muted-foreground md:text-[14px]">
            {STEP2.subtitle}
          </p>
        </div>
      </div>

      <InfoBox
        icon={Info}
        text={STEP2.infoText}
        variant="orange"
      />
      {/* Options */}
      <div className="flex flex-col gap-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-[1px] text-muted-foreground md:text-[12px]">
          {STEP2.sectionLabel}
        </p>

        {STEP2.options.map((opt) => (
          <OptionRow
            key={opt.value}
            icon={Video}
            title={opt.title}
            description={opt.description}
            isActive={videoQuality === opt.value}
            onClick={() => onChange(opt.value)}
          />
        ))}
      </div>
    </div>
  )
}
