import { VideoOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { VideoThumbnail } from '@/components/gallery/VideoThumbnail'
import { AngleTabs } from '@/components/gallery/AngleTabs'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'
import type { CameraPosition } from '@/domain/value-objects/CameraPosition'

const ANGLE_LABELS: Record<CameraPosition, string> = {
  frontal: 'frontal',
  trasera: 'trasera',
  interior: 'interior',
}

interface ComparatorPlayerCardProps {
  product: DashcamProduct | null
  activeAngle: CameraPosition
  onAngleChange: (angle: CameraPosition) => void
  autoplay: boolean
}

export function ComparatorPlayerCard({ product, activeAngle, onAngleChange, autoplay }: ComparatorPlayerCardProps) {
  if (!product) {
    return (
      <Card className="border-0 shadow-none">
        <div className="flex aspect-video items-center justify-center rounded-lg bg-muted/30">
          <p className="text-sm text-muted-foreground">Seleccioná un modelo</p>
        </div>
      </Card>
    )
  }

  const video = product.videos.find((v) => v.cameraPosition === activeAngle)

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
        {video ? (
          <VideoThumbnail video={video} size="md" showLabel autoplay={autoplay} />
        ) : (
          <div className="flex aspect-[16/10] flex-col items-center justify-center gap-3 rounded-lg bg-muted/20 px-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/30">
              <VideoOff className="h-7 w-7 text-muted-foreground" />
            </div>
            <h4 className="text-sm font-bold text-foreground">No disponible</h4>
            <p className="text-xs text-muted-foreground">
              Este modelo no cuenta con cámara {ANGLE_LABELS[activeAngle]}.
            </p>
          </div>
        )}
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
