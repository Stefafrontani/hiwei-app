import type { LucideIcon } from 'lucide-react'
import { Check } from 'lucide-react'

interface CheckboxRowProps {
  icon: LucideIcon
  title: string
  description: string
  isChecked: boolean
  onChange: (checked: boolean) => void
  note?: React.ReactNode
}

export function CheckboxRow({
  icon: Icon,
  title,
  description,
  isChecked,
  onChange,
  note,
}: CheckboxRowProps) {
  return (
    <div
      className={`flex flex-col rounded-xl transition-all
        ${isChecked ? 'border-2 border-brand bg-brand/10' : 'border border-border bg-card'}`}
    >
      <button
        onClick={() => onChange(!isChecked)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
      >
        {/* Icon */}
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
            ${isChecked ? 'bg-brand/20' : 'bg-muted'}`}
        >
          <Icon className={`h-4 w-4 ${isChecked ? 'text-brand' : 'text-muted-foreground'}`} />
        </div>

        {/* Text */}
        <div className="flex flex-1 flex-col gap-0.5">
          <span
            className={`text-[14px] font-semibold ${isChecked ? 'text-brand' : 'text-foreground'}`}
          >
            {title}
          </span>
          <span className={`text-[11px] ${isChecked ? 'text-brand/80' : 'text-muted-foreground'}`}>
            {description}
          </span>
        </div>

        {/* Checkbox */}
        <div
          className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md transition-colors
            ${isChecked ? 'bg-brand' : 'border border-border bg-card'}`}
        >
          {isChecked && <Check className="h-3 w-3 text-white" />}
        </div>
      </button>

      {/* Conditional note */}
      {note && isChecked && (
        <div className="px-4 pb-3.5">{note}</div>
      )}
    </div>
  )
}
