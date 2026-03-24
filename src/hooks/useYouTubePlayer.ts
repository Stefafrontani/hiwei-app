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
  isEnded: boolean
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
  const durationRef = useRef(0)

  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [isEnded, setIsEnded] = useState(false)
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
            const d = Math.floor(event.target.getDuration())
            if (d > 0 && durationRef.current === 0) durationRef.current = d
            setDuration(durationRef.current || d)
            setVolumeState(event.target.getVolume())
            setIsMuted(event.target.isMuted())
          },
          onStateChange: (event) => {
            if (destroyed) return

            const state = event.data
            setIsPlaying(state === YT.PlayerState.PLAYING)
            setIsBuffering(state === YT.PlayerState.BUFFERING)

            if (state === YT.PlayerState.PLAYING) {
              setIsEnded(false)
              if (durationRef.current === 0) {
                durationRef.current = Math.floor(event.target.getDuration())
              }
              setDuration(durationRef.current)
              rafRef.current = requestAnimationFrame(updateTime)
            } else {
              cancelAnimationFrame(rafRef.current)
              if (state === YT.PlayerState.PAUSED || state === YT.PlayerState.ENDED) {
                try {
                  if (state === YT.PlayerState.ENDED) {
                    setIsEnded(true)
                    setCurrentTime(durationRef.current)
                  } else {
                    setCurrentTime(event.target.getCurrentTime())
                  }
                } catch {
                  // ignore
                }
              }
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
      durationRef.current = 0
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
    isEnded,
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
