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
      <p className="text-[18px] font-bold text-[#18181B]">{title}</p>
      <p className="text-[13px] leading-relaxed text-[#71717A]">{message}</p>
      <Button
        onClick={onClose}
        className="h-12 w-full rounded-xl bg-[#2563EB] text-[14px] font-semibold hover:bg-[#1D4ED8]"
      >
        {buttonLabel}
      </Button>
    </div>
  )
}
