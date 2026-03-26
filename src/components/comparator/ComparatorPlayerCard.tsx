'use client'

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
      <div className="flex flex-col gap-3 rounded-2xl glass-card border-white/[0.06] p-3 md:p-4">
        <div className="invisible text-[16px] font-bold">&lrm;</div>
        <div className="flex aspect-[16/10] items-center justify-center rounded-xl bg-white/[0.03]">
          <p className="text-[13px] text-muted-foreground/60">Seleccioná un modelo</p>
        </div>
        <div className="h-2" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl glass-card border-white/[0.06] p-3 md:p-4">
      <h3 className="text-[16px] font-bold text-foreground px-1">{product.name}</h3>
      <div className="overflow-hidden rounded-xl">
        {activeVideo ? (
          <div key={`${playbackKey}-${videoIndex}`} className={slideClass}>
            <VideoThumbnail video={activeVideo} size="md" showLabel autoplay={autoplay || shouldAutoplay} onEnded={handleVideoEnded} />
          </div>
        ) : (
          <div className="flex aspect-[16/10] flex-col items-center justify-center gap-3 rounded-xl bg-white/[0.03] px-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.05]">
              <VideoOff className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-foreground/80">No disponible</h4>
              <p className="text-[11px] text-muted-foreground/50">
                Este modelo no cuenta con cámara {ANGLE_LABELS[activeAngle]}.
              </p>
            </div>
          </div>
        )}
      </div>
      <DotIndicator total={angleVideos.length} active={videoIndex} onDotClick={setVideoIndex} />
    </div>
  )
}
