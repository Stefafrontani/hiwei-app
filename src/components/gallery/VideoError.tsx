import { AlertTriangle, RotateCcw } from 'lucide-react'

interface VideoErrorProps {
  onRetry: () => void
}

export function VideoError({ onRetry }: VideoErrorProps) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/80">
      <AlertTriangle className="h-8 w-8 text-white/50" />
      <p className="text-sm text-white/60">No se pudo cargar el video</p>
      <button
        type="button"
        onClick={onRetry}
        className="flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/80 active:scale-95"
      >
        <RotateCcw className="h-4 w-4" />
        Reintentar
      </button>
    </div>
  )
}
