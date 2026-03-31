'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const FS_CLASS = 'video-fullscreen'
const FS_ROTATED_CLASS = 'video-fullscreen-rotated'
const BODY_CLASS = 'video-fullscreen-active'

interface UseFullscreenOptions {
  targetRef: React.RefObject<HTMLElement | null>
  onExitFullscreen?: () => void
}

interface UseFullscreenReturn {
  isFullscreen: boolean
  enterFullscreen: () => void
  exitFullscreen: () => void
  toggleFullscreen: () => void
}

export function useFullscreen({ targetRef, onExitFullscreen }: UseFullscreenOptions): UseFullscreenReturn {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const scrollYRef = useRef(0)
  const orientationLockedRef = useRef(false)

  const enterFullscreen = useCallback(async () => {
    const el = targetRef.current
    if (!el) return

    // Promote to browser's top layer via Popover API
    try {
      el.showPopover()
    } catch {
      // Fallback for browsers without Popover API
    }

    // Try native orientation lock first (Android Chrome, etc.)
    // The lock() method exists on some browsers but is not in all TS lib types
    const orientation = screen.orientation as ScreenOrientation & {
      lock?: (orientation: string) => Promise<void>
    }
    try {
      if (orientation.lock) {
        await orientation.lock('landscape')
        orientationLockedRef.current = true
        el.classList.add(FS_CLASS)
      } else {
        throw new Error('lock not supported')
      }
    } catch {
      // Fallback: CSS rotation for iOS Safari and unsupported browsers
      const isPortrait = window.innerHeight > window.innerWidth
      el.classList.add(isPortrait ? FS_ROTATED_CLASS : FS_CLASS)
    }

    // Lock body scroll
    scrollYRef.current = window.scrollY
    document.body.classList.add(BODY_CLASS)
    document.body.style.top = `-${scrollYRef.current}px`

    // Push history state for back-button handling
    window.history.pushState({ videoFullscreen: true }, '')

    setIsFullscreen(true)
  }, [targetRef])

  const exitingRef = useRef(false)

  const doExit = useCallback((fromPopstate: boolean) => {
    if (exitingRef.current) return
    exitingRef.current = true

    const el = targetRef.current
    if (!el) { exitingRef.current = false; return }

    // Unlock orientation if we locked it
    if (orientationLockedRef.current) {
      try {
        screen.orientation.unlock()
      } catch {
        // ignore
      }
      orientationLockedRef.current = false
    }

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

    // Pop the history entry — skip if already navigating via back button
    if (!fromPopstate && window.history.state?.videoFullscreen) {
      window.history.back()
    }

    // Notify caller (e.g. to reset zoom)
    onExitFullscreen?.()

    setIsFullscreen(false)
    exitingRef.current = false
  }, [targetRef, onExitFullscreen])

  const exitFullscreen = useCallback(() => doExit(false), [doExit])

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

    const handlePopState = () => doExit(true)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isFullscreen, doExit])

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
