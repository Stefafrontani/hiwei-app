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
    <div className="flex flex-col gap-6">
      {/* Step title */}
      <div className="animate-fade-in-up flex items-start gap-3">
        <div className="hidden md:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10">
          <Video className="h-5 w-5 text-brand" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-lg font-bold text-foreground md:text-2xl md:tracking-tight">
            {STEP2.title}
          </p>
          <p className="hidden md:block text-sm text-muted-foreground">
            {STEP2.subtitle}
          </p>
        </div>
      </div>

      <div className="animate-fade-in-up" style={{ '--delay': '80ms' } as React.CSSProperties}>
        <InfoBox
          icon={Info}
          text={STEP2.infoText}
          variant="orange"
        />
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        <p className="animate-fade-in-up text-xs font-semibold uppercase tracking-[1.5px] text-muted-foreground/70"
          style={{ '--delay': '120ms' } as React.CSSProperties}
        >
          {STEP2.sectionLabel}
        </p>

        {STEP2.options.map((opt, i) => (
          <div key={opt.value} className="animate-fade-in-up" style={{ '--delay': `${160 + i * 50}ms` } as React.CSSProperties}>
            <OptionRow
              icon={Video}
              title={opt.title}
              description={opt.description}
              isActive={videoQuality === opt.value}
              onClick={() => onChange(opt.value)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
