interface OptionCardProps {
  label?: string
  subLabel?: string
  isActive: boolean
  onClick: () => void
}

export function OptionCard({ label, subLabel, isActive, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={`group relative flex flex-col items-center justify-center gap-1.5 rounded-2xl transition-all duration-200
        h-20 w-full md:h-28
        ${isActive
          ? 'glass-card border-brand/50 bg-brand/10 glow-brand animate-select-bounce'
          : 'glass-card hover:border-brand/25 hover:scale-[1.03] active:scale-[0.98]'}`}
    >
      {label && (
        <span
          className={`text-base font-bold md:text-lg tracking-tight transition-colors duration-200
            ${isActive ? 'text-brand' : 'text-muted-foreground group-hover:text-foreground'}`}
        >
          {label}
        </span>
      )}
      {subLabel && (
        <span
          className={`text-xs font-medium transition-colors duration-200
            ${isActive ? 'text-brand/80' : 'text-muted-foreground/70 group-hover:text-muted-foreground'}`}
        >
          {subLabel}
        </span>
      )}
    </button>
  )
}
