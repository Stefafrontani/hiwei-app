import type { LucideIcon } from 'lucide-react'

interface OptionCardProps {
  icon: LucideIcon
  label: string
  subLabel?: string
  isActive: boolean
  onClick: () => void
}

export function OptionCard({ icon: Icon, label, subLabel, isActive, onClick }: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 rounded-xl transition-all
        h-[72px] w-[82px]
        md:h-24 md:w-[120px] md:rounded-2xl
        ${isActive
          ? 'border-2 border-brand bg-brand/10'
          : 'border border-border bg-card hover:border-brand/40'}`}
    >
      <Icon
        className={`h-[22px] w-[22px] md:h-7 md:w-7 ${isActive ? 'text-brand' : 'text-muted-foreground'}`}
      />
      <span
        className={`text-[11px] font-semibold md:text-[13px] ${isActive ? 'text-brand' : 'text-muted-foreground'}`}
      >
        {label}
      </span>
      {subLabel && (
        <span className={`text-[10px] font-medium ${isActive ? 'text-brand/80' : 'text-muted-foreground'}`}>
          {subLabel}
        </span>
      )}
    </button>
  )
}
