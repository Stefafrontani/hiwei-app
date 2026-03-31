import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { VideoThumbnail } from './VideoThumbnail'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'

interface WideCardProps {
  product: DashcamProduct
}

export function WideCard({ product }: WideCardProps) {
  return (
    <Card className="lg:col-span-12 border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{product.name}</CardTitle>
        <div className="flex flex-wrap gap-2">
          {product.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {product.videos.map((video) => (
            <VideoThumbnail key={video.label} video={video} maxQuality={product.maxQuality} size="lg" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
