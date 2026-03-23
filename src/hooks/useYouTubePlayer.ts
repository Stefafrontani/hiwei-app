'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

let apiLoading = false
let apiReady = false
const apiCallbacks: (() => void)[] = []

function loadYouTubeAPI(): Promise<void> {
  if (apiReady) return Promise.resolve()

  return new Promise((resolve) => {
    apiCallbacks.push(resolve)

    if (apiLoading) return
    apiLoading = true

    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      apiReady = true
      apiCallbacks.forEach((cb) => cb())
      apiCallbacks.length = 0
    }

    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.onerror = () => {
      apiLoading = false
      apiCallbacks.length = 0
    }
    document.head.appendChild(script)
  })
}

interface UseYouTubePlayerOptions {
  videoId: string
  autoplay?: boolean
}

interface UseYouTubePlayerReturn {
  containerRef: React.RefObject<HTMLDivElement | null>
  isReady: boolean
  isPlaying: boolean
  isBuffering: boolean
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
}

export function useYouTubePlayer({ videoId, autoplay = true }: UseYouTubePlayerOptions): UseYouTubePlayerReturn {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<YT.Player | null>(null)
  const rafRef = useRef<number>(0)
  const innerDivRef = useRef<HTMLDivElement | null>(null)

  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(100)
  const [isMuted, setIsMuted] = useState(false)

  const updateTime = useCallback(() => {
    const player = playerRef.current
    if (!player) return

    try {
      const state = player.getPlayerState()
      if (state === YT.PlayerState.PLAYING) {
        setCurrentTime(player.getCurrentTime())
        rafRef.current = requestAnimationFrame(updateTime)
      }
    } catch {
      // player may have been destroyed
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const target = document.createElement('div')
    innerDivRef.current = target
    containerRef.current.appendChild(target)

    let destroyed = false

    loadYouTubeAPI().then(() => {
      if (destroyed || !innerDivRef.current) return

      playerRef.current = new YT.Player(innerDivRef.current, {
        videoId,
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          controls: 0,
          rel: 0,
          modestbranding: 1, // deprecated but kept for older player versions
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
          origin: window.location.origin,
          enablejsapi: 1,
        },
        events: {
          onReady: (event) => {
            if (destroyed) return
            setIsReady(true)
            setDuration(event.target.getDuration())
            setVolumeState(event.target.getVolume())
            setIsMuted(event.target.isMuted())
          },
          onStateChange: (event) => {
            if (destroyed) return

            const state = event.data
            setIsPlaying(state === YT.PlayerState.PLAYING)
            setIsBuffering(state === YT.PlayerState.BUFFERING)

            if (state === YT.PlayerState.PLAYING) {
              setDuration(event.target.getDuration())
              rafRef.current = requestAnimationFrame(updateTime)
            } else {
              cancelAnimationFrame(rafRef.current)
              if (state === YT.PlayerState.PAUSED || state === YT.PlayerState.ENDED) {
                try {
                  setCurrentTime(event.target.getCurrentTime())
                } catch {
                  // ignore
                }
              }
            }

            // Loop: restart when ended (only if autoplay mode)
            if (state === YT.PlayerState.ENDED && autoplay) {
              event.target.seekTo(0, true)
              event.target.playVideo()
            }
          },
        },
      })
    })

    return () => {
      destroyed = true
      cancelAnimationFrame(rafRef.current)
      try {
        playerRef.current?.destroy()
      } catch {
        // ignore
      }
      playerRef.current = null
      innerDivRef.current?.remove()
      innerDivRef.current = null
    }
  }, [videoId, autoplay, updateTime])

  const play = useCallback(() => playerRef.current?.playVideo(), [])
  const pause = useCallback(() => playerRef.current?.pauseVideo(), [])
  const togglePlay = useCallback(() => {
    const player = playerRef.current
    if (!player) return
    try {
      const state = player.getPlayerState()
      if (state === YT.PlayerState.PLAYING) {
        player.pauseVideo()
      } else {
        player.playVideo()
      }
    } catch {
      // ignore
    }
  }, [])

  const seekTo = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, true)
    setCurrentTime(seconds)
  }, [])

  const setVolume = useCallback((v: number) => {
    const player = playerRef.current
    if (!player) return
    player.setVolume(v)
    setVolumeState(v)
    if (v > 0 && player.isMuted()) {
      player.unMute()
      setIsMuted(false)
    }
  }, [])

  const toggleMute = useCallback(() => {
    const player = playerRef.current
    if (!player) return
    if (player.isMuted()) {
      player.unMute()
      setIsMuted(false)
    } else {
      player.mute()
      setIsMuted(true)
    }
  }, [])

  return {
    containerRef,
    isReady,
    isPlaying,
    isBuffering,
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
  }
}
