import type { LucideIcon } from 'lucide-react'

type InfoVariant = 'brand' | 'orange' | 'amber' | 'green' | 'red'

const VARIANT_STYLES: Record<InfoVariant, { bg: string; border: string; leftAccent: string; iconBg: string; iconColor: string; textColor: string }> = {
  brand:  { bg: 'bg-brand/5',       border: 'border-brand/15',       leftAccent: 'before:bg-brand',       iconBg: 'bg-brand/15',       iconColor: 'text-brand',       textColor: 'text-brand/90' },
  orange: { bg: 'bg-warning/5',     border: 'border-warning/15',     leftAccent: 'before:bg-warning',     iconBg: 'bg-warning/15',     iconColor: 'text-warning',     textColor: 'text-warning/90' },
  amber:  { bg: 'bg-warning/5',     border: 'border-warning/15',     leftAccent: 'before:bg-warning',     iconBg: 'bg-warning/15',     iconColor: 'text-warning',     textColor: 'text-warning/90' },
  green:  { bg: 'bg-success/5',     border: 'border-success/15',     leftAccent: 'before:bg-success',     iconBg: 'bg-success/15',     iconColor: 'text-success',     textColor: 'text-success/90' },
  red:    { bg: 'bg-destructive/5', border: 'border-destructive/15', leftAccent: 'before:bg-destructive', iconBg: 'bg-destructive/15', iconColor: 'text-destructive', textColor: 'text-destructive/90' },
}

interface InfoBoxProps {
  icon: LucideIcon
  text: string
  variant?: InfoVariant
  className?: string
}

export function InfoBox({ icon: Icon, text, variant = 'brand', className = '' }: InfoBoxProps) {
  const s = VARIANT_STYLES[variant]
  return (
    <div
      className={`relative flex items-start gap-3 rounded-xl border px-4 py-3
        before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-[3px] before:rounded-full
        ${s.bg} ${s.border} ${s.leftAccent} ${className}`}
    >
      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${s.iconBg}`}>
        <Icon className={`h-3 w-3 ${s.iconColor}`} />
      </div>
      <p className={`text-[12px] leading-relaxed ${s.textColor}`}>{text}</p>
    </div>
  )
}
