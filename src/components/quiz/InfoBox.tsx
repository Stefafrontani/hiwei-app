import type { LucideIcon } from 'lucide-react'

type InfoVariant = 'blue' | 'orange' | 'amber' | 'green' | 'red'

const VARIANT_STYLES: Record<InfoVariant, { bg: string; border: string; iconColor: string; textColor: string }> = {
  blue: { bg: 'bg-[#EFF6FF]', border: 'border-[#BFDBFE]', iconColor: 'text-[#2563EB]', textColor: 'text-[#1D4ED8]' },
  orange: { bg: 'bg-[#FFF7ED]', border: 'border-[#FED7AA]', iconColor: 'text-[#F97316]', textColor: 'text-[#9A3412]' },
  amber: { bg: 'bg-[#FFFBEB]', border: 'border-[#FDE68A]', iconColor: 'text-[#D97706]', textColor: 'text-[#92400E]' },
  green: { bg: 'bg-[#F0FDF4]', border: 'border-[#BBF7D0]', iconColor: 'text-[#16A34A]', textColor: 'text-[#166534]' },
  red: { bg: 'bg-[#FEF2F2]', border: 'border-[#FCA5A5]', iconColor: 'text-[#EF4444]', textColor: 'text-[#DC2626]' },
}

interface InfoBoxProps {
  icon: LucideIcon
  text: string
  variant?: InfoVariant
  className?: string
}

export function InfoBox({ icon: Icon, text, variant = 'blue', className = '' }: InfoBoxProps) {
  const s = VARIANT_STYLES[variant]
  return (
    <div
      className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 ${s.bg} ${s.border} ${className}`}
    >
      <Icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${s.iconColor}`} />
      <p className={`text-[11px] leading-relaxed ${s.textColor}`}>{text}</p>
    </div>
  )
}
