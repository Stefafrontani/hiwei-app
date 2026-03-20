import { InMemoryGalleryRepository } from '@/infrastructure/repositories/mock/InMemoryGalleryRepository'
import { GetGalleryFeedUseCase } from '@/application/use-cases/gallery/GetGalleryFeed/GetGalleryFeed.usecase'
import { GalleryFeed } from '@/components/gallery/GalleryFeed'
import { Badge } from '@/components/ui/badge'

export default async function GaleriaPage() {
  const useCase = new GetGalleryFeedUseCase(new InMemoryGalleryRepository())
  const { items } = await useCase.execute()

  return (
    <div className="mx-auto max-w-7xl px-4 pb-32 pt-8 md:px-6">
      {/* Section Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Experience the Road
          </h2>
          <p className="max-w-xl text-muted-foreground">
            Curated dashcam footage showcasing performance across lighting conditions and weather scenarios.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="brand" className="text-xs">Live Feed</Badge>
          <Badge variant="secondary" className="text-xs">24 Active Channels</Badge>
        </div>
      </div>

      {/* Video Grid */}
      <GalleryFeed items={items} />
    </div>
  )
}
