import { InMemoryDashcamRepository } from '@/infrastructure/repositories/mock/InMemoryDashcamRepository'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { GalleryFeed } from '@/components/gallery/GalleryFeed'

export default async function GaleriaPage() {
  const repo = new InMemoryDashcamRepository()
  const products = await repo.getAll()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader activeNav="galeria" />
      <div className="mx-auto w-full max-w-7xl px-4 pb-32 pt-8 md:px-6">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Mirá cómo graban nuestras dashcams
          </h2>
          <p className="max-w-xl text-muted-foreground">
            Videos reales en distintas condiciones de luz, clima y velocidad para que compares la calidad de cada modelo.
          </p>
        </div>

        {/* Video Grid */}
        <GalleryFeed products={products} />
      </div>
    </div>
  )
}
