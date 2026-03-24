import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VideoThumbnail } from './VideoThumbnail'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'
import { type CameraPosition, CAMERA_POSITION_LABELS } from '@/domain/value-objects/CameraPosition'

interface FeaturedCardProps {
  product: DashcamProduct
  activeAngle: CameraPosition
  onAngleChange: (angle: CameraPosition) => void
}

export function FeaturedCard({ product, activeAngle, onAngleChange }: FeaturedCardProps) {
  const activeVideo = product.videos.find((v) => v.cameraPosition === activeAngle) ?? product.videos[0]

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{product.name}</CardTitle>
        <div className="flex flex-wrap gap-2">
          {product.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] uppercase tracking-wider">
              {tag}
            </Badge>
          ))}
        </div>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <VideoThumbnail video={activeVideo} size="lg" />
        <Tabs value={activeAngle} onValueChange={(v) => onAngleChange(v as CameraPosition)}>
          <TabsList className="w-full bg-background p-1 rounded-lg gap-1">
            {product.cameraPositions.map((angle) => (
              <TabsTrigger
                key={angle}
                value={angle}
                className="flex-1 py-2 text-xs font-medium data-[state=active]:bg-brand data-[state=active]:text-brand-foreground data-[state=active]:font-bold data-[state=active]:shadow-none"
              >
                {CAMERA_POSITION_LABELS[angle]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  )
}
