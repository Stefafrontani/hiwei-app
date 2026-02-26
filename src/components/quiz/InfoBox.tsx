import type { LucideIcon } from 'lucide-react'

type InfoVariant = 'blue' | 'orange' | 'amber' | 'green' | 'red'

const VARIANT_STYLES: Record<InfoVariant, { bg: string; border: string; iconColor: string; textColor: string }> = {
  blue:   { bg: 'bg-brand/10',       border: 'border-brand/30',       iconColor: 'text-brand',       textColor: 'text-brand' },
  orange: { bg: 'bg-warning/10',     border: 'border-warning/30',     iconColor: 'text-warning',     textColor: 'text-warning' },
  amber:  { bg: 'bg-warning/10',     border: 'border-warning/30',     iconColor: 'text-warning',     textColor: 'text-warning' },
  green:  { bg: 'bg-success/10',     border: 'border-success/30',     iconColor: 'text-success',     textColor: 'text-success' },
  red:    { bg: 'bg-destructive/10', border: 'border-destructive/30', iconColor: 'text-destructive', textColor: 'text-destructive' },
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
