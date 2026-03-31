export function VideoSkeleton() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80">
      <div className="video-loading-spinner" />
      <p className="mt-3 text-xs text-white/40">Cargando video...</p>
    </div>
  )
}
