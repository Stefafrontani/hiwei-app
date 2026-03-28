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
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const originalParentRef = useRef<HTMLElement | null>(null)
  const originalNextSiblingRef = useRef<Node | null>(null)

  const enterFullscreen = useCallback(() => {
    const el = targetRef.current
    if (!el) return

    // Save original DOM position for restoration
    originalParentRef.current = el.parentElement
    originalNextSiblingRef.current = el.nextSibling

    // Create overlay container at body level (escapes all stacking contexts)
    const overlay = document.createElement('div')
    const isPortrait = window.innerHeight > window.innerWidth
    overlay.className = isPortrait ? FS_ROTATED_CLASS : FS_CLASS
    document.body.appendChild(overlay)
    overlayRef.current = overlay

    // Move the element into the body-level overlay
    overlay.appendChild(el)

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

    // Move element back to its original DOM position
    if (originalParentRef.current) {
      if (originalNextSiblingRef.current && originalNextSiblingRef.current.parentNode === originalParentRef.current) {
        originalParentRef.current.insertBefore(el, originalNextSiblingRef.current)
      } else {
        originalParentRef.current.appendChild(el)
      }
    }
    originalParentRef.current = null
    originalNextSiblingRef.current = null

    // Remove overlay
    if (overlayRef.current) {
      overlayRef.current.remove()
      overlayRef.current = null
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
      const overlay = overlayRef.current
      if (!overlay) return

      const isPortrait = window.innerHeight > window.innerWidth
      const currentlyRotated = overlay.classList.contains(FS_ROTATED_CLASS)
      if (isPortrait !== currentlyRotated) {
        overlay.classList.remove(FS_CLASS, FS_ROTATED_CLASS)
        overlay.classList.add(isPortrait ? FS_ROTATED_CLASS : FS_CLASS)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isFullscreen])

  // Cleanup on unmount — move element back if still in fullscreen
  useEffect(() => {
    return () => {
      if (overlayRef.current && targetRef.current && originalParentRef.current) {
        const el = targetRef.current
        if (originalNextSiblingRef.current && originalNextSiblingRef.current.parentNode === originalParentRef.current) {
          originalParentRef.current.insertBefore(el, originalNextSiblingRef.current)
        } else {
          originalParentRef.current.appendChild(el)
        }
        overlayRef.current.remove()
      }
      document.body.classList.remove(BODY_CLASS)
      document.body.style.top = ''
      window.scrollTo(0, scrollYRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { isFullscreen, enterFullscreen, exitFullscreen, toggleFullscreen }
}
