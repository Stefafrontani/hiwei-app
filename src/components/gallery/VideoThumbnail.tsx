import Image from 'next/image'
import { Play } from 'lucide-react'
import type { DashcamVideo } from '@/domain/value-objects/DashcamVideo'

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

interface VideoThumbnailProps {
  video: DashcamVideo
  size?: 'lg' | 'md' | 'sm'
  showLabel?: boolean
}

export function VideoThumbnail({ video, size = 'lg', showLabel = false }: VideoThumbnailProps) {
  const aspectClass = size === 'md' ? 'aspect-[16/10]' : 'aspect-video'
  const playSize = size === 'sm' ? 'h-8 w-8' : size === 'md' ? 'h-10 w-10' : 'h-16 w-16'
  const playIconSize = size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-7 w-7'
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`

  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative ${aspectClass} w-full overflow-hidden rounded-lg bg-black group block`}
    >
      <Image
        src={thumbnailUrl}
        alt={video.label}
        fill
        className="object-cover opacity-60 transition-opacity group-hover:opacity-80"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`${playSize} rounded-full bg-brand flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 active:scale-90`}>
          <Play className={`${playIconSize} fill-brand-foreground text-brand-foreground`} />
        </div>
      </div>

      {/* Duration */}
      <div className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white backdrop-blur">
        {formatDuration(video.durationSeconds)}
      </div>

      {/* Label */}
      {showLabel && (
        <div className="absolute left-2 top-2 rounded bg-black/40 px-2 py-0.5 text-[10px] text-white backdrop-blur">
          {video.label}
        </div>
      )}
    </a>
  )
}
