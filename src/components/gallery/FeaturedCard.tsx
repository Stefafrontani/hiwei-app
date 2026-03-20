import { Badge } from '@/components/ui/badge'
import { VideoThumbnail } from './VideoThumbnail'
import { AngleTabs } from './AngleTabs'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'
import type { CameraPosition } from '@/domain/value-objects/CameraPosition'

interface FeaturedCardProps {
  product: DashcamProduct
  activeAngle: CameraPosition
  onAngleChange: (angle: CameraPosition) => void
}

export function FeaturedCard({ product, activeAngle, onAngleChange }: FeaturedCardProps) {
  const activeVideo = product.videos.find((v) => v.cameraPosition === activeAngle) ?? product.videos[0]

  return (
    <section className="lg:col-span-8 flex flex-col gap-4 rounded-xl bg-card p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] uppercase tracking-wider">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Video */}
      <VideoThumbnail video={activeVideo} size="lg" />

      {/* Angle Tabs */}
      <AngleTabs
        angles={product.cameraPositions}
        activeAngle={activeAngle}
        onAngleChange={onAngleChange}
      />
    </section>
  )
}
