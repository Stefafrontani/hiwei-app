'use client'

import { useCallback, useEffect, useRef } from 'react'

interface TrackedVideo {
  element: HTMLVideoElement
  wrapper: Element
  ratio: number
}

interface UseScrollAutoplayOptions {
  enabled: boolean
}

export function useScrollAutoplay({ enabled }: UseScrollAutoplayOptions) {
  const videosRef = useRef(new Map<string, TrackedVideo>())
  const activeIdRef = useRef<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const enabledRef = useRef(enabled)
  useEffect(() => { enabledRef.current = enabled }, [enabled])

  const pickAndPlay = useCallback(() => {
    const videos = videosRef.current

    // If any video is in fullscreen (popover top-layer), don't change playback state
    for (const [, entry] of videos) {
      if ((entry.wrapper as HTMLElement).matches?.(':popover-open')) return
    }

    let bestId: string | null = null
    let bestRatio = 0

    for (const [id, entry] of videos) {
      if (entry.ratio >= 0.5 && entry.ratio > bestRatio) {
        bestRatio = entry.ratio
        bestId = id
      }
    }

    if (bestId === activeIdRef.current) return

    // Pause ALL non-active videos (not just the previous active one,
    // because on initial load all videos may be playing via autoplay)
    for (const [id, entry] of videos) {
      if (id !== bestId && !entry.element.paused) {
        entry.element.pause()
      }
    }

    activeIdRef.current = bestId

    // Play the new active video
    if (bestId) {
      const next = videos.get(bestId)
      if (next && next.element.paused) next.element.play().catch(() => {})
    }
  }, [])

  // Create/destroy observer when enabled changes
  useEffect(() => {
    if (!enabled) {
      observerRef.current?.disconnect()
      observerRef.current = null
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          for (const [, tracked] of videosRef.current) {
            if (tracked.wrapper === entry.target) {
              tracked.ratio = entry.intersectionRatio
              break
            }
          }
        }
        pickAndPlay()
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1.0] },
    )

    observerRef.current = observer

    // Observe any already-registered elements
    for (const [, tracked] of videosRef.current) {
      observer.observe(tracked.wrapper)
    }

    return () => observer.disconnect()
  }, [enabled, pickAndPlay])

  const handleLoadedMetadata = useCallback((e: Event) => {
    if (!enabledRef.current) return
    const videoEl = e.target as HTMLVideoElement
    for (const [id, tracked] of videosRef.current) {
      if (tracked.element === videoEl) {
        if (id === activeIdRef.current) {
          videoEl.play().catch(() => {})
        } else {
          // Ensure non-active videos that just loaded don't autoplay
          videoEl.pause()
        }
        break
      }
    }
  }, [])

  const register = useCallback(
    (id: string, videoEl: HTMLVideoElement) => {
      const wrapper = videoEl.closest('.video-popover')
      if (!wrapper) return

      videosRef.current.set(id, { element: videoEl, wrapper, ratio: 0 })
      videoEl.addEventListener('loadedmetadata', handleLoadedMetadata)

      if (observerRef.current) {
        observerRef.current.observe(wrapper)
      }
    },
    [handleLoadedMetadata],
  )

  const unregister = useCallback(
    (id: string) => {
      const tracked = videosRef.current.get(id)
      if (tracked) {
        tracked.element.removeEventListener('loadedmetadata', handleLoadedMetadata)
        if (observerRef.current) {
          observerRef.current.unobserve(tracked.wrapper)
        }
      }

      videosRef.current.delete(id)

      if (activeIdRef.current === id) {
        activeIdRef.current = null
        pickAndPlay()
      }
    },
    [handleLoadedMetadata, pickAndPlay],
  )

  return { register, unregister, enabled }
}
