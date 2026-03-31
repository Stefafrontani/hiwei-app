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

    // Fade out
    el.style.opacity = '0'

    const fadeOutTimer = setTimeout(() => {
      replay()
      // Fade in
      el.style.opacity = '1'
    }, 200)

    return () => clearTimeout(fadeOutTimer)
  }, [replayToken, replay])

  return (
    <div
      ref={wrapperRef}
      popover="manual"
      className={`video-popover relative ${aspectClass} w-full overflow-hidden rounded-lg bg-black`}
      {...zoomHandlers}
    >
      {/* Badges — always visible, above zoom layer */}
      <VideoBadges cameraPosition={video.cameraPosition} maxQuality={maxQuality} />

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
