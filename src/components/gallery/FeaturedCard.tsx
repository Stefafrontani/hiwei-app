'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DotIndicator } from '@/components/ui/dot-indicator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VideoThumbnail } from './VideoThumbnail'
import { useVideoPlaylist } from '@/hooks/useVideoPlaylist'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'
import { type CameraPosition, CAMERA_POSITION_LABELS } from '@/domain/value-objects/CameraPosition'

interface FeaturedCardProps {
  product: DashcamProduct
  activeAngle: CameraPosition
  onAngleChange: (angle: CameraPosition) => void
}

export function FeaturedCard({ product, activeAngle, onAngleChange }: FeaturedCardProps) {
  const { angleVideos, activeVideo, videoIndex, setVideoIndex, handleVideoEnded, slideDirection, shouldAutoplay } = useVideoPlaylist({
    videos: product.videos,
    activeAngle,
  })

  const slideClass = slideDirection === 'right' ? 'slide-in-right' : slideDirection === 'left' ? 'slide-in-left' : ''

  return (
    <Card className="border-0 shadow-none py-2 md:py-4">
      <CardHeader className="px-2 md:px-4">
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
      <CardContent className="flex flex-col gap-4 px-2 md:px-4">
        <div className="overflow-hidden rounded-lg">
          {activeVideo && (
            <div key={videoIndex} className={slideClass}>
              <VideoThumbnail video={activeVideo} size="lg" onEnded={handleVideoEnded} autoplay={shouldAutoplay} />
            </div>
          )}
        </div>
        <DotIndicator total={angleVideos.length} active={videoIndex} onDotClick={setVideoIndex} />
        <Tabs value={activeAngle} onValueChange={(v) => onAngleChange(v as CameraPosition)}>
          <TabsList className="w-full bg-muted p-1 rounded-lg gap-1">
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
