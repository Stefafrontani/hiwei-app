import { InMemoryDashcamRepository } from '@/infrastructure/repositories/mock/InMemoryDashcamRepository'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { GalleryFeed } from '@/components/gallery/GalleryFeed'

export default async function GaleriaPage() {
  const repo = new InMemoryDashcamRepository()
  const products = await repo.getAll()

  return (
    <div className="quiz-gradient grain-overlay flex h-dvh flex-col overflow-hidden">
      <SiteHeader activeNav="galeria" />
      <main className="flex-1 overflow-y-auto no-scrollbar">
        <div className="mx-auto w-full max-w-7xl px-4 pb-32 pt-6 md:px-6 md:pt-8">
          {/* Section Header */}
          <div className="animate-fade-in-up mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Mirá cómo graban nuestras dashcams
            </h2>
            <p className="mt-1 text-[13px] text-muted-foreground md:text-[14px]">
              Videos reales en distintas condiciones de luz, clima y velocidad.
            </p>
          </div>

          <GalleryFeed products={products} />
        </div>
      </main>
    </div>
  )
}
