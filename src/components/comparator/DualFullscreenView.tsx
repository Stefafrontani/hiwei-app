'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VideoThumbnail } from '@/components/gallery/VideoThumbnail'
import { useVideoPlaylist } from '@/hooks/useVideoPlaylist'
import { useDualFullscreen } from '@/hooks/useDualFullscreen'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'
import { type CameraPosition, CAMERA_POSITION_LABELS } from '@/domain/value-objects/CameraPosition'

interface DualFullscreenViewProps {
  productA: DashcamProduct
  productB: DashcamProduct
  activeAngle: CameraPosition
  availableAngles: CameraPosition[]
  onAngleChange: (angle: CameraPosition) => void
  onClose: () => void
  playbackKey: number
}

function DualVideoPanel({ product, activeAngle, playbackKey, label }: {
  product: DashcamProduct
  activeAngle: CameraPosition
  playbackKey: number
  label: string
}) {
  const { angleVideos, activeVideo, videoIndex, setVideoIndex, handleVideoEnded, shouldAutoplay, replayToken } = useVideoPlaylist({
    videos: product.videos,
    activeAngle,
    resetKey: playbackKey,
  })

  const goNext = useCallback(() => {
    if (angleVideos.length <= 1) return
    setVideoIndex((videoIndex + 1) % angleVideos.length)
  }, [angleVideos.length, videoIndex, setVideoIndex])

  const goPrev = useCallback(() => {
    if (angleVideos.length <= 1) return
    setVideoIndex((videoIndex - 1 + angleVideos.length) % angleVideos.length)
  }, [angleVideos.length, videoIndex, setVideoIndex])

  return (
    <div className="relative flex-1 min-w-0 h-full flex items-center">
      {/* Model name badge */}
      <div className="absolute top-2 left-2 z-20 rounded-md bg-black/60 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
        {label}
      </div>
      {activeVideo ? (
        <VideoThumbnail
          video={activeVideo}
          maxQuality={product.maxQuality}
          size="lg"
          autoplay={true}
          onEnded={handleVideoEnded}
          replayToken={replayToken}
          onPrev={angleVideos.length > 1 ? goPrev : undefined}
          onNext={angleVideos.length > 1 ? goNext : undefined}
          showFullscreen={false}
        />
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-white/[0.03] text-sm text-muted-foreground/50">
          No disponible
        </div>
      )}
    </div>
  )
}

export function DualFullscreenView({
  productA,
  productB,
  activeAngle,
  availableAngles,
  onAngleChange,
  onClose,
  playbackKey,
}: DualFullscreenViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [overlayVisible, setOverlayVisible] = useState(true)
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(null)

  const { isDualFullscreen, enterDualFullscreen, exitDualFullscreen } = useDualFullscreen({
    targetRef: containerRef,
    onExit: onClose,
  })

  // Auto-enter on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { enterDualFullscreen() }, [])

  // Auto-hide overlay controls
  const resetHideTimer = useCallback(() => {
    setOverlayVisible(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setOverlayVisible(false), 3000)
  }, [])

  useEffect(() => {
    hideTimer.current = setTimeout(() => setOverlayVisible(false), 3000)
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      popover="manual"
      className="dual-fullscreen-popover flex-row gap-px bg-black"
      onTouchStart={resetHideTimer}
      onMouseMove={resetHideTimer}
    >
      {/* Videos side by side */}
      <DualVideoPanel product={productA} activeAngle={activeAngle} playbackKey={playbackKey} label={productA.name} />
      <div className="w-px bg-white/10 shrink-0" />
      <DualVideoPanel product={productB} activeAngle={activeAngle} playbackKey={playbackKey} label={productB.name} />

      {/* Overlay controls */}
      <div className={`absolute inset-x-0 top-0 z-50 flex items-center justify-center gap-3 bg-gradient-to-b from-black/60 to-transparent px-4 pt-3 pb-6 transition-opacity duration-300 ${overlayVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Close button */}
        <button
          type="button"
          onClick={exitDualFullscreen}
          className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Angle tabs */}
        <Tabs value={activeAngle} onValueChange={(v) => onAngleChange(v as CameraPosition)}>
          <TabsList className="bg-black/50 backdrop-blur-sm p-0.5 rounded-lg gap-0.5">
            {availableAngles.map((angle) => (
              <TabsTrigger
                key={angle}
                value={angle}
                className="px-3 py-1.5 text-xs font-medium data-[state=active]:bg-brand data-[state=active]:text-brand-foreground data-[state=active]:font-bold data-[state=active]:shadow-none"
              >
                {CAMERA_POSITION_LABELS[angle]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
