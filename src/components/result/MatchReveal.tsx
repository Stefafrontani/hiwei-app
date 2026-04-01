'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

interface MatchRevealProps {
  matchScore: number
  productName: string
  onComplete: () => void
}

const RING_SIZE = 148
const STROKE_WIDTH = 4
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function MatchReveal({ matchScore, productName, onComplete }: MatchRevealProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [displayScore, setDisplayScore] = useState(0)
  const motionScore = useMotionValue(0)
  const dashOffset = useTransform(motionScore, (v) => CIRCUMFERENCE * (1 - v / 100))

  useEffect(() => {
    const controls = animate(motionScore, matchScore, {
      duration: 1.2,
      ease: [0.32, 0, 0.67, 0],
      onUpdate: (v) => setDisplayScore(Math.round(v)),
    })

    timerRef.current = setTimeout(onComplete, 3500)

    return () => {
      controls.stop()
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [matchScore, motionScore, onComplete])

  const handleSkip = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    onComplete()
  }

  return (
    <motion.div
      key="match-reveal"
      className="relative flex flex-1 cursor-pointer flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35 }}
      onClick={handleSkip}
    >
      {/* Glow bloom behind the ring */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 220,
          height: 220,
          background: 'radial-gradient(circle, oklch(0.8339 0.1432 93.43 / 0.18) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [0.8, 1.1, 1], opacity: [0, 0.25, 0.18] }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />

      {/* Label */}
      <motion.p
        className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        Tu dashcam ideal
      </motion.p>

      {/* Score ring + counter */}
      <div className="relative flex shrink-0 items-center justify-center" style={{ width: RING_SIZE, height: RING_SIZE }}>
        <svg
          width={RING_SIZE}
          height={RING_SIZE}
          viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
          className="absolute -rotate-90"
          style={{ filter: 'drop-shadow(0 0 10px oklch(0.8339 0.1432 93.43 / 0.2))' }}
        >
          {/* Background ring */}
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="oklch(1 0 0 / 0.06)"
            strokeWidth={STROKE_WIDTH}
          />
          {/* Animated foreground ring */}
          <motion.circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="oklch(0.8339 0.1432 93.43)"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            style={{ strokeDashoffset: dashOffset }}
          />
        </svg>

        {/* Counter number */}
        <div className="relative z-10 flex items-baseline gap-0.5">
          <span className="text-4xl font-bold tabular-nums text-brand">{displayScore}</span>
          <span className="text-lg font-semibold text-muted-foreground">%</span>
        </div>
      </div>

      {/* Product name */}
      <motion.h2
        className="mt-5 text-center text-xl font-bold text-foreground"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.4 }}
      >
        {productName}
      </motion.h2>

      <motion.p
        className="mt-1.5 text-sm text-muted-foreground"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.4 }}
      >
        Compatibilidad con tus necesidades
      </motion.p>

      {/* Tap to continue hint */}
      <motion.p
        className="mt-auto pb-6 text-xs text-muted-foreground/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0.6] }}
        transition={{ delay: 1.8, duration: 0.5 }}
      >
        Tocá para continuar
      </motion.p>
    </motion.div>
  )
}
