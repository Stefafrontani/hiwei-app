import { cn } from '@/lib/utils'

interface SelectionRowProps {
  isActive: boolean
  onClick: () => void
  disabled?: boolean
  accentColor?: 'brand' | 'green' | 'info'
  children: React.ReactNode
  className?: string
}

const COLORS = {
  brand: {
    border: 'border-brand/50',
    leftAccent: 'before:bg-brand',
    bg: 'bg-brand/10',
    ring: 'border-brand bg-brand',
    glow: 'glow-brand',
  },
  green: {
    border: 'border-success/50',
    leftAccent: 'before:bg-success',
    bg: 'bg-success/10',
    ring: 'border-success bg-success',
    glow: 'glow-brand',
  },
  info: {
    border: 'border-info/50',
    leftAccent: 'before:bg-info',
    bg: 'bg-info/10',
    ring: 'border-info bg-info',
    glow: 'glow-brand',
  },
}

export function SelectionRow({
  isActive,
  onClick,
  disabled = false,
  accentColor = 'brand',
  children,
  className,
}: SelectionRowProps) {
  const c = COLORS[accentColor]

  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group relative flex w-full items-center gap-3.5 rounded-2xl px-4 py-4 text-left transition-all duration-200',
        'before:absolute before:left-0 before:top-3 before:bottom-3 before:w-[3px] before:rounded-full before:transition-all before:duration-200',
        disabled
          ? 'cursor-not-allowed opacity-40'
          : isActive
            ? `glass-card ${c.border} ${c.bg} ${c.glow} before:opacity-100 ${c.leftAccent} animate-select-bounce`
            : 'glass-card hover:border-brand/20 hover:bg-card/80 before:opacity-0 active:scale-[0.99]',
        className,
      )}
    >
      {children}

      {/* Radio indicator */}
      <div
        className={`h-[18px] w-[18px] shrink-0 rounded-full border-2 transition-all duration-200 ${
          isActive && !disabled
            ? `${c.ring} border-transparent shadow-[0_0_8px_2px] shadow-brand/20`
            : 'border-muted-foreground/30 bg-transparent group-hover:border-muted-foreground/50'
        }`}
      >
        {isActive && !disabled && (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-1.5 w-1.5 rounded-full bg-brand-foreground" />
          </div>
        )}
      </div>
    </button>
  )
}
