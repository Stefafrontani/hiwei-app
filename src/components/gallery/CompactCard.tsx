import { Badge } from '@/components/ui/badge'
import { VideoThumbnail } from './VideoThumbnail'
import { AngleTabs } from './AngleTabs'
import type { GalleryItem } from '@/domain/entities/GalleryItem'
import type { CameraPosition } from '@/domain/value-objects/CameraPosition'

interface CompactCardProps {
  item: GalleryItem
  activeAngle: CameraPosition
  onAngleChange: (angle: CameraPosition) => void
}

export function CompactCard({ item, activeAngle, onAngleChange }: CompactCardProps) {
  const activeVideo = item.videos.find((v) => v.cameraPosition === activeAngle) ?? item.videos[0]

  return (
    <section className="flex flex-col gap-4 rounded-xl bg-card p-5">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-foreground">{item.productName}</h3>
        <p className="text-[12px] text-muted-foreground">{item.description}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {item.specBadges.map((badge) => (
            <Badge key={badge} variant="secondary" className="text-[10px]">
              {badge}
            </Badge>
          ))}
        </div>
      </div>

      {/* Video */}
      <VideoThumbnail video={activeVideo} size="md" />

      {/* Angle Tabs */}
      <AngleTabs
        angles={item.cameraPositions}
        activeAngle={activeAngle}
        onAngleChange={onAngleChange}
        size="sm"
      />
    </section>
  )
}
