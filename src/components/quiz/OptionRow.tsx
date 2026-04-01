import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { SelectionRow } from '@/components/ui/selection-row'

interface OptionRowProps {
  icon: LucideIcon
  title: string
  description: string
  isActive: boolean
  onClick: () => void
  badge?: string
  accentColor?: 'brand' | 'green' | 'info'
}

const ICON_COLORS = {
  brand: { bg: 'bg-brand/15', text: 'text-brand' },
  green: { bg: 'bg-success/15', text: 'text-success' },
  info: { bg: 'bg-info/15', text: 'text-info' },
}

const TEXT_COLORS = {
  brand: { title: 'text-brand', desc: 'text-brand/70' },
  green: { title: 'text-foreground', desc: 'text-muted-foreground' },
  info: { title: 'text-foreground', desc: 'text-muted-foreground' },
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
  const ic = isActive ? ICON_COLORS[accentColor] : null
  const tc = isActive ? TEXT_COLORS[accentColor] : null

  return (
    <SelectionRow isActive={isActive} onClick={onClick} accentColor={accentColor}>
      {/* Icon */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200
          ${isActive ? ic!.bg : 'bg-muted/50 group-hover:bg-muted'}`}
      >
        <Icon className={`h-[18px] w-[18px] transition-colors duration-200 ${isActive ? ic!.text : 'text-muted-foreground group-hover:text-foreground'}`} />
      </div>

      {/* Text */}
      <div className="flex flex-1 flex-col gap-0.5">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-sm font-semibold transition-colors duration-200
              ${isActive ? tc!.title : 'text-foreground'}`}
          >
            {title}
          </span>
          {badge && isActive && (
            <Badge className="bg-brand text-brand-foreground text-xs px-2 py-0.5 h-auto">
              {badge}
            </Badge>
          )}
        </div>
        <div
          className="grid transition-all duration-300 ease-out"
          style={{ gridTemplateRows: isActive ? '1fr' : '0fr' }}
        >
          <span
            className={`overflow-hidden text-xs transition-colors duration-200
              ${isActive ? tc!.desc : 'text-muted-foreground'}`}
          >
            {description}
          </span>
        </div>
      </div>
    </SelectionRow>
  )
}
