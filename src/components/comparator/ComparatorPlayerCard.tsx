'use client'

import { useCallback } from 'react'
import { VideoOff } from 'lucide-react'
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
  showFullscreen?: boolean
  onFullscreenChange?: (isFullscreen: boolean) => void
  siblingFullscreen?: boolean
}

export function ComparatorPlayerCard({ product, activeAngle, autoplay, playbackKey, showFullscreen = true, onFullscreenChange, siblingFullscreen }: ComparatorPlayerCardProps) {
  const { angleVideos, activeVideo, videoIndex, setVideoIndex, handleVideoEnded, shouldAutoplay, replayToken } = useVideoPlaylist({
    videos: product?.videos ?? [],
    activeAngle,
    resetKey: playbackKey,
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

  if (!product) return null

  const videoElement = activeVideo ? (
    <VideoThumbnail
      video={activeVideo}
      maxQuality={product.maxQuality}
      size="lg"
      autoplay={autoplay || shouldAutoplay}
      onEnded={handleVideoEnded}
      replayToken={replayToken}
      onPrev={angleVideos.length > 1 ? goPrev : undefined}
      onNext={angleVideos.length > 1 ? goNext : undefined}
      showFullscreen={showFullscreen}
      showBadges={false}
      onFullscreenChange={onFullscreenChange}
      siblingFullscreen={siblingFullscreen}
    />
  ) : (
    <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-xl bg-white/[0.03] px-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.05]">
        <VideoOff className="h-6 w-6 text-muted-foreground/50" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-foreground/80">No disponible</h4>
        <p className="text-xs text-muted-foreground/50">
          Este modelo no cuenta con cámara {ANGLE_LABELS[activeAngle]}.
        </p>
      </div>
    </div>
  )

  return (
    <div className="relative w-full md:flex-1 md:min-w-0">
      {/* Model name badge */}
      <div className="absolute top-2 left-2 z-20 rounded-md bg-black/60 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
        {product.name}
      </div>
      <div className="overflow-hidden rounded-lg">
        {videoElement}
      </div>
    </div>
  )
}
