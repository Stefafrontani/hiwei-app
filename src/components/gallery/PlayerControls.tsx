'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Pause, Play, Volume2, VolumeX, Maximize2, Minimize2, Loader2 } from 'lucide-react'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

interface PlayerControlsProps {
  size: 'lg' | 'md' | 'sm'
  isPlaying: boolean
  isBuffering: boolean
  isReady: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  onTogglePlay: () => void
  onSeek: (seconds: number) => void
  onVolumeChange: (volume: number) => void
  onToggleMute: () => void
  containerRef: React.RefObject<HTMLElement | null>
}

export function PlayerControls({
  size,
  isPlaying,
  isBuffering,
  isReady,
  currentTime,
  duration,
  volume,
  isMuted,
  onTogglePlay,
  onSeek,
  onVolumeChange,
  onToggleMute,
  containerRef,
}: PlayerControlsProps) {
  const [visible, setVisible] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showVolume, setShowVolume] = useState(false)
  const [isSeeking, setIsSeeking] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const volumeRef = useRef<HTMLDivElement>(null)

  const isCompact = size === 'sm'

  // Auto-hide controls after 3s of inactivity
  const resetHideTimer = useCallback(() => {
    setVisible(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    if (isPlaying) {
      hideTimer.current = setTimeout(() => setVisible(false), 3000)
    }
  }, [isPlaying])

  useEffect(() => {
    if (isPlaying) {
      hideTimer.current = setTimeout(() => setVisible(false), 3000)
    } else {
      setVisible(true)
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [isPlaying])

  // Fullscreen change listener
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      el.requestFullscreen()
    }
  }, [containerRef])

  // Progress bar click/drag
  const handleProgressInteraction = useCallback(
    (clientX: number) => {
      const bar = progressRef.current
      if (!bar || !duration) return
      const rect = bar.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      onSeek(ratio * duration)
    },
    [duration, onSeek],
  )

  const handleProgressMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsSeeking(true)
      handleProgressInteraction(e.clientX)

      const onMove = (ev: MouseEvent) => handleProgressInteraction(ev.clientX)
      const onUp = () => {
        setIsSeeking(false)
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    },
    [handleProgressInteraction],
  )

  // Volume slider
  const handleVolumeInteraction = useCallback(
    (clientX: number) => {
      const bar = volumeRef.current
      if (!bar) return
      const rect = bar.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      onVolumeChange(Math.round(ratio * 100))
    },
    [onVolumeChange],
  )

  const handleVolumeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      handleVolumeInteraction(e.clientX)

      const onMove = (ev: MouseEvent) => handleVolumeInteraction(ev.clientX)
      const onUp = () => {
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    },
    [handleVolumeInteraction],
  )

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  // Loading state
  if (!isReady) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
        <Loader2 className="h-8 w-8 animate-spin text-white/80" />
      </div>
    )
  }

  return (
    <div
      className="absolute inset-0 z-10 flex flex-col justify-end"
      onMouseMove={resetHideTimer}
      onMouseEnter={resetHideTimer}
      onClick={(e) => {
        // Click on the overlay (not on controls) toggles play
        if (e.target === e.currentTarget || (e.target as HTMLElement).hasAttribute('data-overlay')) {
          onTogglePlay()
          resetHideTimer()
        }
      }}
    >
      {/* Center play/pause indicator */}
      {(!isPlaying || isBuffering) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" data-overlay>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onTogglePlay()
              resetHideTimer()
            }}
            className="pointer-events-auto rounded-full bg-black/50 p-4 text-white backdrop-blur-sm transition-transform hover:scale-110 active:scale-90"
          >
            {isBuffering ? (
              <Loader2 className="h-7 w-7 animate-spin" />
            ) : (
              <Play className="h-7 w-7 fill-white" />
            )}
          </button>
        </div>
      )}

      {/* Bottom controls bar */}
      <div
        className={`flex flex-col transition-opacity duration-300 ${visible || isSeeking ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Progress bar */}
        <div
          ref={progressRef}
          className="group/progress relative h-1 w-full cursor-pointer hover:h-1.5 transition-all"
          onMouseDown={handleProgressMouseDown}
        >
          <div className="absolute inset-0 bg-white/20" />
          <div
            className="absolute inset-y-0 left-0 bg-brand"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-brand shadow opacity-0 group-hover/progress:opacity-100 transition-opacity"
            style={{ left: `${progress}%`, transform: `translateX(-50%) translateY(-50%)` }}
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-2 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
          {/* Play/Pause */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onTogglePlay()
              resetHideTimer()
            }}
            className="text-white hover:text-brand transition-colors"
          >
            {isPlaying ? (
              <Pause className={isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
            ) : (
              <Play className={`${isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4'} fill-white`} />
            )}
          </button>

          {/* Time */}
          <span className={`text-white select-none ${isCompact ? 'text-[9px]' : 'text-[11px]'} tabular-nums`}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="flex-1" />

          {/* Volume (hidden on compact) */}
          {!isCompact && (
            <div
              className="relative flex items-center"
              onMouseEnter={() => setShowVolume(true)}
              onMouseLeave={() => setShowVolume(false)}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleMute()
                  resetHideTimer()
                }}
                className="text-white hover:text-brand transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>

              {/* Volume slider */}
              <div
                className={`overflow-hidden transition-all duration-200 ${showVolume ? 'w-20 ml-2' : 'w-0 ml-0'}`}
              >
                <div
                  ref={volumeRef}
                  className="h-1 w-20 cursor-pointer rounded-full bg-white/20"
                  onMouseDown={(e) => {
                    e.stopPropagation()
                    handleVolumeMouseDown(e)
                  }}
                >
                  <div
                    className="h-full rounded-full bg-white"
                    style={{ width: `${isMuted ? 0 : volume}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Fullscreen (hidden on compact) */}
          {!isCompact && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                toggleFullscreen()
                resetHideTimer()
              }}
              className="text-white hover:text-brand transition-colors"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
