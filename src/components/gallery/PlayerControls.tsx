'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Pause, Play, Volume2, VolumeX, Maximize2, Minimize2, Loader2 } from 'lucide-react'
import { useTouchSeek } from '@/hooks/useTouchSeek'

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
  isFullscreen: boolean
  onTogglePlay: () => void
  onVolumeChange: (volume: number) => void
  onToggleMute: () => void
  onToggleFullscreen: () => void
  onSeek: (seconds: number) => void
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
  isFullscreen,
  onTogglePlay,
  onVolumeChange,
  onToggleMute,
  onToggleFullscreen,
  onSeek,
}: PlayerControlsProps) {
  const [visible, setVisible] = useState(true)
  const [showVolume, setShowVolume] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(null)
  const volumeRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const isCompact = size === 'sm'

  // Touch seeking
  const { isSeeking, seekPreview, touchHandlers, mouseHandlers } = useTouchSeek({
    progressRef,
    duration,
    onSeek,
    enabled: isReady && duration > 0,
  })

  // Auto-hide controls after 3s of inactivity
  const resetHideTimer = useCallback(() => {
    setVisible(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    if (isPlaying && !isSeeking) {
      hideTimer.current = setTimeout(() => setVisible(false), 3000)
    }
  }, [isPlaying, isSeeking])

  useEffect(() => {
    if (isPlaying && !isSeeking) {
      hideTimer.current = setTimeout(() => setVisible(false), 3000)
    } else {
      setVisible(true)
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [isPlaying, isSeeking])

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

  const progress = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0
  const displayProgress = seekPreview ?? progress

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
      data-player-controls
      className="absolute inset-0 z-10 flex flex-col justify-end"
      onMouseMove={resetHideTimer}
      onMouseEnter={resetHideTimer}
      onClick={(e) => {
        // Click on the overlay (not on controls) toggles play — desktop only
        if (e.target === e.currentTarget || (e.target as HTMLElement).hasAttribute('data-overlay')) {
          onTogglePlay()
          resetHideTimer()
        }
      }}
    >
      {/* Center play/pause indicator */}
      {(!isPlaying || isBuffering) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/60" data-overlay>
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
        className={`flex flex-col transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Progress bar — interactive */}
        <div
          ref={progressRef}
          className="relative h-1 w-full group/progress cursor-pointer"
          {...touchHandlers}
          {...mouseHandlers}
        >
          {/* Enlarged touch target */}
          <div className="absolute -inset-y-3 inset-x-0" />
          {/* Background track */}
          <div className="absolute inset-0 bg-white/20" />
          {/* Filled track */}
          <div
            className="absolute inset-y-0 left-0 bg-brand"
            style={{ width: `${displayProgress}%` }}
          />
          {/* Seek thumb — visible on drag */}
          {isSeeking && (
            <div
              className="absolute top-1/2 h-3 w-3 rounded-full bg-brand shadow-md"
              style={{ left: `${displayProgress}%`, transform: 'translate(-50%, -50%)' }}
            />
          )}
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

          {/* Volume: compact = mute button only, full = hover slider */}
          {isCompact ? (
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
                <VolumeX className="h-3.5 w-3.5" />
              ) : (
                <Volume2 className="h-3.5 w-3.5" />
              )}
            </button>
          ) : (
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

          {/* Fullscreen — always shown */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggleFullscreen()
              resetHideTimer()
            }}
            className="text-white hover:text-brand transition-colors"
          >
            {isFullscreen
              ? <Minimize2 className={isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
              : <Maximize2 className={isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />}
          </button>
        </div>
      </div>
    </div>
  )
}
