'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Pause, Play, Volume2, VolumeX, Maximize2, Minimize2, SkipBack, SkipForward } from 'lucide-react'
import { useTouchSeek } from '@/hooks/useTouchSeek'
import { useIsMobile } from '@/hooks/use-mobile'

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
  isZoomed?: boolean
  onTogglePlay: () => void
  onVolumeChange: (volume: number) => void
  onToggleMute: () => void
  onToggleFullscreen: () => void
  onSeek: (seconds: number) => void
  onPrev?: () => void
  onNext?: () => void
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
  isZoomed = false,
  onTogglePlay,
  onVolumeChange,
  onToggleMute,
  onToggleFullscreen,
  onSeek,
  onPrev,
  onNext,
}: PlayerControlsProps) {
  const [visible, setVisible] = useState(true)
  const [showVolume, setShowVolume] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(null)
  const volumeRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const isMobile = useIsMobile()
  const isCompact = size === 'sm'
  const muteOnly = isCompact || isMobile
  const iconClass = isCompact ? 'h-4 w-4' : 'h-5 w-5'

  // Touch seeking
  const { isSeeking, seekPreview, touchHandlers, mouseHandlers } = useTouchSeek({
    progressRef,
    duration,
    onSeek,
    enabled: isReady && duration > 0,
  })

  // Auto-hide after 3s — always hides regardless of play/pause state
  const resetHideTimer = useCallback(() => {
    setVisible(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    if (!isSeeking) {
      hideTimer.current = setTimeout(() => setVisible(false), 3000)
    }
  }, [isSeeking])

  useEffect(() => {
    if (!isSeeking) {
      if (hideTimer.current) clearTimeout(hideTimer.current)
      hideTimer.current = setTimeout(() => setVisible(false), 3000)
    }
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [isSeeking])

  // Hide controls during zoom (YouTube-style)
  useEffect(() => {
    if (isZoomed) {
      setVisible(false)
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [isZoomed])

  // Toggle controls visibility on tap/click
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target !== e.currentTarget && !(e.target as HTMLElement).hasAttribute('data-overlay')) return

    if (visible && isPlaying) {
      if (hideTimer.current) clearTimeout(hideTimer.current)
      setVisible(false)
    } else {
      resetHideTimer()
    }
  }, [visible, isPlaying, resetHideTimer])

  // Volume slider — use native event listeners for drag to avoid pointer-events-none issues
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
      e.stopPropagation()
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

  if (!isReady) return null

  // Don't render controls at all during zoom
  const shouldShow = !isZoomed

  return (
    <div
      data-player-controls
      className="absolute inset-0 z-10 flex flex-col"
      onMouseMove={shouldShow ? resetHideTimer : undefined}
      onMouseEnter={shouldShow ? resetHideTimer : undefined}
      onTouchStart={shouldShow ? resetHideTimer : undefined}
      onClick={shouldShow ? handleOverlayClick : undefined}
    >
      {/* Full overlay — fade in/out */}
      <div
        className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 ease-out ${visible && shouldShow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Top gradient (subtle) — hides during seeking */}
        <div className={`h-16 bg-gradient-to-b from-black/30 to-transparent transition-opacity duration-200 ${isSeeking ? 'opacity-0' : 'opacity-100'}`} data-overlay />

        {/* Center: play/pause + prev/next — hides during seeking */}
        <div className={`flex items-center justify-center gap-6 transition-opacity duration-300 ${isSeeking ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} data-overlay>
          {onPrev && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onPrev(); resetHideTimer() }}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/50 text-white transition-[transform,background-color] duration-200 hover:bg-black/65 hover:scale-105 active:scale-90"
            >
              <SkipBack className="h-5 w-5 fill-white" />
            </button>
          )}

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onTogglePlay(); resetHideTimer() }}
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-black/50 text-white transition-[transform,background-color] duration-200 hover:bg-black/65 hover:scale-105 active:scale-90"
          >
            <Play className={`absolute h-7 w-7 fill-white ml-0.5 transition-[opacity,transform] duration-200 ${isPlaying ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`} />
            <Pause className={`absolute h-7 w-7 fill-white transition-[opacity,transform] duration-200 ${isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
          </button>

          {onNext && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onNext(); resetHideTimer() }}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/50 text-white transition-[transform,background-color] duration-200 hover:bg-black/65 hover:scale-105 active:scale-90"
            >
              <SkipForward className="h-5 w-5 fill-white" />
            </button>
          )}
        </div>

        {/* Bottom: progress bar + controls */}
        <div className={`flex flex-col pt-8 ${isSeeking ? 'bg-transparent' : 'bg-gradient-to-t from-black/60 via-black/30 to-transparent'}`}>
          {/* Progress bar */}
          <div
            ref={progressRef}
            className="group/progress relative cursor-pointer px-3 touch-none"
            {...touchHandlers}
            {...mouseHandlers}
          >
            <div className="absolute -inset-y-4 inset-x-0" />
            <div className="relative h-[3px] w-full group-hover/progress:h-[5px] transition-[height] duration-150">
              <div className="absolute inset-0 rounded-full bg-white/25" />
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-brand"
                style={{ width: `${displayProgress}%` }}
              />
              <div
                className={`absolute top-1/2 rounded-full bg-brand shadow-md transition-[width,height] duration-150 ${isSeeking ? 'h-4 w-4' : 'h-3 w-3'}`}
                style={{ left: `${displayProgress}%`, transform: 'translate(-50%, -50%)' }}
              />
            </div>
          </div>

          <div className={isCompact ? 'h-1.5' : 'h-2'} />

          {/* Controls row: time left, volume + fullscreen right */}
          <div className={`flex items-center ${isCompact ? 'gap-1.5 px-2 pb-2' : 'gap-2 px-3 pb-3'}`}>
            {/* Time */}
            <span className="text-white select-none tabular-nums text-xs">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div className="flex-1" />

            {/* Volume + Fullscreen — hides during seeking */}
            <div className={`flex items-center rounded-full bg-black/30 transition-opacity duration-200 ${isSeeking ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              {muteOnly ? (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onToggleMute(); resetHideTimer() }}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX className={iconClass} /> : <Volume2 className={iconClass} />}
                </button>
              ) : (
                <div
                  className="relative flex items-center"
                  onMouseEnter={() => setShowVolume(true)}
                  onMouseLeave={() => setShowVolume(false)}
                >
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onToggleMute(); resetHideTimer() }}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
                  >
                    {isMuted || volume === 0 ? <VolumeX className={iconClass} /> : <Volume2 className={iconClass} />}
                  </button>
                  <div className={`overflow-hidden transition-all duration-200 ${showVolume ? 'w-20 mr-1' : 'w-0 mr-0'}`}>
                    <div
                      ref={volumeRef}
                      className="h-1 w-20 cursor-pointer rounded-full bg-white/20"
                      onMouseDown={handleVolumeMouseDown}
                    >
                      <div className="h-full rounded-full bg-white" style={{ width: `${isMuted ? 0 : volume}%` }} />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onToggleFullscreen(); resetHideTimer() }}
                className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors ${isCompact ? 'p-1.5' : 'p-2'}`}
              >
                {isFullscreen ? <Minimize2 className={iconClass} /> : <Maximize2 className={iconClass} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
