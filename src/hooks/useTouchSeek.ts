'use client'

import { useCallback, useRef, useState } from 'react'

interface UseTouchSeekOptions {
  progressRef: React.RefObject<HTMLElement | null>
  duration: number
  onSeek: (seconds: number) => void
  enabled?: boolean
}

interface UseTouchSeekReturn {
  isSeeking: boolean
  seekPreview: number | null
  touchHandlers: {
    onTouchStart: (e: React.TouchEvent) => void
    onTouchMove: (e: React.TouchEvent) => void
    onTouchEnd: (e: React.TouchEvent) => void
  }
  mouseHandlers: {
    onMouseDown: (e: React.MouseEvent) => void
  }
}

function getRatio(clientX: number, el: HTMLElement): number {
  const rect = el.getBoundingClientRect()
  return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
}

export function useTouchSeek({ progressRef, duration, onSeek, enabled = true }: UseTouchSeekOptions): UseTouchSeekReturn {
  const [isSeeking, setIsSeeking] = useState(false)
  const [seekPreview, setSeekPreview] = useState<number | null>(null)
  const lastSeekRef = useRef(0)

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || !progressRef.current) return
      e.stopPropagation()
      setIsSeeking(true)
      const ratio = getRatio(e.touches[0].clientX, progressRef.current)
      setSeekPreview(ratio * 100)
    },
    [enabled, progressRef],
  )

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || !progressRef.current || !isSeeking) return
      e.stopPropagation()
      const ratio = getRatio(e.touches[0].clientX, progressRef.current)
      setSeekPreview(ratio * 100)

      // Throttle actual seeks to every 100ms
      const now = Date.now()
      if (now - lastSeekRef.current > 100) {
        lastSeekRef.current = now
        onSeek(ratio * duration)
      }
    },
    [enabled, progressRef, isSeeking, duration, onSeek],
  )

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || !progressRef.current || !isSeeking) return
      e.stopPropagation()
      const touch = e.changedTouches[0]
      const ratio = getRatio(touch.clientX, progressRef.current)
      onSeek(ratio * duration)
      setIsSeeking(false)
      setSeekPreview(null)
    },
    [enabled, progressRef, isSeeking, duration, onSeek],
  )

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled || !progressRef.current) return
      e.preventDefault()
      e.stopPropagation()

      const el = progressRef.current
      const ratio = getRatio(e.clientX, el)
      onSeek(ratio * duration)
      setIsSeeking(true)
      setSeekPreview(ratio * 100)

      const onMove = (ev: MouseEvent) => {
        const r = getRatio(ev.clientX, el)
        setSeekPreview(r * 100)
        const now = Date.now()
        if (now - lastSeekRef.current > 100) {
          lastSeekRef.current = now
          onSeek(r * duration)
        }
      }

      const onUp = (ev: MouseEvent) => {
        const r = getRatio(ev.clientX, el)
        onSeek(r * duration)
        setIsSeeking(false)
        setSeekPreview(null)
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }

      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    },
    [enabled, progressRef, duration, onSeek],
  )

  return {
    isSeeking,
    seekPreview,
    touchHandlers: { onTouchStart, onTouchMove, onTouchEnd },
    mouseHandlers: { onMouseDown },
  }
}
