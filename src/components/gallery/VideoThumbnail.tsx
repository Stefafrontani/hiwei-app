'use client'

import { useEffect, useRef } from 'react'
import type { DashcamVideo } from '@/domain/value-objects/DashcamVideo'
import type { VideoQuality } from '@/domain/value-objects/VideoQuality'
import { useVideoPlayer } from '@/hooks/useVideoPlayer'
import { useVideoZoom } from '@/hooks/useVideoZoom'
import { useFullscreen } from '@/hooks/useFullscreen'
import { PlayerControls } from './PlayerControls'
import { VideoBadges } from './VideoBadges'
import { VideoSkeleton } from './VideoSkeleton'
import { VideoError } from './VideoError'

interface VideoThumbnailProps {
  video: DashcamVideo
  maxQuality: VideoQuality
  size?: 'lg' | 'md' | 'sm'
  autoplay?: boolean
  onEnded?: () => void
  replayToken?: number
  onPrev?: () => void
  onNext?: () => void
  showFullscreen?: boolean
  showBadges?: boolean
  onFullscreenChange?: (isFullscreen: boolean) => void
  siblingFullscreen?: boolean
}

export function VideoThumbnail({
  video,
  maxQuality,
  size = 'lg',
  autoplay = true,
  onEnded,
  replayToken,
  onPrev,
  onNext,
  showFullscreen = true,
  showBadges = true,
  onFullscreenChange,
  siblingFullscreen,
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

  const { isFullscreen, isRotated, toggleFullscreen } = useFullscreen({
    targetRef: wrapperRef,
    onExitFullscreen: () => resetZoom(),
  })

  const { scale, isGesturing, resetZoom, zoomStyle, zoomHandlers } = useVideoZoom({
    containerRef: wrapperRef,
    maxScale: 1.5,
    isRotated,
  })

  // Notify parent when fullscreen changes
  const onFullscreenChangeRef = useRef(onFullscreenChange)
  useEffect(() => { onFullscreenChangeRef.current = onFullscreenChange })
  useEffect(() => {
    onFullscreenChangeRef.current?.(isFullscreen)
  }, [isFullscreen])

  // Pause/mute when sibling enters fullscreen, resume when it exits
  useEffect(() => {
    const video = videoRef.current
    if (!video || siblingFullscreen === undefined) return
    if (siblingFullscreen) {
      video.pause()
      video.muted = true
    } else {
      video.muted = true
      video.play().catch(() => {})
    }
  }, [siblingFullscreen])

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

  // Crossfade transition on video change
  const prevReplayRef = useRef(replayToken)

  useEffect(() => {
    if (replayToken === undefined || replayToken === prevReplayRef.current) return
    prevReplayRef.current = replayToken

    const el = transitionRef.current
    if (!el) {
      replay()
      return
    }

    // Subtle fade: dim slightly, swap, restore
    el.style.opacity = '0.4'

    const fadeOutTimer = setTimeout(() => {
      replay()
      el.style.opacity = '1'
    }, 150)

    return () => clearTimeout(fadeOutTimer)
  }, [replayToken, replay])

  return (
    <div
      ref={wrapperRef}
      popover="manual"
      className={`video-popover relative ${aspectClass} w-full overflow-hidden rounded-lg bg-black`}
      {...zoomHandlers}
    >
      {/* Badges — above zoom layer */}
      {showBadges && <VideoBadges cameraPosition={video.cameraPosition} maxQuality={maxQuality} />}

      {/* Transition wrapper — crossfade on video change */}
      <div ref={transitionRef} className="absolute inset-0 transition-opacity duration-200 ease-out">
        {/* Video element */}
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

        {/* Controls overlay */}
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
          isZoomed={isGesturing}
          showFullscreen={showFullscreen}
          onTogglePlay={togglePlay}
          onVolumeChange={setVolume}
          onToggleMute={toggleMute}
          onToggleFullscreen={toggleFullscreen}
          onSeek={seekTo}
          onPrev={onPrev}
          onNext={onNext}
        />
      </div>
    </div>
  )
}
