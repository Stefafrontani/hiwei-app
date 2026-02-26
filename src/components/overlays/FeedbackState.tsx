import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FeedbackStateProps {
  icon: LucideIcon
  iconBg: string
  iconColor: string
  title: string
  message: string
  onClose: () => void
  buttonLabel?: string
}

export function FeedbackState({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  message,
  onClose,
  buttonLabel = 'Entendido',
}: FeedbackStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full ${iconBg}`}
      >
        <Icon className={`h-8 w-8 ${iconColor}`} />
      </div>
      <p className="text-[18px] font-bold text-foreground">{title}</p>
      <p className="text-[13px] leading-relaxed text-muted-foreground">{message}</p>
      <Button
        onClick={onClose}
        variant="brand"
        className="h-12 w-full rounded-xl text-[14px] font-semibold"
      >
        {buttonLabel}
      </Button>
    </div>
  )
}
