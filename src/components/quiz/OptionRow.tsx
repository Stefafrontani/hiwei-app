import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface OptionRowProps {
  icon: LucideIcon
  title: string
  description: string
  isActive: boolean
  onClick: () => void
  badge?: string
  accentColor?: 'blue' | 'green'
}

export function OptionRow({
  icon: Icon,
  title,
  description,
  isActive,
  onClick,
  badge,
  accentColor = 'blue',
}: OptionRowProps) {
  const colors = {
    blue: {
      border: 'border-brand',
      bg: 'bg-brand/10',
      iconBg: 'bg-brand/20',
      iconColor: 'text-brand',
      title: 'text-brand',
      desc: 'text-brand/80',
      dot: 'bg-brand',
    },
    green: {
      border: 'border-success',
      bg: 'bg-success/10',
      iconBg: 'bg-success/20',
      iconColor: 'text-success',
      title: 'text-foreground',
      desc: 'text-muted-foreground',
      dot: 'bg-success',
    },
  }
  const c = isActive ? colors[accentColor] : null

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-all
        ${isActive
          ? `border-2 ${c!.border} ${c!.bg}`
          : 'border border-border bg-card hover:border-brand/40'}`}
    >
      {/* Icon */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
          ${isActive ? c!.iconBg : 'bg-muted'}`}
      >
        <Icon className={`h-[18px] w-[18px] ${isActive ? c!.iconColor : 'text-muted-foreground'}`} />
      </div>

      {/* Text */}
      <div className="flex flex-1 flex-col gap-0.5">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-[14px] font-semibold ${isActive ? c!.title : 'text-foreground'}`}
          >
            {title}
          </span>
          {badge && isActive && (
            <Badge className="bg-brand text-white text-[10px] px-2 py-0.5 h-auto">
              {badge}
            </Badge>
          )}
        </div>
        <span
          className={`text-[12px] ${isActive ? c!.desc : 'text-muted-foreground'}`}
        >
          {description}
        </span>
      </div>

      {/* Radio dot */}
      <div
        className={`h-[18px] w-[18px] shrink-0 rounded-full border-2 transition-colors
          ${isActive ? `${c!.dot} border-transparent` : 'border-border bg-card'}`}
      />
    </button>
  )
}
