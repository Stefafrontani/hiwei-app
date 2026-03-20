import { Badge } from '@/components/ui/badge'
import { VideoThumbnail } from './VideoThumbnail'
import { AngleTabs } from './AngleTabs'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'
import type { CameraPosition } from '@/domain/value-objects/CameraPosition'

interface CompactCardProps {
  product: DashcamProduct
  activeAngle: CameraPosition
  onAngleChange: (angle: CameraPosition) => void
}

export function CompactCard({ product, activeAngle, onAngleChange }: CompactCardProps) {
  const activeVideo = product.videos.find((v) => v.cameraPosition === activeAngle) ?? product.videos[0]

  return (
    <section className="flex flex-col gap-4 rounded-xl bg-card p-5">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-foreground">{product.name}</h3>
        <p className="text-[12px] text-muted-foreground">{product.description}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {product.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Video */}
      <VideoThumbnail video={activeVideo} size="md" />

      {/* Angle Tabs */}
      <AngleTabs
        angles={product.cameraPositions}
        activeAngle={activeAngle}
        onAngleChange={onAngleChange}
        size="sm"
      />
    </section>
  )
}
