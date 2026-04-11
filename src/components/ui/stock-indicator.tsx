import { cn } from '@/lib/utils'

interface StockIndicatorProps {
  stock: number
  className?: string
}

// [RUSA] TODO: mejorar el diseño del StockIndicator y implementarlo en donde corresponda
export function StockIndicator({ stock, className }: StockIndicatorProps) {
  if (stock <= 0) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-md bg-info px-2 py-0.5 text-xs font-semibold text-info-foreground',
          className
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-info-foreground" />
        Entrega en 15 días
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md bg-success/10 px-2 py-0.5 text-xs font-semibold text-success',
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-success" />
      Entrega inmediata
    </span>
  )
}
