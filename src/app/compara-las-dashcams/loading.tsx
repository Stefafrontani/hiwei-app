import { SiteHeader } from '@/components/layout/SiteHeader'

export default function ComparadorLoading() {
  return (
    <div className="quiz-gradient grain-overlay flex h-dvh flex-col overflow-hidden">
      <SiteHeader activeNav="comparador" />
      <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        <div className="mx-auto w-full max-w-7xl px-4 pb-32 pt-6 md:px-6 md:pt-8">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="h-8 w-64 animate-pulse rounded-lg bg-white/[0.06]" />
            <div className="mt-2 h-4 w-80 animate-pulse rounded bg-white/[0.06]" />
          </div>

          {/* Model selector skeletons */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-3 w-20 animate-pulse rounded bg-white/[0.06]" />
                <div className="h-11 w-full animate-pulse rounded-lg bg-white/[0.06]" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
