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
  const [advanceDirection, setAdvanceDirection] = useState<'next' | 'prev' | null>(null)
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
    // Trigger inner transition (visible in fullscreen too)
    setAdvanceDirection(newIndex > prev ? 'next' : 'prev')
    setReplayToken((t) => t + 1)
  }, [])

  const handleVideoEnded = useCallback(() => {
    if (angleVideos.length <= 1) {
      // Single video: signal replay (infinite loop, no transition)
      setAdvanceDirection(null)
      setReplayToken((t) => t + 1)
      return
    }
    const next = (prevIndexRef.current + 1) % angleVideos.length
    setSlideDirection(null)
    setShouldAutoplay(true)
    prevIndexRef.current = next
    setVideoIndexRaw(next)
    // Signal advance with transition direction
    setAdvanceDirection('next')
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
    advanceDirection,
  }
}
