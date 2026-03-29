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

/**
 * Calculate the seek ratio (0–1) accounting for CSS transforms on ancestors.
 * When the progress bar is inside a rotated container (e.g. fullscreen with rotate(90deg)),
 * the visual orientation differs from the DOM layout. We detect this by comparing
 * the element's layout dimensions (offsetWidth/Height) with its visual bounding rect.
 */
function getRatio(clientX: number, clientY: number, el: HTMLElement): number {
  const rect = el.getBoundingClientRect()

  // Detect rotation: a thin horizontal bar (offsetWidth >> offsetHeight)
  // that visually appears tall (rect.height >> rect.width) must be rotated
  const isRotated = el.offsetWidth > el.offsetHeight * 4 && rect.height > rect.width * 4

  if (isRotated) {
    return Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
  }

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
      const touch = e.touches[0]
      const ratio = getRatio(touch.clientX, touch.clientY, progressRef.current)
      setSeekPreview(ratio * 100)
    },
    [enabled, progressRef],
  )

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || !progressRef.current || !isSeeking) return
      e.stopPropagation()
      const touch = e.touches[0]
      const ratio = getRatio(touch.clientX, touch.clientY, progressRef.current)
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
      const ratio = getRatio(touch.clientX, touch.clientY, progressRef.current)
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
      const ratio = getRatio(e.clientX, e.clientY, el)
      onSeek(ratio * duration)
      setIsSeeking(true)
      setSeekPreview(ratio * 100)

      const onMove = (ev: MouseEvent) => {
        const r = getRatio(ev.clientX, ev.clientY, el)
        setSeekPreview(r * 100)
        const now = Date.now()
        if (now - lastSeekRef.current > 100) {
          lastSeekRef.current = now
          onSeek(r * duration)
        }
      }

      const onUp = (ev: MouseEvent) => {
        const r = getRatio(ev.clientX, ev.clientY, el)
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
