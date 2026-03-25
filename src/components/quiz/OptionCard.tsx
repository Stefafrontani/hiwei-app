import type { LucideIcon } from 'lucide-react'

interface OptionCardProps {
  icon?: LucideIcon
  label?: string
  subLabel?: string
  isActive: boolean
  onClick: () => void
}

export function OptionCard({ icon: Icon, label, subLabel, isActive, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={`group relative flex flex-col items-center justify-center gap-2 rounded-2xl transition-all duration-200
        h-20 w-24 md:h-28 md:w-32
        ${isActive
          ? 'glass-card border-brand/50 bg-brand/10 glow-brand animate-select-bounce'
          : 'glass-card hover:border-brand/25 hover:scale-[1.03] active:scale-[0.98]'}`}
    >
      {/* Glow ring behind icon when active */}
      {Icon && (
        <div className="relative">
          {isActive && (
            <div className="absolute inset-0 rounded-full bg-brand/20 blur-md scale-150" />
          )}
          <Icon
            className={`relative h-6 w-6 md:h-7 md:w-7 transition-colors duration-200
              ${isActive ? 'text-brand' : 'text-muted-foreground group-hover:text-foreground'}`}
          />
        </div>
      )}
      {label && (
        <span
          className={`text-[12px] font-semibold md:text-[13px] transition-colors duration-200
            ${isActive ? 'text-brand' : 'text-muted-foreground group-hover:text-foreground'}`}
        >
          {label}
        </span>
      )}
      {subLabel && (
        <span
          className={`text-[11px] font-medium transition-colors duration-200
            ${isActive ? 'text-brand/80' : 'text-muted-foreground/70 group-hover:text-muted-foreground'}`}
        >
          {subLabel}
        </span>
      )}
    </button>
  )
}
