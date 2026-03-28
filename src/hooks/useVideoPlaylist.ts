'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { DashcamVideo } from '@/domain/value-objects/DashcamVideo'
import type { CameraPosition } from '@/domain/value-objects/CameraPosition'

export type SlideDirection = 'left' | 'right' | null

interface UseVideoPlaylistOptions {
  videos: DashcamVideo[]
  activeAngle: CameraPosition
  resetKey?: number
}

export function useVideoPlaylist({ videos, activeAngle, resetKey }: UseVideoPlaylistOptions) {
  const [videoIndex, setVideoIndexRaw] = useState(0)
  const [slideDirection, setSlideDirection] = useState<SlideDirection>(null)
  const [shouldAutoplay, setShouldAutoplay] = useState(false)
  const [replayToken, setReplayToken] = useState(0)
  const prevIndexRef = useRef(0)

  const angleVideos = useMemo(
    () => videos.filter((v) => v.cameraPosition === activeAngle),
    [videos, activeAngle],
  )

  const activeVideo = angleVideos[videoIndex] ?? null

  // Reset on angle or resetKey change
  useEffect(() => {
    setVideoIndexRaw(0)
    setSlideDirection(null)
    setShouldAutoplay(false)
    prevIndexRef.current = 0
  }, [activeAngle, resetKey])

  const setVideoIndex = useCallback((newIndex: number) => {
    const prev = prevIndexRef.current
    setSlideDirection(newIndex > prev ? 'right' : 'left')
    setShouldAutoplay(true)
    prevIndexRef.current = newIndex
    setVideoIndexRaw(newIndex)
  }, [])

  const handleVideoEnded = useCallback(() => {
    if (angleVideos.length <= 1) {
      // Single video: signal replay (infinite loop)
      setReplayToken((t) => t + 1)
      return
    }
    const next = (prevIndexRef.current + 1) % angleVideos.length
    setSlideDirection('right')
    setShouldAutoplay(true)
    prevIndexRef.current = next
    setVideoIndexRaw(next)
    // Always signal replay — handles cases where consecutive videos share
    // the same youtubeId (the video switch effect won't fire if videoId
    // is unchanged, so replayToken ensures the player restarts)
    setReplayToken((t) => t + 1)
  }, [angleVideos.length])

  return {
    angleVideos,
    activeVideo,
    videoIndex,
    setVideoIndex,
    handleVideoEnded,
    slideDirection,
    shouldAutoplay,
    replayToken,
  }
}
