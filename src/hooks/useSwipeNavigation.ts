'use client'

import { useEffect, useRef } from 'react'

interface UseSwipeNavigationOptions {
  targetRef: React.RefObject<HTMLElement | null>
  onNext: () => void
  onPrev: () => void
  enabled?: boolean
  /** Minimum horizontal distance (px) to trigger navigation. Default: 50 */
  threshold?: number
}

/**
 * Detects horizontal swipe gestures on a target element (touch-only / mobile).
 * Swipe left → onNext, swipe right → onPrev.
 * Only fires when the gesture is primarily horizontal (not vertical scroll).
 */
export function useSwipeNavigation({
  targetRef,
  onNext,
  onPrev,
  enabled = true,
  threshold = 50,
}: UseSwipeNavigationOptions) {
  const startX = useRef(0)
  const startY = useRef(0)
  const tracking = useRef(false)

  // Use refs for callbacks to avoid re-attaching listeners
  const onNextRef = useRef(onNext)
  const onPrevRef = useRef(onPrev)
  useEffect(() => { onNextRef.current = onNext }, [onNext])
  useEffect(() => { onPrevRef.current = onPrev }, [onPrev])

  useEffect(() => {
    const el = targetRef.current
    if (!el || !enabled) return

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      startX.current = touch.clientX
      startY.current = touch.clientY
      tracking.current = true
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!tracking.current) return
      tracking.current = false

      const touch = e.changedTouches[0]
      const dx = touch.clientX - startX.current
      const dy = touch.clientY - startY.current

      // Only fire if horizontal movement exceeds threshold
      // and is more horizontal than vertical (avoid triggering on scroll)
      if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return

      if (dx < 0) {
        onNextRef.current() // swipe left → next
      } else {
        onPrevRef.current() // swipe right → prev
      }
    }

    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [targetRef, enabled, threshold])
}
