'use client'

import { useCallback, useEffect, useRef } from 'react'

interface UseDoubleTapOptions {
  onSingleTap: () => void
  onDoubleTap: () => void
  delay?: number
}

interface UseDoubleTapReturn {
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void
    onTouchEnd: (e: React.TouchEvent) => void
  }
}

export function useDoubleTap({ onSingleTap, onDoubleTap, delay = 300 }: UseDoubleTapOptions): UseDoubleTapReturn {
  const lastTapRef = useRef(0)
  const singleTapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null)

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (singleTapTimerRef.current) {
        clearTimeout(singleTapTimerRef.current)
      }
    }
  }, [])

  // Track touch start position to distinguish taps from swipes
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartPosRef.current = { x: touch.clientX, y: touch.clientY }
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      // Ignore if the touch moved significantly (swipe/drag)
      if (touchStartPosRef.current) {
        const touch = e.changedTouches[0]
        const dx = Math.abs(touch.clientX - touchStartPosRef.current.x)
        const dy = Math.abs(touch.clientY - touchStartPosRef.current.y)
        if (dx > 10 || dy > 10) {
          touchStartPosRef.current = null
          return
        }
      }
      touchStartPosRef.current = null

      // Prevent synthetic click event from firing
      e.preventDefault()

      const now = Date.now()
      const elapsed = now - lastTapRef.current

      if (elapsed < delay && elapsed > 0) {
        // Double tap
        if (singleTapTimerRef.current) {
          clearTimeout(singleTapTimerRef.current)
          singleTapTimerRef.current = null
        }
        lastTapRef.current = 0
        onDoubleTap()
      } else {
        // Potential single tap — wait for possible second tap
        lastTapRef.current = now
        singleTapTimerRef.current = setTimeout(() => {
          singleTapTimerRef.current = null
          onSingleTap()
        }, delay)
      }
    },
    [onSingleTap, onDoubleTap, delay],
  )

  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
    },
  }
}
