'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const FS_CLASS = 'video-fullscreen'
const FS_ROTATED_CLASS = 'video-fullscreen-rotated'
const BODY_CLASS = 'video-fullscreen-active'

interface UseFullscreenOptions {
  targetRef: React.RefObject<HTMLElement | null>
}

interface UseFullscreenReturn {
  isFullscreen: boolean
  enterFullscreen: () => void
  exitFullscreen: () => void
  toggleFullscreen: () => void
}

export function useFullscreen({ targetRef }: UseFullscreenOptions): UseFullscreenReturn {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const scrollYRef = useRef(0)

  const enterFullscreen = useCallback(() => {
    const el = targetRef.current
    if (!el) return

    // Promote to browser's top layer via Popover API
    // Escapes ALL stacking contexts without moving the DOM (iframe stays intact)
    try {
      el.showPopover()
    } catch {
      // Fallback for browsers without Popover API — apply class anyway
    }

    // Apply fullscreen CSS
    const isPortrait = window.innerHeight > window.innerWidth
    el.classList.add(isPortrait ? FS_ROTATED_CLASS : FS_CLASS)

    // Lock body scroll
    scrollYRef.current = window.scrollY
    document.body.classList.add(BODY_CLASS)
    document.body.style.top = `-${scrollYRef.current}px`

    // Push history state for back-button handling
    window.history.pushState({ videoFullscreen: true }, '')

    setIsFullscreen(true)
  }, [targetRef])

  const exitFullscreen = useCallback(() => {
    const el = targetRef.current
    if (!el) return

    // Remove fullscreen CSS
    el.classList.remove(FS_CLASS, FS_ROTATED_CLASS)

    // Return from top layer
    try {
      el.hidePopover()
    } catch {
      // Fallback for browsers without Popover API
    }

    // Restore body scroll
    document.body.classList.remove(BODY_CLASS)
    document.body.style.top = ''
    window.scrollTo(0, scrollYRef.current)

    // Pop the history entry we pushed on enter (if it's still there)
    if (window.history.state?.videoFullscreen) {
      window.history.back()
    }

    setIsFullscreen(false)
  }, [targetRef])

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      exitFullscreen()
    } else {
      enterFullscreen()
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen])

  // Escape key to exit
  useEffect(() => {
    if (!isFullscreen) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        exitFullscreen()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isFullscreen, exitFullscreen])

  // Back button (popstate) to exit
  useEffect(() => {
    if (!isFullscreen) return

    const handlePopState = () => exitFullscreen()
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isFullscreen, exitFullscreen])

  // Handle device rotation while in fullscreen
  useEffect(() => {
    if (!isFullscreen) return

    const handleResize = () => {
      const el = targetRef.current
      if (!el) return

      const isPortrait = window.innerHeight > window.innerWidth
      const currentlyRotated = el.classList.contains(FS_ROTATED_CLASS)
      if (isPortrait !== currentlyRotated) {
        el.classList.remove(FS_CLASS, FS_ROTATED_CLASS)
        el.classList.add(isPortrait ? FS_ROTATED_CLASS : FS_CLASS)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isFullscreen, targetRef])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const el = targetRef.current
      if (el) {
        el.classList.remove(FS_CLASS, FS_ROTATED_CLASS)
        try { el.hidePopover() } catch { /* ignore */ }
      }
      document.body.classList.remove(BODY_CLASS)
      document.body.style.top = ''
      window.scrollTo(0, scrollYRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { isFullscreen, enterFullscreen, exitFullscreen, toggleFullscreen }
}
