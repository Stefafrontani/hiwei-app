'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface UseVideoZoomOptions {
  containerRef: React.RefObject<HTMLElement | null>
  enabled?: boolean
  maxScale?: number
  /** Whether the container is CSS-rotated 90deg CW (fullscreen on portrait mobile) */
  isRotated?: boolean
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
  isRotated = false,
}: UseVideoZoomOptions): UseVideoZoomReturn {
  const [scale, setScale] = useState(1)
  const [translateX, setTranslateX] = useState(0)
  const [translateY, setTranslateY] = useState(0)

  // Track rotation in a ref so gesture callbacks always see the latest value
  const isRotatedRef = useRef(isRotated)
  isRotatedRef.current = isRotated

  /**
   * Convert a screen-space delta (dx, dy) to element-local space.
   * When the container is rotated 90deg CW via CSS:
   *   screen +X (right) → element -Y
   *   screen +Y (down)  → element +X
   */
  const toLocal = useCallback((screenDx: number, screenDy: number) => {
    if (!isRotatedRef.current) return { dx: screenDx, dy: screenDy }
    return { dx: screenDy, dy: -screenDx }
  }, [])

  /**
   * Convert a screen-space point relative to the element's bounding rect
   * into element-local coordinates (relative to element center).
   */
  const screenToLocal = useCallback((screenX: number, screenY: number, rect: DOMRect) => {
    if (!isRotatedRef.current) {
      return { x: screenX - rect.left, y: screenY - rect.top }
    }
    // For 90deg CW rotation, the bounding rect's width/height are swapped vs element local
    // Element local X = distance from visual top (screenY - rect.top)
    // Element local Y = distance from visual right (rect.right - screenX)
    return {
      x: screenY - rect.top,
      y: rect.right - screenX,
    }
  }, [])

  /**
   * Get the element's local dimensions (accounting for rotation swap).
   */
  const getLocalDimensions = useCallback((rect: DOMRect) => {
    if (!isRotatedRef.current) return { width: rect.width, height: rect.height }
    return { width: rect.height, height: rect.width }
  }, [])

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
    const { width, height } = getLocalDimensions(rect)
    const maxTx = (width * (s - 1)) / 2
    const maxTy = (height * (s - 1)) / 2

    return {
      tx: clamp(tx, -maxTx, maxTx),
      ty: clamp(ty, -maxTy, maxTy),
    }
  }, [containerRef, getLocalDimensions])

  // Native wheel listener with { passive: false } to allow preventDefault
  useEffect(() => {
    const el = containerRef.current
    if (!el || !enabled) return

    const handleWheel = (e: WheelEvent) => {
      const rect = el.getBoundingClientRect()
      const cursor = screenToLocal(e.clientX, e.clientY, rect)

      const prevScale = scaleRef.current
      const delta = -e.deltaY * 0.002
      const newScale = clamp(prevScale + delta, 1, maxScale)

      if (newScale === prevScale) return

      e.preventDefault()

      // Zoom centered on cursor (in element-local coordinates)
      const ratio = newScale / prevScale
      const newTx = cursor.x - (cursor.x - txRef.current) * ratio
      const newTy = cursor.y - (cursor.y - tyRef.current) * ratio

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
      const screenMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2
      const screenMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2
      const mid = screenToLocal(screenMidX, screenMidY, rect)

      // Zoom centered on midpoint (in element-local coordinates)
      const ratio = newScale / scaleRef.current
      const newTx = mid.x - (mid.x - txRef.current) * ratio
      const newTy = mid.y - (mid.y - tyRef.current) * ratio

      const clamped = clampTranslation(newTx, newTy, newScale)
      scaleRef.current = newScale
      txRef.current = clamped.tx
      tyRef.current = clamped.ty
      commitState()
    } else if (isPanningRef.current && e.touches.length === 1) {
      const screenDx = e.touches[0].clientX - panStartRef.current.x
      const screenDy = e.touches[0].clientY - panStartRef.current.y
      const { dx, dy } = toLocal(screenDx, screenDy)

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
