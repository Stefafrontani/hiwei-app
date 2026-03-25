import { cn } from '@/lib/utils'

interface DotIndicatorProps {
  total: number
  active: number
  onDotClick: (index: number) => void
  className?: string
}

export function DotIndicator({ total, active, onDotClick, className }: DotIndicatorProps) {
  if (total <= 1) return null

  return (
    <div className={cn('flex items-center justify-center gap-1.5', className)}>
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onDotClick(i)}
          className={cn(
            'rounded-full transition-all duration-300',
            i === active ? 'h-2 w-5 bg-foreground' : 'h-2 w-2 bg-border',
          )}
          aria-label={`Video ${i + 1} de ${total}`}
        />
      ))}
    </div>
  )
}
