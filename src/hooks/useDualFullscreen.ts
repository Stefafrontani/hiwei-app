'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const FS_CLASS = 'dual-fullscreen'
const FS_ROTATED_CLASS = 'dual-fullscreen-rotated'
const BODY_CLASS = 'video-fullscreen-active'

interface UseDualFullscreenOptions {
  targetRef: React.RefObject<HTMLElement | null>
  onExit?: () => void
}

interface UseDualFullscreenReturn {
  isDualFullscreen: boolean
  isRotated: boolean
  enterDualFullscreen: () => void
  exitDualFullscreen: () => void
  toggleDualFullscreen: () => void
}

export function useDualFullscreen({ targetRef, onExit }: UseDualFullscreenOptions): UseDualFullscreenReturn {
  const [isDualFullscreen, setIsDualFullscreen] = useState(false)
  const [isRotated, setIsRotated] = useState(false)
  const scrollYRef = useRef(0)
  const orientationLockedRef = useRef(false)
  const onExitRef = useRef(onExit)
  useEffect(() => { onExitRef.current = onExit })

  const enterDualFullscreen = useCallback(async () => {
    const el = targetRef.current
    if (!el) return

    try {
      el.showPopover()
    } catch {
      // Fallback for browsers without Popover API
    }

    const orientation = screen.orientation as ScreenOrientation & {
      lock?: (orientation: string) => Promise<void>
    }
    try {
      if (orientation.lock) {
        await orientation.lock('landscape')
        orientationLockedRef.current = true
        el.classList.add(FS_CLASS)
        setIsRotated(false)
      } else {
        throw new Error('lock not supported')
      }
    } catch {
      const isPortrait = window.innerHeight > window.innerWidth
      el.classList.add(isPortrait ? FS_ROTATED_CLASS : FS_CLASS)
      setIsRotated(isPortrait)
    }

    scrollYRef.current = window.scrollY
    document.body.classList.add(BODY_CLASS)
    document.body.style.top = `-${scrollYRef.current}px`

    window.history.pushState({ dualFullscreen: true }, '')

    setIsDualFullscreen(true)
  }, [targetRef])

  const exitingRef = useRef(false)

  const doExit = useCallback((fromPopstate: boolean) => {
    if (exitingRef.current) return
    exitingRef.current = true

    const el = targetRef.current
    if (!el) { exitingRef.current = false; return }

    if (orientationLockedRef.current) {
      try {
        screen.orientation.unlock()
      } catch {
        // ignore
      }
      orientationLockedRef.current = false
    }

    el.classList.remove(FS_CLASS, FS_ROTATED_CLASS)

    try {
      el.hidePopover()
    } catch {
      // Fallback for browsers without Popover API
    }

    document.body.classList.remove(BODY_CLASS)
    document.body.style.top = ''
    window.scrollTo(0, scrollYRef.current)

    if (!fromPopstate && window.history.state?.dualFullscreen) {
      window.history.back()
    }

    onExit?.()
    setIsRotated(false)
    setIsDualFullscreen(false)
    exitingRef.current = false
  }, [targetRef, onExit])

  const exitDualFullscreen = useCallback(() => doExit(false), [doExit])

  const toggleDualFullscreen = useCallback(() => {
    if (isDualFullscreen) {
      exitDualFullscreen()
    } else {
      enterDualFullscreen()
    }
  }, [isDualFullscreen, enterDualFullscreen, exitDualFullscreen])

  // Escape key
  useEffect(() => {
    if (!isDualFullscreen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        exitDualFullscreen()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isDualFullscreen, exitDualFullscreen])

  // Back button
  useEffect(() => {
    if (!isDualFullscreen) return
    const handlePopState = () => doExit(true)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isDualFullscreen, doExit])

  // Handle rotation while in dual fullscreen
  useEffect(() => {
    if (!isDualFullscreen) return
    const handleResize = () => {
      const el = targetRef.current
      if (!el || orientationLockedRef.current) return
      const isPortrait = window.innerHeight > window.innerWidth
      const currentlyRotated = el.classList.contains(FS_ROTATED_CLASS)
      if (isPortrait !== currentlyRotated) {
        el.classList.remove(FS_CLASS, FS_ROTATED_CLASS)
        el.classList.add(isPortrait ? FS_ROTATED_CLASS : FS_CLASS)
        setIsRotated(isPortrait)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isDualFullscreen, targetRef])

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
      onExitRef.current?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { isDualFullscreen, isRotated, enterDualFullscreen, exitDualFullscreen, toggleDualFullscreen }
}
