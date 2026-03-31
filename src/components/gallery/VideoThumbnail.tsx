'use client'

import { useEffect, useRef } from 'react'
import type { DashcamVideo } from '@/domain/value-objects/DashcamVideo'
import type { VideoQuality } from '@/domain/value-objects/VideoQuality'
import { useVideoPlayer } from '@/hooks/useVideoPlayer'
import { useVideoZoom } from '@/hooks/useVideoZoom'
import { useFullscreen } from '@/hooks/useFullscreen'
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation'
import { PlayerControls } from './PlayerControls'
import { VideoBadges } from './VideoBadges'
import { VideoSkeleton } from './VideoSkeleton'
import { VideoError } from './VideoError'

interface VideoThumbnailProps {
  video: DashcamVideo
  maxQuality: VideoQuality
  size?: 'lg' | 'md' | 'sm'
  showLabel?: boolean
  autoplay?: boolean
  onEnded?: () => void
  replayToken?: number
  advanceDirection?: 'next' | 'prev' | null
  onSwipeNext?: () => void
  onSwipePrev?: () => void
}

export function VideoThumbnail({
  video,
  maxQuality,
  size = 'lg',
  autoplay = true,
  onEnded,
  replayToken,
  advanceDirection,
  onSwipeNext,
  onSwipePrev,
}: VideoThumbnailProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const transitionRef = useRef<HTMLDivElement>(null)
  const aspectClass = size === 'md' ? 'aspect-[16/10]' : 'aspect-video'

  const {
    videoRef,
    isReady,
    isPlaying,
    isBuffering,
    isEnded: videoEnded,
    isError,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    seekTo,
    setVolume,
    toggleMute,
    replay,
    retry,
  } = useVideoPlayer({
    videoUrl: video.videoUrl,
    autoplay,
    loop: !onEnded,
  })

  const { scale, resetZoom, zoomStyle, zoomHandlers } = useVideoZoom({
    containerRef: wrapperRef,
    maxScale: 1.5,
  })

  const { isFullscreen, toggleFullscreen } = useFullscreen({
    targetRef: wrapperRef,
    onExitFullscreen: resetZoom,
  })

  // Disable swipe when zoomed in
  useSwipeNavigation({
    targetRef: wrapperRef,
    onNext: onSwipeNext ?? (() => {}),
    onPrev: onSwipePrev ?? (() => {}),
    enabled: !!(onSwipeNext || onSwipePrev) && scale <= 1,
  })

  // Notify parent when video ends (for playlist)
  const onEndedRef = useRef(onEnded)
  useEffect(() => { onEndedRef.current = onEnded })

  useEffect(() => {
    if (videoEnded) onEndedRef.current?.()
  }, [videoEnded])

  // Reset zoom when video changes
  const prevUrlRef = useRef(video.videoUrl)
  useEffect(() => {
    if (prevUrlRef.current !== video.videoUrl) {
      resetZoom()
      prevUrlRef.current = video.videoUrl
    }
  }, [video.videoUrl, resetZoom])

  // Playlist advancement / replay with slide transition
  const prevReplayRef = useRef(replayToken)
  const directionRef = useRef(advanceDirection)
  useEffect(() => { directionRef.current = advanceDirection })

  const allTransitionClasses = 'video-transition-exit-next video-transition-enter-next video-transition-exit-prev video-transition-enter-prev'

  useEffect(() => {
    if (replayToken === undefined || replayToken === prevReplayRef.current) return
    prevReplayRef.current = replayToken

    const el = transitionRef.current
    const dir = directionRef.current
    if (!el || !dir) {
      replay()
      return
    }

    const exitClass = `video-transition-exit-${dir}`
    const enterClass = `video-transition-enter-${dir}`

    el.classList.remove(...allTransitionClasses.split(' '))
    el.classList.add(exitClass)

    const exitTimer = setTimeout(() => {
      replay()

      el.classList.remove(exitClass)
      el.classList.add(enterClass)

      const enterTimer = setTimeout(() => {
        el.classList.remove(enterClass)
      }, 280)

      return () => clearTimeout(enterTimer)
    }, 120)

    return () => clearTimeout(exitTimer)
  }, [replayToken, replay, allTransitionClasses])

  return (
    <div
      ref={wrapperRef}
      popover="manual"
      className={`video-popover relative ${aspectClass} w-full overflow-hidden rounded-lg bg-black`}
      {...zoomHandlers}
    >
      {/* Badges — always visible, above zoom layer */}
      <VideoBadges cameraPosition={video.cameraPosition} maxQuality={maxQuality} />

      {/* Transition wrapper */}
      <div ref={transitionRef} className="absolute inset-0">
        {/* Video element — always in DOM for ref/listeners */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          style={zoomStyle}
          muted
          playsInline
          preload="metadata"
        />

        {/* Loading skeleton overlay */}
        {!isReady && !isError && <VideoSkeleton />}

        {/* Error overlay */}
        {isError && <VideoError onRetry={retry} />}

        {/* Custom controls overlay — above zoom (not inside zoomStyle) */}
        <PlayerControls
          size={isFullscreen ? 'lg' : size}
          isPlaying={isPlaying}
          isBuffering={isBuffering}
          isReady={isReady}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          isFullscreen={isFullscreen}
          onTogglePlay={togglePlay}
          onVolumeChange={setVolume}
          onToggleMute={toggleMute}
          onToggleFullscreen={toggleFullscreen}
          onSeek={seekTo}
        />
      </div>
    </div>
  )
}
