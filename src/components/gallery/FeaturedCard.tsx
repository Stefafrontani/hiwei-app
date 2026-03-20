import { Badge } from '@/components/ui/badge'
import { VideoThumbnail } from './VideoThumbnail'
import { AngleTabs } from './AngleTabs'
import type { GalleryItem } from '@/domain/entities/GalleryItem'
import type { CameraPosition } from '@/domain/value-objects/CameraPosition'

interface FeaturedCardProps {
  item: GalleryItem
  activeAngle: CameraPosition
  onAngleChange: (angle: CameraPosition) => void
}

export function FeaturedCard({ item, activeAngle, onAngleChange }: FeaturedCardProps) {
  const activeVideo = item.videos.find((v) => v.cameraPosition === activeAngle) ?? item.videos[0]

  return (
    <section className="lg:col-span-8 flex flex-col gap-4 rounded-xl bg-card p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground">{item.productName}</h3>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {item.specBadges.map((badge) => (
            <Badge key={badge} variant="secondary" className="text-[10px] uppercase tracking-wider">
              {badge}
            </Badge>
          ))}
          {item.highlightBadge && (
            <Badge variant="brand" className="text-[10px] uppercase tracking-wider">
              {item.highlightBadge}
            </Badge>
          )}
        </div>
      </div>

      {/* Video */}
      <VideoThumbnail video={activeVideo} size="lg" />

      {/* Angle Tabs */}
      <AngleTabs
        angles={item.cameraPositions}
        activeAngle={activeAngle}
        onAngleChange={onAngleChange}
      />
    </section>
  )
}
