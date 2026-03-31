'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface UseVideoZoomOptions {
  containerRef: React.RefObject<HTMLElement | null>
  enabled?: boolean
  maxScale?: number
}

interface UseVideoZoomReturn {
  scale: number
  resetZoom: () => void
  zoomStyle: React.CSSProperties
  zoomHandlers: {
    onTouchStart: (e: React.TouchEvent) => void
    onTouchMove: (e: React.TouchEvent) => void
    onTouchEnd: () => void
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function getDistance(a: React.Touch, b: React.Touch) {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
}

export function useVideoZoom({
  containerRef,
  enabled = true,
  maxScale = 1.5,
}: UseVideoZoomOptions): UseVideoZoomReturn {
  const [scale, setScale] = useState(1)
  const [translateX, setTranslateX] = useState(0)
  const [translateY, setTranslateY] = useState(0)

  // Refs for gesture tracking (avoid state updates during gestures)
  const scaleRef = useRef(1)
  const txRef = useRef(0)
  const tyRef = useRef(0)
  const baseScaleRef = useRef(1)
  const initialDistRef = useRef(0)
  const initialMidRef = useRef({ x: 0, y: 0 })
  const isPinchingRef = useRef(false)
  const isPanningRef = useRef(false)
  const panStartRef = useRef({ x: 0, y: 0 })
  const panBaseTxRef = useRef(0)
  const panBaseTyRef = useRef(0)

  const commitState = useCallback(() => {
    setScale(scaleRef.current)
    setTranslateX(txRef.current)
    setTranslateY(tyRef.current)
  }, [])

  const resetZoom = useCallback(() => {
    scaleRef.current = 1
    txRef.current = 0
    tyRef.current = 0
    baseScaleRef.current = 1
    isPinchingRef.current = false
    isPanningRef.current = false
    setScale(1)
    setTranslateX(0)
    setTranslateY(0)
  }, [])

  // Clamp translation so edges don't go beyond container
  const clampTranslation = useCallback((tx: number, ty: number, s: number) => {
    const el = containerRef.current
    if (!el || s <= 1) return { tx: 0, ty: 0 }

    const rect = el.getBoundingClientRect()
    const maxTx = (rect.width * (s - 1)) / 2
    const maxTy = (rect.height * (s - 1)) / 2

    return {
      tx: clamp(tx, -maxTx, maxTx),
      ty: clamp(ty, -maxTy, maxTy),
    }
  }, [containerRef])

  // Native wheel listener with { passive: false } to allow preventDefault
  useEffect(() => {
    const el = containerRef.current
    if (!el || !enabled) return

    const handleWheel = (e: WheelEvent) => {
      const rect = el.getBoundingClientRect()
      const cursorX = e.clientX - rect.left
      const cursorY = e.clientY - rect.top

      const prevScale = scaleRef.current
      const delta = -e.deltaY * 0.002
      const newScale = clamp(prevScale + delta, 1, maxScale)

      if (newScale === prevScale) return

      e.preventDefault()

      // Zoom centered on cursor
      const ratio = newScale / prevScale
      const newTx = cursorX - (cursorX - txRef.current) * ratio
      const newTy = cursorY - (cursorY - tyRef.current) * ratio

      const clamped = clampTranslation(newTx, newTy, newScale)
      scaleRef.current = newScale
      txRef.current = clamped.tx
      tyRef.current = clamped.ty
      commitState()
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [containerRef, enabled, maxScale, clampTranslation, commitState])

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enabled) return

    if (e.touches.length === 2) {
      // Start pinch
      isPinchingRef.current = true
      isPanningRef.current = false
      initialDistRef.current = getDistance(e.touches[0], e.touches[1])
      baseScaleRef.current = scaleRef.current
      initialMidRef.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      }
    } else if (e.touches.length === 1 && scaleRef.current > 1) {
      // Start panning (only when zoomed)
      isPanningRef.current = true
      panStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      panBaseTxRef.current = txRef.current
      panBaseTyRef.current = tyRef.current
    }
  }, [enabled])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!enabled) return

    if (isPinchingRef.current && e.touches.length === 2) {
      const newDist = getDistance(e.touches[0], e.touches[1])
      const newScale = clamp(
        baseScaleRef.current * (newDist / initialDistRef.current),
        1,
        maxScale,
      )

      const el = containerRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top

      // Zoom centered on midpoint
      const ratio = newScale / scaleRef.current
      const newTx = midX - (midX - txRef.current) * ratio
      const newTy = midY - (midY - tyRef.current) * ratio

      const clamped = clampTranslation(newTx, newTy, newScale)
      scaleRef.current = newScale
      txRef.current = clamped.tx
      tyRef.current = clamped.ty
      commitState()
    } else if (isPanningRef.current && e.touches.length === 1) {
      const dx = e.touches[0].clientX - panStartRef.current.x
      const dy = e.touches[0].clientY - panStartRef.current.y

      const clamped = clampTranslation(
        panBaseTxRef.current + dx,
        panBaseTyRef.current + dy,
        scaleRef.current,
      )
      txRef.current = clamped.tx
      tyRef.current = clamped.ty
      commitState()
    }
  }, [enabled, containerRef, maxScale, clampTranslation, commitState])

  const onTouchEnd = useCallback(() => {
    if (isPinchingRef.current) {
      isPinchingRef.current = false
      baseScaleRef.current = scaleRef.current
      // Snap back to 1 if barely zoomed
      if (scaleRef.current < 1.05) {
        resetZoom()
      }
    }
    isPanningRef.current = false
  }, [resetZoom])

  // Prevent default touch behavior when zoomed to avoid browser scroll/zoom
  useEffect(() => {
    const el = containerRef.current
    if (!el || !enabled) return

    const handler = (e: TouchEvent) => {
      if (scaleRef.current > 1 || e.touches.length === 2) {
        e.preventDefault()
      }
    }

    el.addEventListener('touchmove', handler, { passive: false })
    return () => el.removeEventListener('touchmove', handler)
  }, [containerRef, enabled])

  const zoomStyle: React.CSSProperties = scale > 1
    ? {
        transform: `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`,
        transformOrigin: 'center center',
        willChange: 'transform',
      }
    : {}

  return {
    scale,
    resetZoom,
    zoomStyle,
    zoomHandlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  }
}
