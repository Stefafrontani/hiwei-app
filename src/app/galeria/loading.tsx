import { SiteHeader } from '@/components/layout/SiteHeader'

export default function GaleriaLoading() {
  return (
    <div className="quiz-gradient grain-overlay flex h-dvh flex-col overflow-hidden">
      <SiteHeader activeNav="galeria" />
      <main className="flex-1 overflow-y-auto no-scrollbar">
        <div className="mx-auto w-full max-w-7xl px-4 pb-32 pt-6 md:px-6 md:pt-8">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="h-8 w-72 animate-pulse rounded-lg bg-white/[0.06]" />
            <div className="mt-2 h-4 w-56 animate-pulse rounded bg-white/[0.06]" />
          </div>

          {/* Product card skeletons */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-card flex flex-col gap-3 rounded-2xl border-white/[0.06] p-4">
                <div className="aspect-video w-full animate-pulse rounded-xl bg-white/[0.06]" />
                <div className="h-5 w-40 animate-pulse rounded bg-white/[0.06]" />
                <div className="h-4 w-28 animate-pulse rounded bg-white/[0.06]" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
