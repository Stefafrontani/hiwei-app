'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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
  const { angleVideos, activeVideo, videoIndex, setVideoIndex, handleVideoEnded, slideDirection, shouldAutoplay, replayToken, advanceDirection } = useVideoPlaylist({
    videos: product.videos,
    activeAngle,
  })

  const slideRef = useRef<HTMLDivElement>(null)
  const slideClass = slideDirection === 'right' ? 'slide-in-right' : slideDirection === 'left' ? 'slide-in-left' : ''

  // Mobile swipe callbacks for horizontal navigation between angle videos
  const swipeNext = useCallback(() => {
    if (angleVideos.length <= 1) return
    const next = (videoIndex + 1) % angleVideos.length
    setVideoIndex(next)
  }, [angleVideos.length, videoIndex, setVideoIndex])

  const swipePrev = useCallback(() => {
    if (angleVideos.length <= 1) return
    const prev = (videoIndex - 1 + angleVideos.length) % angleVideos.length
    setVideoIndex(prev)
  }, [angleVideos.length, videoIndex, setVideoIndex])
  const [descOpen, setDescOpen] = useState(false)
  const [descOverflows, setDescOverflows] = useState(false)
  const descWrapRef = useRef<HTMLDivElement>(null)

  // Re-trigger slide animation imperatively (no key-based remount)
  useEffect(() => {
    const el = slideRef.current
    if (!el || !slideClass) return
    el.classList.remove('slide-in-right', 'slide-in-left')
    void el.offsetWidth // force reflow
    el.classList.add(slideClass)
  }, [videoIndex, slideClass])

  useEffect(() => {
    const el = descWrapRef.current
    if (!el) return
    setDescOverflows(el.scrollHeight > el.clientHeight + 1)
  }, [product.description])

  return (
    <div className="flex flex-col gap-3 md:gap-4 md:rounded-2xl md:glass-card md:border-white/[0.06] md:p-4">
      {/* Video area — full-width on mobile (breaks out of page padding), contained on desktop */}
      <div className="-mx-4 overflow-hidden md:mx-0 md:rounded-xl">
        {activeVideo && (
          <div ref={slideRef}>
            <VideoThumbnail video={activeVideo} maxQuality={product.maxQuality} size="lg" onEnded={handleVideoEnded} autoplay={shouldAutoplay} replayToken={replayToken} advanceDirection={advanceDirection} onSwipeNext={angleVideos.length > 1 ? swipeNext : undefined} onSwipePrev={angleVideos.length > 1 ? swipePrev : undefined} />
          </div>
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
              <button
                type="button"
                className="mt-1 text-xs font-semibold text-brand hover:underline"
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
