'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const steps = [
  'Analizando tus respuestas',
  'Buscando la mejor opción',
  'Preparando tu recomendación',
]

/* ── hiwei isotipo paths (from public/icons/isotipo.svg) ── */
const letterH =
  'M0,204.38V0h26.53v74.35c13.1-12.45,30.13-19.98,49.13-20.64,47.82-1.96,71.08,34.06,71.08,76.32v74.35h-26.53v-74.35c0-27.19-11.79-52.73-44.55-51.75-32.43.98-49.13,27.18-49.13,41.27l-.33,84.83H0Z'
const letterW =
  'M269.24,118.57l-34.06,85.49h-28.17l-59.28-148.37h28.5l44.87,121.84,44.87-121.84h28.5l-11.46,28.5,34.72,93.35,44.87-121.84h28.17l-58.96,148.37h-28.5l-34.06-85.49Z'
const dotH = { cx: 159.34, cy: 17.03, r: 17.03 }
const dotW = { cx: 376.41, cy: 17.03, r: 17.03 }

const STROKE_COLOR = 'oklch(0.8339 0.1432 93.43)' // brand gold
const FILL_COLOR = '#dbd6d1' // original letter fill
const DOT_COLOR = '#e5c761' // original dot fill

/** Total cycle: draw h (0-0.8s) → draw w (0.4-1.2s) → fill fade (1.2-1.5s) → dots (1.5-2s) → hold (2-3s) → fade all (3-3.6s) → restart */
const CYCLE = 4

export function LoadingScreen() {
  return (
    <motion.div
      key="loading-screen"
      className="flex flex-1 flex-col items-center justify-center gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Isotipo container */}
      <div className="relative flex items-center justify-center">
        {/* Glow behind isotipo — loops */}
        <motion.div
          className="pointer-events-none absolute rounded-full"
          style={{
            width: 160,
            height: 80,
            background:
              'radial-gradient(ellipse, oklch(0.8339 0.1432 93.43 / 0.15) 0%, transparent 70%)',
            filter: 'blur(30px)',
          }}
          animate={{
            opacity: [0.08, 0.2, 0.08],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Animated isotipo SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={120}
          height={72}
          viewBox="-20 -30 433.44 264.38"
          fill="none"
          className="relative z-10"
          overflow="visible"
        >
          {/* Letter H — stroke draw + fill */}
          <motion.path
            d={letterH}
            stroke={STROKE_COLOR}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={FILL_COLOR}
            animate={{
              pathLength: [0, 1, 1, 1, 0],
              fillOpacity: [0, 0, 1, 1, 0],
              strokeOpacity: [1, 1, 0.3, 0.3, 0],
            }}
            transition={{
              duration: CYCLE,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.25, 0.35, 0.75, 1],
            }}
          />

          {/* Letter W — stroke draw + fill (staggered) */}
          <motion.path
            d={letterW}
            stroke={STROKE_COLOR}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={FILL_COLOR}
            animate={{
              pathLength: [0, 0, 1, 1, 1, 0],
              fillOpacity: [0, 0, 0, 1, 1, 0],
              strokeOpacity: [0, 1, 1, 0.3, 0.3, 0],
            }}
            transition={{
              duration: CYCLE,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.1, 0.3, 0.38, 0.75, 1],
            }}
          />

          {/* Dot H — headlight glow */}
          <motion.circle
            cx={dotH.cx}
            cy={dotH.cy}
            r={dotH.r}
            fill={DOT_COLOR}
            animate={{
              opacity: [0, 0, 1, 1, 0],
              scale: [0, 0, 1.2, 1, 0],
            }}
            style={{ transformOrigin: `${dotH.cx}px ${dotH.cy}px` }}
            transition={{
              duration: CYCLE,
              repeat: Infinity,
              ease: 'easeOut',
              times: [0, 0.35, 0.42, 0.75, 1],
            }}
          />

          {/* Dot W — headlight glow (slight stagger) */}
          <motion.circle
            cx={dotW.cx}
            cy={dotW.cy}
            r={dotW.r}
            fill={DOT_COLOR}
            animate={{
              opacity: [0, 0, 1, 1, 0],
              scale: [0, 0, 1.2, 1, 0],
            }}
            style={{ transformOrigin: `${dotW.cx}px ${dotW.cy}px` }}
            transition={{
              duration: CYCLE,
              repeat: Infinity,
              ease: 'easeOut',
              times: [0, 0.38, 0.45, 0.75, 1],
            }}
          />

          {/* Glow filters for dots */}
          <defs>
            <filter id="dot-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Extra glow circles behind dots (visible only when dots are shown) */}
          <motion.circle
            cx={dotH.cx}
            cy={dotH.cy}
            r={dotH.r * 1.6}
            fill={DOT_COLOR}
            filter="url(#dot-glow)"
            animate={{
              opacity: [0, 0, 0.3, 0.15, 0.3, 0.15, 0],
            }}
            transition={{
              duration: CYCLE,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.38, 0.45, 0.55, 0.65, 0.75, 1],
            }}
          />
          <motion.circle
            cx={dotW.cx}
            cy={dotW.cy}
            r={dotW.r * 1.6}
            fill={DOT_COLOR}
            filter="url(#dot-glow)"
            animate={{
              opacity: [0, 0, 0.3, 0.15, 0.3, 0.15, 0],
            }}
            transition={{
              duration: CYCLE,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.4, 0.47, 0.57, 0.67, 0.75, 1],
            }}
          />
        </svg>
      </div>

      {/* Animated step text */}
      <div className="flex flex-col items-center gap-2">
        <StepText steps={steps} />
        <p className="text-sm text-muted-foreground">
          Esto puede tomar unos segundos
        </p>
      </div>
    </motion.div>
  )
}

/** Cycles through step labels with a smooth crossfade */
function StepText({ steps }: { steps: string[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % steps.length)
    }, 2000)
    return () => clearInterval(id)
  }, [steps.length])

  return (
    <div className="relative h-6 w-72 overflow-hidden text-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className="absolute inset-x-0 text-base font-semibold text-foreground"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          {steps[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
