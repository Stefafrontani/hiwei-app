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

    // Track whether the gesture has been identified as horizontal
    let isHorizontal = false

    const handleTouchStart = (e: TouchEvent) => {
      // Ignore pinch-zoom (2+ fingers)
      if (e.touches.length > 1) { tracking.current = false; return }
      const touch = e.touches[0]
      startX.current = touch.clientX
      startY.current = touch.clientY
      tracking.current = true
      isHorizontal = false
    }

    // Cancel if a second finger joins mid-gesture (pinch-zoom started).
    // Once a horizontal swipe is detected, preventDefault to stop the
    // browser from scrolling/overscrolling the page sideways.
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) { tracking.current = false; return }
      if (!tracking.current) return

      if (!isHorizontal) {
        const dx = e.touches[0].clientX - startX.current
        const dy = e.touches[0].clientY - startY.current
        // Determine direction once movement exceeds a small dead zone
        if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
          isHorizontal = Math.abs(dx) > Math.abs(dy)
          if (!isHorizontal) {
            // Vertical gesture — stop tracking, let page scroll normally
            tracking.current = false
          }
        }
      }

      if (isHorizontal) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!tracking.current) return
      tracking.current = false

      // Skip when page is zoomed in — single-finger swipe is for panning, not navigation
      if (window.visualViewport && window.visualViewport.scale > 1.05) return

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
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [targetRef, enabled, threshold])
}
