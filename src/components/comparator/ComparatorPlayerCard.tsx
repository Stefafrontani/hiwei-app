'use client'

import { VideoOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DotIndicator } from '@/components/ui/dot-indicator'
import { VideoThumbnail } from '@/components/gallery/VideoThumbnail'
import { useVideoPlaylist } from '@/hooks/useVideoPlaylist'
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
  playbackKey: number
}

export function ComparatorPlayerCard({ product, activeAngle, autoplay, playbackKey }: ComparatorPlayerCardProps) {
  const { angleVideos, activeVideo, videoIndex, setVideoIndex, handleVideoEnded, slideDirection, shouldAutoplay } = useVideoPlaylist({
    videos: product?.videos ?? [],
    activeAngle,
    resetKey: playbackKey,
  })

  const slideClass = slideDirection === 'right' ? 'slide-in-right' : slideDirection === 'left' ? 'slide-in-left' : ''

  if (!product) {
    return (
      <Card className="border-0 shadow-none gap-2 py-2 md:py-4">
        <CardHeader className="px-2 md:px-4">
          <CardTitle className="text-lg font-bold invisible">&lrm;</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 px-2 md:px-4">
          <div className="flex aspect-[16/10] items-center justify-center rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground">Seleccioná un modelo</p>
          </div>
          <div className="h-4" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-none gap-2 py-2 md:py-4">
      <CardHeader className="px-2 md:px-4">
        <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 px-2 md:px-4">
        <div className="overflow-hidden rounded-lg">
          {activeVideo ? (
            <div key={`${playbackKey}-${videoIndex}`} className={slideClass}>
              <VideoThumbnail video={activeVideo} size="md" showLabel autoplay={autoplay || shouldAutoplay} onEnded={handleVideoEnded} />
            </div>
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
        </div>
        <div className="h-4 flex items-center justify-center">
          <DotIndicator total={angleVideos.length} active={videoIndex} onDotClick={setVideoIndex} />
        </div>
      </CardContent>
    </Card>
  )
}
