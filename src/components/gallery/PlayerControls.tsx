'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Pause, Play, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react'
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

  // Debounce buffering to avoid flash on quick state changes
  const [showBuffering, setShowBuffering] = useState(false)
  const bufferTimer = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    if (bufferTimer.current) clearTimeout(bufferTimer.current)
    if (isBuffering) {
      // Only show spinner after 400ms of continuous buffering
      bufferTimer.current = setTimeout(() => setShowBuffering(true), 400)
    } else {
      setShowBuffering(false)
    }
    return () => { if (bufferTimer.current) clearTimeout(bufferTimer.current) }
  }, [isBuffering])

  const isCompact = size === 'sm'

  const iconClass = isCompact ? 'h-4 w-4' : 'h-5 w-5'

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

  // Initial loading — subtle centered spinner, no overlay
  if (!isReady) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="video-loading-spinner" />
      </div>
    )
  }

  return (
    <div
      data-player-controls
      className="absolute inset-0 z-10 flex flex-col justify-end"
      onMouseMove={resetHideTimer}
      onMouseEnter={resetHideTimer}
      onTouchStart={resetHideTimer}
      onClick={(e) => {
        if (e.target === e.currentTarget || (e.target as HTMLElement).hasAttribute('data-overlay')) {
          onTogglePlay()
          resetHideTimer()
        }
      }}
    >
      {/* Buffering spinner — small, centered, no overlay (Reels style)
          Only appears after 400ms debounce to avoid flash */}
      {showBuffering && isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="video-loading-spinner" />
        </div>
      )}

      {/* Center play button — only when paused (not buffering), subtle tap target */}
      {!isPlaying && !isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center" data-overlay>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onTogglePlay()
              resetHideTimer()
            }}
            className="pointer-events-auto rounded-full bg-black/40 p-3.5 text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/55 hover:scale-105 active:scale-95"
          >
            <Play className="h-6 w-6 fill-white" />
          </button>
        </div>
      )}

      {/* Bottom controls */}
      <div
        className={`flex flex-col transition-opacity duration-300 bg-gradient-to-t from-black/70 via-black/40 to-transparent ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Progress bar */}
        <div
          ref={progressRef}
          className="group/progress relative cursor-pointer px-3"
          {...touchHandlers}
          {...mouseHandlers}
        >
          {/* Enlarged touch target */}
          <div className="absolute -inset-y-4 inset-x-0" />

          {/* Track + scrubber dot — same container so % coordinates align */}
          <div className="relative h-[3px] w-full group-hover/progress:h-[5px] transition-[height] duration-150">
            <div className="absolute inset-0 rounded-full bg-white/25" />
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-brand"
              style={{ width: `${displayProgress}%` }}
            />
            {/* Scrubber dot — always visible, grows on drag */}
            <div
              className={`absolute top-1/2 rounded-full bg-brand shadow-md transition-[width,height] duration-150 ${isSeeking ? 'h-4 w-4' : 'h-3 w-3'}`}
              style={{ left: `${displayProgress}%`, transform: 'translate(-50%, -50%)' }}
            />
          </div>
        </div>

        {/* Spacing */}
        <div className={isCompact ? 'h-1.5' : 'h-2'} />

        {/* Controls row */}
        <div className={`flex items-center ${isCompact ? 'gap-1.5 px-2 pb-2' : 'gap-2 px-3 pb-3'}`}>
          {/* Left group: Play + Time in a pill */}
          <div className="flex items-center gap-1 rounded-full bg-black/30 pr-2.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onTogglePlay()
                resetHideTimer()
              }}
              className={isCompact
                ? 'p-1.5 rounded-full text-white hover:bg-white/10 transition-colors'
                : 'p-2 rounded-full text-white hover:bg-white/10 transition-colors'
              }
            >
              {isPlaying ? (
                <Pause className={iconClass} />
              ) : (
                <Play className={`${iconClass} fill-white`} />
              )}
            </button>
            <span className={`text-white select-none tabular-nums ${isCompact ? 'text-[10px]' : 'text-xs'}`}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex-1" />

          {/* Right group: Volume + Fullscreen in a pill */}
          <div className="flex items-center rounded-full bg-black/30">
            {isCompact ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleMute()
                  resetHideTimer()
                }}
                className="p-1.5 rounded-full text-white hover:bg-white/10 transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className={iconClass} />
                ) : (
                  <Volume2 className={iconClass} />
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
                  className="p-2 rounded-full text-white hover:bg-white/10 transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className={iconClass} />
                  ) : (
                    <Volume2 className={iconClass} />
                  )}
                </button>

                {/* Volume slider */}
                <div
                  className={`overflow-hidden transition-all duration-200 ${showVolume ? 'w-20 mr-1' : 'w-0 mr-0'}`}
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

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onToggleFullscreen()
                resetHideTimer()
              }}
              className={isCompact
                ? 'p-1.5 rounded-full text-white hover:bg-white/10 transition-colors'
                : 'p-2 rounded-full text-white hover:bg-white/10 transition-colors'
              }
            >
              {isFullscreen
                ? <Minimize2 className={iconClass} />
                : <Maximize2 className={iconClass} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
