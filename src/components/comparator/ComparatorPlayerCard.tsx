'use client'

import { useCallback } from 'react'
import { VideoOff } from 'lucide-react'
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
  variant?: 'default' | 'immersive'
  showFullscreen?: boolean
}

export function ComparatorPlayerCard({ product, activeAngle, autoplay, playbackKey, variant = 'default', showFullscreen = true }: ComparatorPlayerCardProps) {
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

  const isImmersive = variant === 'immersive'

  if (!product) {
    if (isImmersive) return null
    return (
      <div className="flex flex-col gap-3 rounded-2xl glass-card border-white/[0.06] p-3 md:p-4">
        <div className="invisible text-base font-bold">&lrm;</div>
        <div className="flex aspect-[16/10] items-center justify-center rounded-xl bg-white/[0.03]">
          <p className="text-sm text-muted-foreground/60">Seleccioná un modelo</p>
        </div>
        <div className="h-2" />
      </div>
    )
  }

  const videoElement = activeVideo ? (
    <VideoThumbnail
      video={activeVideo}
      maxQuality={product.maxQuality}
      size={isImmersive ? 'lg' : 'md'}
      autoplay={autoplay || shouldAutoplay}
      onEnded={handleVideoEnded}
      replayToken={replayToken}
      onPrev={angleVideos.length > 1 ? goPrev : undefined}
      onNext={angleVideos.length > 1 ? goNext : undefined}
      showFullscreen={showFullscreen}
    />
  ) : (
    <div className={`flex ${isImmersive ? 'aspect-video' : 'aspect-[16/10]'} flex-col items-center justify-center gap-3 rounded-xl bg-white/[0.03] px-8 text-center`}>
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

  if (isImmersive) {
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

  return (
    <div className="flex flex-col gap-3 rounded-2xl glass-card border-white/[0.06] p-3 md:p-4">
      <h3 className="text-base font-bold text-foreground px-1">{product.name}</h3>
      <div className="overflow-hidden rounded-xl">
        {videoElement}
      </div>
      <DotIndicator total={angleVideos.length} active={videoIndex} onDotClick={setVideoIndex} />
    </div>
  )
}
