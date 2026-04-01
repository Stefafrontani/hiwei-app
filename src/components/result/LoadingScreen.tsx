'use client'

import { motion, type Variants } from 'framer-motion'

const steps = [
  'Analizando tus respuestas',
  'Buscando la mejor opción',
  'Preparando tu recomendación',
]

/**
 * Camera icon as individual SVG paths for stroke-draw animation.
 * Based on Lucide's Camera icon (24x24 viewBox), split into:
 *  1. Body — the rounded-rect camera body with top notch
 *  2. Lens — the circle in the center
 */
const cameraBody =
  'M14.5 4h-5L7.8 5.8A2 2 0 0 1 6.39 6.5H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-2.39a2 2 0 0 1-1.41-.7L14.5 4z'
const cameraLens = 'M15 13a3 3 0 1 1-6 0a3 3 0 0 1 6 0z'

const pathVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (delay: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay, duration: 1, ease: 'easeInOut' },
      opacity: { delay, duration: 0.2 },
    },
  }),
}

const glowVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: [0, 0.25, 0.15],
    scale: [0.8, 1.05, 1],
    transition: { delay: 0.8, duration: 1.2, ease: 'easeOut' },
  },
}

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
        {/* Glow behind icon */}
        <motion.div
          className="pointer-events-none absolute rounded-full"
          style={{
            width: 120,
            height: 120,
            background:
              'radial-gradient(circle, oklch(0.8339 0.1432 93.43 / 0.2) 0%, transparent 70%)',
            filter: 'blur(30px)',
          }}
          variants={glowVariants}
          initial="hidden"
          animate="visible"
        />

        {/* Animated camera SVG */}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width={64}
          height={64}
          viewBox="0 0 24 24"
          fill="none"
          className="relative z-10"
          initial="hidden"
          animate="visible"
        >
          <motion.path
            d={cameraBody}
            stroke="oklch(0.8339 0.1432 93.43)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={pathVariants}
            custom={0.2}
          />
          <motion.path
            d={cameraLens}
            stroke="oklch(0.8339 0.1432 93.43)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={pathVariants}
            custom={0.7}
          />
        </motion.svg>
      </div>

      {/* Animated step text */}
      <div className="flex flex-col items-center gap-2">
        <StepText steps={steps} />
        <motion.p
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          Esto puede tomar unos segundos
        </motion.p>
      </div>
    </motion.div>
  )
}

/** Cycles through step labels with a crossfade */
function StepText({ steps }: { steps: string[] }) {
  // Use CSS animation to cycle through steps without re-renders
  const totalDuration = steps.length * 1.6 // 1.6s per step

  return (
    <div className="relative h-6 overflow-hidden">
      <motion.div
        className="flex flex-col items-center"
        animate={{ y: steps.map((_, i) => -i * 24) }}
        transition={{
          y: {
            times: steps.map((_, i) => i / steps.length),
            duration: totalDuration,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      >
        {steps.map((step, i) => (
          <span
            key={i}
            className="flex h-6 items-center text-base font-semibold text-foreground"
          >
            {step}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
