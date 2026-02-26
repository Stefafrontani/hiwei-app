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
      border: 'border-[#2563EB]',
      bg: 'bg-[#EFF6FF]',
      iconBg: 'bg-[#DBEAFE]',
      iconColor: 'text-[#2563EB]',
      title: 'text-[#2563EB]',
      desc: 'text-[#3B82F6]',
      dot: 'bg-[#2563EB]',
    },
    green: {
      border: 'border-[#16A34A]',
      bg: 'bg-[#F0FDF4]',
      iconBg: 'bg-[#DCFCE7]',
      iconColor: 'text-[#16A34A]',
      title: 'text-[#18181B]',
      desc: 'text-[#71717A]',
      dot: 'bg-[#16A34A]',
    },
  }
  const c = isActive ? colors[accentColor] : null

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-all
        ${isActive
          ? `border-2 ${c!.border} ${c!.bg}`
          : 'border border-[#E4E4E7] bg-white hover:border-[#2563EB]/40'}`}
    >
      {/* Icon */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
          ${isActive ? c!.iconBg : 'bg-[#F4F4F5]'}`}
      >
        <Icon className={`h-[18px] w-[18px] ${isActive ? c!.iconColor : 'text-[#71717A]'}`} />
      </div>

      {/* Text */}
      <div className="flex flex-1 flex-col gap-0.5">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-[14px] font-semibold ${isActive ? c!.title : 'text-[#18181B]'}`}
          >
            {title}
          </span>
          {badge && isActive && (
            <Badge className="bg-[#2563EB] text-white text-[10px] px-2 py-0.5 h-auto">
              {badge}
            </Badge>
          )}
        </div>
        <span
          className={`text-[12px] ${isActive ? c!.desc : 'text-[#71717A]'}`}
        >
          {description}
        </span>
      </div>

      {/* Radio dot */}
      <div
        className={`h-[18px] w-[18px] shrink-0 rounded-full border-2 transition-colors
          ${isActive ? `${c!.dot} border-transparent` : 'border-[#E4E4E7] bg-white'}`}
      />
    </button>
  )
}
