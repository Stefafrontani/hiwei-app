'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface UseVideoPlayerOptions {
  videoUrl: string
  autoplay?: boolean
  loop?: boolean
}

interface UseVideoPlayerReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>
  isReady: boolean
  isPlaying: boolean
  isBuffering: boolean
  isEnded: boolean
  isError: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  play: () => void
  pause: () => void
  togglePlay: () => void
  seekTo: (seconds: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  replay: () => void
  retry: () => void
}

export function useVideoPlayer({
  videoUrl,
  autoplay = true,
  loop = true,
}: UseVideoPlayerOptions): UseVideoPlayerReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const seekingRef = useRef(false)
  const seekTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoplayRef = useRef(autoplay)
  autoplayRef.current = autoplay

  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [isEnded, setIsEnded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(100)
  const [isMuted, setIsMuted] = useState(true)

  // Single effect: attach listeners + load video. Re-runs when videoUrl changes.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Set attributes
    video.muted = true
    video.playsInline = true
    video.loop = loop
    video.preload = 'metadata'

    const onLoadedMetadata = () => {
      setIsReady(true)
      setDuration(Math.floor(video.duration))
      setIsError(false)
      // Autoplay after metadata is loaded (avoids AbortError on iOS Safari)
      if (autoplayRef.current) {
        video.play().catch(() => {})
      }
    }

    const onPlay = () => {
      setIsPlaying(true)
      setIsEnded(false)
      setIsBuffering(false)
    }

    const onPause = () => {
      setIsPlaying(false)
    }

    const onWaiting = () => {
      setIsBuffering(true)
    }

    const onPlaying = () => {
      setIsBuffering(false)
    }

    const onEnded = () => {
      setIsEnded(true)
      setIsPlaying(false)
    }

    const onError = () => {
      setIsError(true)
      setIsReady(false)
    }

    const onVolumeChange = () => {
      setVolumeState(Math.round(video.volume * 100))
      setIsMuted(video.muted)
    }

    const onTimeUpdate = () => {
      if (!seekingRef.current) {
        setCurrentTime(video.currentTime)
      }
    }

    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('waiting', onWaiting)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('ended', onEnded)
    video.addEventListener('error', onError)
    video.addEventListener('volumechange', onVolumeChange)
    video.addEventListener('timeupdate', onTimeUpdate)

    // Load the video
    if (videoUrl) {
      video.src = videoUrl
      video.load()
    }

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('waiting', onWaiting)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('ended', onEnded)
      video.removeEventListener('error', onError)
      video.removeEventListener('volumechange', onVolumeChange)
      video.removeEventListener('timeupdate', onTimeUpdate)
    }
  }, [videoUrl, loop])

  const play = useCallback(() => {
    videoRef.current?.play().catch(() => {})
  }, [])

  const pause = useCallback(() => {
    videoRef.current?.pause()
  }, [])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [])

  const seekTo = useCallback((seconds: number) => {
    const video = videoRef.current
    if (!video) return
    seekingRef.current = true
    if (seekTimerRef.current) clearTimeout(seekTimerRef.current)
    video.currentTime = seconds
    setCurrentTime(seconds)
    seekTimerRef.current = setTimeout(() => {
      seekingRef.current = false
    }, 300)
  }, [])

  const setVolume = useCallback((v: number) => {
    const video = videoRef.current
    if (!video) return
    video.volume = v / 100
    if (v > 0 && video.muted) {
      video.muted = false
    }
  }, [])

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
  }, [])

  const replay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = 0
    video.play().catch(() => {})
  }, [])

  const retry = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.load()
  }, [])

  return {
    videoRef,
    isReady,
    isPlaying,
    isBuffering,
    isEnded,
    isError,
    currentTime,
    duration,
    volume,
    isMuted,
    play,
    pause,
    togglePlay,
    seekTo,
    setVolume,
    toggleMute,
    replay,
    retry,
  }
}
