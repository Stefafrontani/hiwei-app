import type { LucideIcon } from 'lucide-react'
import type { VariantProps } from 'class-variance-authority'
import { Button, buttonVariants } from '@/components/ui/button'

interface FeedbackStateProps {
  icon: LucideIcon
  iconBg: string
  iconColor: string
  title: string
  message: string
  onClose: () => void
  buttonLabel?: string
  buttonVariant?: VariantProps<typeof buttonVariants>['variant']
  glow?: boolean
}

export function FeedbackState({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  message,
  onClose,
  buttonLabel = 'Entendido',
  buttonVariant = 'brand',
  glow = false,
}: FeedbackStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-6 text-center">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full ${iconBg} ${glow ? 'animate-glow-pulse' : ''}`}
      >
        <Icon className={`h-8 w-8 ${iconColor}`} />
      </div>
      <p className="text-lg font-bold text-foreground">{title}</p>
      <p className="text-sm leading-relaxed text-muted-foreground">{message}</p>
      <Button onClick={onClose} variant={buttonVariant} className="w-full">
        {buttonLabel}
      </Button>
    </div>
  )
}
