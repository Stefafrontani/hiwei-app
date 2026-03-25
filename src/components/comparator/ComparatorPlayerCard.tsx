import { VideoOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VideoThumbnail } from '@/components/gallery/VideoThumbnail'
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
  autoplay: boolean
}

export function ComparatorPlayerCard({ product, activeAngle, autoplay }: ComparatorPlayerCardProps) {
  if (!product) {
    return (
      <Card className="border-0 shadow-none gap-2">
        <CardHeader>
          <CardTitle className="text-lg font-bold invisible">&lrm;</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex aspect-[16/10] items-center justify-center rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground">Seleccioná un modelo</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const video = product.videos.find((v) => v.cameraPosition === activeAngle)

  return (
    <Card className="animate-in fade-in duration-300 border-0 shadow-none gap-2">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  )
}
