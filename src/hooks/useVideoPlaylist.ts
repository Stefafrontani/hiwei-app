'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { DashcamVideo } from '@/domain/value-objects/DashcamVideo'
import type { CameraPosition } from '@/domain/value-objects/CameraPosition'

interface UseVideoPlaylistOptions {
  videos: DashcamVideo[]
  activeAngle: CameraPosition
  resetKey?: number
}

export function useVideoPlaylist({ videos, activeAngle, resetKey }: UseVideoPlaylistOptions) {
  const [videoIndex, setVideoIndexRaw] = useState(0)
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
    setShouldAutoplay(false)
    prevIndexRef.current = 0
  }, [activeAngle, resetKey])

  const setVideoIndex = useCallback((newIndex: number) => {
    setShouldAutoplay(true)
    prevIndexRef.current = newIndex
    setVideoIndexRaw(newIndex)
    setReplayToken((t) => t + 1)
  }, [])

  const handleVideoEnded = useCallback(() => {
    if (angleVideos.length <= 1) {
      // Single video: signal replay (infinite loop, no transition)
      setReplayToken((t) => t + 1)
      return
    }
    const next = (prevIndexRef.current + 1) % angleVideos.length
    setShouldAutoplay(true)
    prevIndexRef.current = next
    setVideoIndexRaw(next)
    setReplayToken((t) => t + 1)
  }, [angleVideos.length])

  return {
    angleVideos,
    activeVideo,
    videoIndex,
    setVideoIndex,
    handleVideoEnded,
    shouldAutoplay,
    replayToken,
  }
}
