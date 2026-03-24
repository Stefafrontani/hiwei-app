'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import type { DashcamVideo } from '@/domain/value-objects/DashcamVideo'
import { useYouTubePlayer } from '@/hooks/useYouTubePlayer'
import { PlayerControls } from './PlayerControls'

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

interface VideoThumbnailProps {
  video: DashcamVideo
  size?: 'lg' | 'md' | 'sm'
  showLabel?: boolean
  autoplay?: boolean
}

function ActivePlayer({ video, size }: { video: DashcamVideo; size: 'lg' | 'md' | 'sm' }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const aspectClass = size === 'md' ? 'aspect-[16/10]' : 'aspect-video'

  const player = useYouTubePlayer({ videoId: video.youtubeId, autoplay: true })

  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`

  return (
    <div ref={wrapperRef} className={`relative ${aspectClass} w-full overflow-hidden rounded-lg bg-black`}>
      {/* YouTube player target — pointer-events disabled to block all YT UI interaction */}
      <div
        ref={player.containerRef}
        className="absolute inset-0 h-full w-full pointer-events-none [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:h-full [&>iframe]:w-full"
      />

      {/* Thumbnail overlay when ended — covers YouTube end screen */}
      {player.isEnded && (
        <Image
          src={thumbnailUrl}
          alt={video.label}
          fill
          className="absolute inset-0 object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )}

      {/* Custom controls overlay */}
      <PlayerControls
        size={size}
        isPlaying={player.isPlaying}
        isBuffering={player.isBuffering}
        isReady={player.isReady}
        currentTime={player.currentTime}
        duration={player.duration}
        volume={player.volume}
        isMuted={player.isMuted}
        onTogglePlay={player.togglePlay}
        onVolumeChange={player.setVolume}
        onToggleMute={player.toggleMute}
        containerRef={wrapperRef}
      />
    </div>
  )
}

export function VideoThumbnail({ video, size = 'lg', showLabel = true, autoplay = false }: VideoThumbnailProps) {
  const [playing, setPlaying] = useState(autoplay)
  const aspectClass = size === 'md' ? 'aspect-[16/10]' : 'aspect-video'
  const playSize = size === 'sm' ? 'h-8 w-8' : size === 'md' ? 'h-10 w-10' : 'h-16 w-16'
  const playIconSize = size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-7 w-7'
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`

  if (playing) {
    return <ActivePlayer video={video} size={size} />
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className={`relative ${aspectClass} w-full overflow-hidden rounded-lg bg-black group block cursor-pointer`}
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
    </button>
  )
}
