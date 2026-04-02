'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { DotIndicator } from '@/components/ui/dot-indicator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VideoThumbnail } from './VideoThumbnail'
import { useVideoPlaylist } from '@/hooks/useVideoPlaylist'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'
import { type CameraPosition, CAMERA_POSITION_LABELS } from '@/domain/value-objects/CameraPosition'

interface ProductCardProps {
  product: DashcamProduct
  activeAngle: CameraPosition
  onAngleChange: (angle: CameraPosition) => void
}

export function ProductCard({ product, activeAngle, onAngleChange }: ProductCardProps) {
  const { angleVideos, activeVideo, videoIndex, setVideoIndex, handleVideoEnded, shouldAutoplay, replayToken } = useVideoPlaylist({
    videos: product.videos,
    activeAngle,
  })

  const goNext = useCallback(() => {
    if (angleVideos.length <= 1) return
    const next = (videoIndex + 1) % angleVideos.length
    setVideoIndex(next)
  }, [angleVideos.length, videoIndex, setVideoIndex])

  const goPrev = useCallback(() => {
    if (angleVideos.length <= 1) return
    const prev = (videoIndex - 1 + angleVideos.length) % angleVideos.length
    setVideoIndex(prev)
  }, [angleVideos.length, videoIndex, setVideoIndex])

  const [descOpen, setDescOpen] = useState(false)
  const [descOverflows, setDescOverflows] = useState(false)
  const descWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = descWrapRef.current
    if (!el) return
    setDescOverflows(el.scrollHeight > el.clientHeight + 1)
  }, [product.description])

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      {/* Video area */}
      <div className="-mx-4 overflow-hidden md:mx-0 md:rounded-xl">
        {activeVideo && (
          <VideoThumbnail
            video={activeVideo}
            maxQuality={product.maxQuality}
            size="lg"
            onEnded={handleVideoEnded}
            autoplay={shouldAutoplay}
            replayToken={replayToken}
            onPrev={angleVideos.length > 1 ? goPrev : undefined}
            onNext={angleVideos.length > 1 ? goNext : undefined}
          />
        )}
      </div>

      {/* Controls: dots + angle tabs */}
      <div className="flex flex-col gap-3 md:px-0">
        <DotIndicator total={angleVideos.length} active={videoIndex} onDotClick={setVideoIndex} />
        <Tabs value={activeAngle} onValueChange={(v) => onAngleChange(v as CameraPosition)}>
          <TabsList className="w-full bg-white/[0.05] p-1 rounded-lg gap-1">
            {product.cameraPositions.map((angle) => (
              <TabsTrigger
                key={angle}
                value={angle}
                className="flex-1 py-1.5 text-xs font-medium data-[state=active]:bg-brand data-[state=active]:text-brand-foreground data-[state=active]:font-bold data-[state=active]:shadow-none"
              >
                {CAMERA_POSITION_LABELS[angle]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Product info */}
      <div className="flex flex-col gap-2 md:px-1">
        <h3 className="text-base font-bold text-foreground md:text-lg">{product.name}</h3>
        <div className="flex flex-wrap gap-1.5">
          {product.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Expandable description */}
        <Collapsible open={descOpen} onOpenChange={setDescOpen}>
          <div
            ref={descWrapRef}
            className="overflow-hidden transition-[max-height] duration-300 ease-out"
            style={{ maxHeight: descOpen ? `${descWrapRef.current?.scrollHeight ?? 200}px` : '4.3rem' }}
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>
          {descOverflows && (
            <CollapsibleTrigger asChild>
              <Button variant="link" className="mt-1 h-auto p-0 text-xs font-semibold text-brand">
                {descOpen ? 'Ver menos' : 'Ver más'}
              </Button>
            </CollapsibleTrigger>
          )}
        </Collapsible>
      </div>
    </div>
  )
}
