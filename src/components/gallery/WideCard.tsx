import { Badge } from '@/components/ui/badge'
import { Zap } from 'lucide-react'
import { VideoThumbnail } from './VideoThumbnail'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'

interface WideCardProps {
  product: DashcamProduct
}

export function WideCard({ product }: WideCardProps) {
  return (
    <section className="lg:col-span-12 rounded-xl bg-card p-6">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary">
            <Zap className="h-5 w-5 text-brand" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {product.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Two videos side by side */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {product.videos.map((video) => (
          <VideoThumbnail key={video.label} video={video} size="lg" showLabel />
        ))}
      </div>
    </section>
  )
}
