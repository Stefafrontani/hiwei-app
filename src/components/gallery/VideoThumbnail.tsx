'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import type { DashcamVideo } from '@/domain/value-objects/DashcamVideo'
import { useYouTubePlayer } from '@/hooks/useYouTubePlayer'
import { useFullscreen } from '@/hooks/useFullscreen'
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation'
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
  onEnded?: () => void
  replayToken?: number
  advanceDirection?: 'next' | 'prev' | null
  onSwipeNext?: () => void
  onSwipePrev?: () => void
}

function ActivePlayer({ video, size, onEnded, replayToken, advanceDirection, onSwipeNext, onSwipePrev }: { video: DashcamVideo; size: 'lg' | 'md' | 'sm'; onEnded?: () => void; replayToken?: number; advanceDirection?: 'next' | 'prev' | null; onSwipeNext?: () => void; onSwipePrev?: () => void }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const transitionRef = useRef<HTMLDivElement>(null)
  const aspectClass = size === 'md' ? 'aspect-[16/10]' : 'aspect-video'

  const player = useYouTubePlayer({ videoId: video.youtubeId, autoplay: true })
  const { isFullscreen, toggleFullscreen } = useFullscreen({ targetRef: wrapperRef })

  // Hide iframe until video starts playing — thumbnail shows behind it instead of black
  const [hasStarted, setHasStarted] = useState(false)
  useEffect(() => {
    if (player.isPlaying) setHasStarted(true)
  }, [player.isPlaying])

  // Mobile swipe navigation (horizontal) — attached to the actual touch target
  useSwipeNavigation({
    targetRef: wrapperRef,
    onNext: onSwipeNext ?? (() => {}),
    onPrev: onSwipePrev ?? (() => {}),
    enabled: !!(onSwipeNext || onSwipePrev),
  })

  // Use ref for onEnded to prevent double-firing when callback identity changes
  const onEndedRef = useRef(onEnded)
  useEffect(() => { onEndedRef.current = onEnded })

  useEffect(() => {
    if (player.isEnded) onEndedRef.current?.()
  }, [player.isEnded])

  // Playlist advancement / single-video loop.
  // Slide transition only on multi-video advance (next/prev), not on single-video loop.
  const prevReplayRef = useRef(replayToken)
  const directionRef = useRef(advanceDirection)
  useEffect(() => { directionRef.current = advanceDirection })

  const allTransitionClasses = 'video-transition-exit-next video-transition-enter-next video-transition-exit-prev video-transition-enter-prev'

  useEffect(() => {
    if (replayToken === undefined || replayToken === prevReplayRef.current) return
    prevReplayRef.current = replayToken

    const el = transitionRef.current
    const dir = directionRef.current
    // No animation for single-video loop (dir === null) or if ref unavailable
    if (!el || !dir) {
      player.replay()
      return
    }

    // Reset so thumbnail shows until new video plays
    setHasStarted(false)

    const exitClass = `video-transition-exit-${dir}`
    const enterClass = `video-transition-enter-${dir}`

    // Phase 1: exit
    el.classList.remove(...allTransitionClasses.split(' '))
    el.classList.add(exitClass)

    const exitTimer = setTimeout(() => {
      player.replay()

      // Phase 2: enter
      el.classList.remove(exitClass)
      el.classList.add(enterClass)

      const enterTimer = setTimeout(() => {
        el.classList.remove(enterClass)
      }, 280)

      return () => clearTimeout(enterTimer)
    }, 120)

    return () => clearTimeout(exitTimer)
  }, [replayToken, player.replay, allTransitionClasses])

  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`

  return (
    <div
      ref={wrapperRef}
      popover="manual"
      className={`video-popover relative ${aspectClass} w-full overflow-hidden rounded-lg bg-black`}
    >
      {/* Thumbnail background — visible during transitions instead of black */}
      <Image
        src={thumbnailUrl}
        alt=""
        fill
        className="absolute inset-0 object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Inner wrapper for slide transition — covers thumbnail when opaque */}
      <div ref={transitionRef} className="absolute inset-0">
        {/* YouTube player target — hidden until video starts playing so thumbnail shows instead of black iframe */}
        <div
          ref={player.containerRef}
          className={`absolute inset-0 h-full w-full pointer-events-none [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:h-full [&>iframe]:w-full ${hasStarted ? '' : 'opacity-0'}`}
        />

        {/* Thumbnail overlay when ended — covers YouTube end screen.
           Skip when onEnded is set (playlist/loop) to prevent flash between render cycles. */}
        {player.isEnded && !onEnded && (
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
          size={isFullscreen ? 'lg' : size}
          isPlaying={player.isPlaying}
          isBuffering={player.isBuffering}
          isReady={player.isReady}
          currentTime={player.currentTime}
          duration={player.duration}
          volume={player.volume}
          isMuted={player.isMuted}
          isFullscreen={isFullscreen}
          onTogglePlay={player.togglePlay}
          onVolumeChange={player.setVolume}
          onToggleMute={player.toggleMute}
          onToggleFullscreen={toggleFullscreen}
          onSeek={player.seekTo}
        />
      </div>
    </div>
  )
}

export function VideoThumbnail({ video, size = 'lg', showLabel = true, autoplay = false, onEnded, replayToken, advanceDirection, onSwipeNext, onSwipePrev }: VideoThumbnailProps) {
  const [playing, setPlaying] = useState(autoplay)
  const aspectClass = size === 'md' ? 'aspect-[16/10]' : 'aspect-video'
  const playSize = size === 'sm' ? 'h-8 w-8' : size === 'md' ? 'h-10 w-10' : 'h-16 w-16'
  const playIconSize = size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-7 w-7'
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`

  if (playing) {
    return <ActivePlayer video={video} size={size} onEnded={onEnded} replayToken={replayToken} advanceDirection={advanceDirection} onSwipeNext={onSwipeNext} onSwipePrev={onSwipePrev} />
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
