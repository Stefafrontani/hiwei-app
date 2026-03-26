'use client'

import { useEffect, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
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
  const { angleVideos, activeVideo, videoIndex, setVideoIndex, handleVideoEnded, slideDirection, shouldAutoplay } = useVideoPlaylist({
    videos: product.videos,
    activeAngle,
  })

  const slideClass = slideDirection === 'right' ? 'slide-in-right' : slideDirection === 'left' ? 'slide-in-left' : ''
  const [descOpen, setDescOpen] = useState(false)
  const [descOverflows, setDescOverflows] = useState(false)
  const descWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = descWrapRef.current
    if (!el) return
    setDescOverflows(el.scrollHeight > el.clientHeight + 1)
  }, [product.description])

  return (
    <div className="flex flex-col gap-4 rounded-2xl glass-card border-white/[0.06] p-3 md:p-4">
      {/* Video area */}
      <div className="overflow-hidden rounded-xl">
        {activeVideo && (
          <div key={videoIndex} className={slideClass}>
            <VideoThumbnail video={activeVideo} size="lg" onEnded={handleVideoEnded} autoplay={shouldAutoplay} />
          </div>
        )}
      </div>

      {/* Controls: dots + angle tabs */}
      <div className="flex flex-col gap-3">
        <DotIndicator total={angleVideos.length} active={videoIndex} onDotClick={setVideoIndex} />
        <Tabs value={activeAngle} onValueChange={(v) => onAngleChange(v as CameraPosition)}>
          <TabsList className="w-full bg-white/[0.05] p-1 rounded-lg gap-1">
            {product.cameraPositions.map((angle) => (
              <TabsTrigger
                key={angle}
                value={angle}
                className="flex-1 py-1.5 text-[11px] font-medium data-[state=active]:bg-brand data-[state=active]:text-brand-foreground data-[state=active]:font-bold data-[state=active]:shadow-none"
              >
                {CAMERA_POSITION_LABELS[angle]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Product info */}
      <div className="flex flex-col gap-2 px-1">
        <h3 className="text-[16px] font-bold text-foreground md:text-[18px]">{product.name}</h3>
        <div className="flex flex-wrap gap-1.5">
          {product.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Expandable description */}
        <Collapsible open={descOpen} onOpenChange={setDescOpen}>
          <div
            ref={descWrapRef}
            className="overflow-hidden transition-[max-height] duration-300 ease-out"
            style={{ maxHeight: descOpen ? `${descWrapRef.current?.scrollHeight ?? 200}px` : '3.9rem' }}
          >
            <p className="text-[12px] leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>
          {descOverflows && (
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="mt-1 text-[11px] font-semibold text-brand hover:underline"
              >
                {descOpen ? 'Ver menos' : 'Ver más'}
              </button>
            </CollapsibleTrigger>
          )}
        </Collapsible>
      </div>
    </div>
  )
}
