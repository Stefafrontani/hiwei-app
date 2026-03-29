import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface OptionRowProps {
  icon: LucideIcon
  title: string
  description: string
  isActive: boolean
  onClick: () => void
  badge?: string
  accentColor?: 'brand' | 'green'
}

export function OptionRow({
  icon: Icon,
  title,
  description,
  isActive,
  onClick,
  badge,
  accentColor = 'brand',
}: OptionRowProps) {
  const colors = {
    brand: {
      border: 'border-brand/50',
      leftAccent: 'before:bg-brand',
      bg: 'bg-brand/10',
      iconBg: 'bg-brand/15',
      iconColor: 'text-brand',
      title: 'text-brand',
      desc: 'text-brand/70',
      ring: 'border-brand bg-brand',
    },
    green: {
      border: 'border-success/50',
      leftAccent: 'before:bg-success',
      bg: 'bg-success/10',
      iconBg: 'bg-success/15',
      iconColor: 'text-success',
      title: 'text-foreground',
      desc: 'text-muted-foreground',
      ring: 'border-success bg-success',
    },
  }
  const c = isActive ? colors[accentColor] : null

  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={`group relative flex w-full items-center gap-3.5 rounded-2xl px-4 py-4 text-left transition-all duration-200
        before:absolute before:left-0 before:top-3 before:bottom-3 before:w-[3px] before:rounded-full before:transition-all before:duration-200
        ${isActive
          ? `glass-card ${c!.border} ${c!.bg} glow-brand before:opacity-100 ${c!.leftAccent} animate-select-bounce`
          : 'glass-card hover:border-brand/20 hover:bg-card/80 before:opacity-0 active:scale-[0.99]'}`}
    >
      {/* Icon */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200
          ${isActive ? c!.iconBg : 'bg-muted/50 group-hover:bg-muted'}`}
      >
        <Icon className={`h-[18px] w-[18px] transition-colors duration-200 ${isActive ? c!.iconColor : 'text-muted-foreground group-hover:text-foreground'}`} />
      </div>

      {/* Text */}
      <div className="flex flex-1 flex-col gap-0.5">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-sm font-semibold transition-colors duration-200
              ${isActive ? c!.title : 'text-foreground'}`}
          >
            {title}
          </span>
          {badge && isActive && (
            <Badge className="bg-brand text-brand-foreground text-xs px-2 py-0.5 h-auto">
              {badge}
            </Badge>
          )}
        </div>
        <span
          className={`text-xs transition-colors duration-200
            ${isActive ? c!.desc : 'text-muted-foreground'}`}
        >
          {description}
        </span>
      </div>

      {/* Radio indicator */}
      <div
        className={`h-[18px] w-[18px] shrink-0 rounded-full border-2 transition-all duration-200
          ${isActive
            ? `${c!.ring} border-transparent shadow-[0_0_8px_2px] shadow-brand/20`
            : 'border-muted-foreground/30 bg-transparent group-hover:border-muted-foreground/50'}`}
      >
        {isActive && (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-1.5 w-1.5 rounded-full bg-brand-foreground" />
          </div>
        )}
      </div>
    </button>
  )
}
