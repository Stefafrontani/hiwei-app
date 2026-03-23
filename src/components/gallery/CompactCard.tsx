import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
        <div className="flex flex-wrap gap-1.5">
          {product.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>
        <CardDescription className="text-[12px]">{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <VideoThumbnail video={activeVideo} size="md" />
        <AngleTabs
          angles={product.cameraPositions}
          activeAngle={activeAngle}
          onAngleChange={onAngleChange}
          size="sm"
        />
      </CardContent>
    </Card>
  )
}
