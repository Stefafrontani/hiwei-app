import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VideoErrorProps {
  onRetry: () => void
}

export function VideoError({ onRetry }: VideoErrorProps) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black/80">
      <AlertTriangle className="h-8 w-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">No se pudo cargar el video</p>
      <Button variant="secondary" onClick={onRetry}>
        <RotateCcw />
        Reintentar
      </Button>
    </div>
  )
}
