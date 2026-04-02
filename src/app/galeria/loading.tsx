import { Skeleton } from '@/components/ui/skeleton'
import { SiteHeader } from '@/components/layout/SiteHeader'

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <div className="-mx-4 md:mx-0 md:rounded-xl overflow-hidden">
        <Skeleton className="aspect-video w-full rounded-none md:rounded-xl" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="mx-auto h-2 w-12" />
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-40" />
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}

export default function GaleriaLoading() {
  return (
    <div className="quiz-gradient grain-overlay flex h-dvh flex-col overflow-hidden">
      <SiteHeader activeNav="galeria" />
      <main className="flex-1 overflow-y-auto no-scrollbar">
        <div className="mx-auto w-full max-w-7xl px-4 pb-32 pt-6 md:px-6 md:pt-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-72" />
            <Skeleton className="mt-2 h-4 w-56" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
