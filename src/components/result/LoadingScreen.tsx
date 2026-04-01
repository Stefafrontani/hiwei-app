'use client'

import { motion } from 'framer-motion'
import { Camera } from 'lucide-react'

const words = ['Analizando', 'tus', 'respuestas...']

const ringDelays = [0, 0.8, 1.6]

export function LoadingScreen() {
  return (
    <motion.div
      key="loading-screen"
      className="flex flex-1 flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Pulsing concentric rings */}
      <div className="relative flex h-40 w-40 items-center justify-center">
        {ringDelays.map((delay, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-brand"
            initial={{ scale: 1, opacity: 0.12 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: 'easeOut',
              delay,
            }}
          />
        ))}

        {/* Center icon */}
        <motion.div
          className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.04] backdrop-blur-xl"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Camera className="h-9 w-9 text-brand" />
        </motion.div>
      </div>

      {/* Word-by-word text reveal */}
      <div className="mt-8 flex gap-1.5">
        {words.map((word, i) => (
          <motion.span
            key={i}
            className="text-base font-semibold text-foreground"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.12, duration: 0.35, ease: 'easeOut' }}
          >
            {word}
          </motion.span>
        ))}
      </div>

      <motion.p
        className="mt-2 text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.4 }}
      >
        Esto puede tomar unos segundos
      </motion.p>
    </motion.div>
  )
}
