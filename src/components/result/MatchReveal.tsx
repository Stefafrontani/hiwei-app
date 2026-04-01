'use client'

import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { CircleCheck } from 'lucide-react'
import confetti from 'canvas-confetti'

interface MatchRevealProps {
  onComplete: () => void
}

const CONFETTI_COLORS = ['#e5c761', '#dbd6d1', '#c4a83b', '#f0e0a0']

function fireConfetti() {
  const defaults = {
    colors: CONFETTI_COLORS,
    ticks: 200,
    gravity: 0.8,
    scalar: 1.1,
    disableForReducedMotion: true,
  }

  // Left burst
  confetti({ ...defaults, particleCount: 40, spread: 55, angle: 60, origin: { x: 0.15, y: 0.55 } })
  // Right burst
  confetti({ ...defaults, particleCount: 40, spread: 55, angle: 120, origin: { x: 0.85, y: 0.55 } })

  // Center burst with delay
  setTimeout(() => {
    confetti({ ...defaults, particleCount: 50, spread: 80, origin: { x: 0.5, y: 0.5 } })
  }, 300)
}

export function MatchReveal({ onComplete }: MatchRevealProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSkip = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    onComplete()
  }, [onComplete])

  useEffect(() => {
    // Fire confetti after a short delay for the entrance animation
    const confettiTimer = setTimeout(fireConfetti, 400)

    // Auto-advance after 3s
    timerRef.current = setTimeout(handleSkip, 3000)

    return () => {
      clearTimeout(confettiTimer)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [handleSkip])

  return (
    <motion.div
      key="match-reveal"
      className="flex flex-1 cursor-pointer flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35 }}
      onClick={handleSkip}
    >
      {/* Glow behind icon */}
      <motion.div
        className="pointer-events-none absolute rounded-full"
        style={{
          width: 140,
          height: 140,
          background: 'radial-gradient(circle, oklch(0.8339 0.1432 93.43 / 0.2) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
      />

      {/* Check icon with spring pop */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 0.2,
          type: 'spring',
          stiffness: 300,
          damping: 15,
        }}
      >
        <CircleCheck className="h-16 w-16 text-brand" strokeWidth={1.5} />
      </motion.div>

      {/* Main message */}
      <motion.h2
        className="mt-5 text-center text-xl font-bold text-foreground"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4, ease: 'easeOut' }}
      >
        ¡Ya tenemos tu recomendación!
      </motion.h2>

    </motion.div>
  )
}
