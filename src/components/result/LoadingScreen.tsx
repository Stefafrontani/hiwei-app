'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const steps = [
  'Analizando tus respuestas',
  'Buscando la mejor opción',
  'Preparando tu recomendación',
]

const cameraBody =
  'M14.5 4h-5L7.8 5.8A2 2 0 0 1 6.39 6.5H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-2.39a2 2 0 0 1-1.41-.7L14.5 4z'
const cameraLens = 'M15 13a3 3 0 1 1-6 0a3 3 0 0 1 6 0z'

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
      {/* Icon container */}
      <div className="relative flex items-center justify-center">
        {/* Glow behind icon — loops */}
        <motion.div
          className="pointer-events-none absolute rounded-full"
          style={{
            width: 120,
            height: 120,
            background:
              'radial-gradient(circle, oklch(0.8339 0.1432 93.43 / 0.2) 0%, transparent 70%)',
            filter: 'blur(30px)',
          }}
          animate={{
            opacity: [0.1, 0.25, 0.1],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Animated camera SVG — loops */}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width={64}
          height={64}
          viewBox="0 0 24 24"
          fill="none"
          className="relative z-10"
        >
          <motion.path
            d={cameraBody}
            stroke="oklch(0.8339 0.1432 93.43)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{
              pathLength: [0, 1, 1, 0],
              opacity: [0.3, 1, 1, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.4, 0.7, 1],
            }}
          />
          <motion.path
            d={cameraLens}
            stroke="oklch(0.8339 0.1432 93.43)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{
              pathLength: [0, 1, 1, 0],
              opacity: [0.3, 1, 1, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.4, 0.7, 1],
              delay: 0.4,
            }}
          />
        </motion.svg>
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
