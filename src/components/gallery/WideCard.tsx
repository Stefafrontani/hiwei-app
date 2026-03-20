import { Badge } from '@/components/ui/badge'
import { Zap } from 'lucide-react'
import { VideoThumbnail } from './VideoThumbnail'
import type { GalleryItem } from '@/domain/entities/GalleryItem'

interface WideCardProps {
  item: GalleryItem
}

export function WideCard({ item }: WideCardProps) {
  return (
    <section className="lg:col-span-12 rounded-xl bg-card p-6">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary">
            <Zap className="h-5 w-5 text-brand" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{item.productName}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {item.specBadges.map((badge) => (
            <Badge key={badge} variant="secondary" className="text-[10px]">
              {badge}
            </Badge>
          ))}
        </div>
      </div>

      {/* Two videos side by side */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {item.videos.map((video) => (
          <VideoThumbnail key={video.label} video={video} size="lg" showLabel />
        ))}
      </div>
    </section>
  )
}
