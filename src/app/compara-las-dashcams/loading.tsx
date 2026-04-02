import { Skeleton } from '@/components/ui/skeleton'
import { SiteHeader } from '@/components/layout/SiteHeader'

export default function ComparadorLoading() {
  return (
    <div className="quiz-gradient grain-overlay flex h-dvh flex-col overflow-hidden">
      <SiteHeader activeNav="comparador" />
      <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        <div className="mx-auto w-full max-w-7xl px-4 pb-32 pt-6 md:px-6 md:pt-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="mt-2 h-4 w-80" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
