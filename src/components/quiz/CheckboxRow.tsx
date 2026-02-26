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
        ${isChecked ? 'border-2 border-[#2563EB] bg-[#EFF6FF]' : 'border border-[#E4E4E7] bg-white'}`}
    >
      <button
        onClick={() => onChange(!isChecked)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
      >
        {/* Icon */}
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
            ${isChecked ? 'bg-[#DBEAFE]' : 'bg-[#F4F4F5]'}`}
        >
          <Icon className={`h-4 w-4 ${isChecked ? 'text-[#2563EB]' : 'text-[#71717A]'}`} />
        </div>

        {/* Text */}
        <div className="flex flex-1 flex-col gap-0.5">
          <span
            className={`text-[14px] font-semibold ${isChecked ? 'text-[#2563EB]' : 'text-[#18181B]'}`}
          >
            {title}
          </span>
          <span className={`text-[11px] ${isChecked ? 'text-[#3B82F6]' : 'text-[#71717A]'}`}>
            {description}
          </span>
        </div>

        {/* Checkbox */}
        <div
          className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md transition-colors
            ${isChecked ? 'bg-[#2563EB]' : 'border border-[#E4E4E7] bg-white'}`}
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
