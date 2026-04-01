'use client'

import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorScreenProps {
  onRetry: () => void
  onRestart: () => void
}

export function ErrorScreen({ onRetry, onRestart }: ErrorScreenProps) {
  return (
    <motion.div
      key="error-screen"
      className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-7 w-7 text-destructive" />
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-foreground">No pudimos generar tu recomendación</h2>
        <p className="text-sm text-muted-foreground">Hubo un problema al procesar tu solicitud</p>
      </div>
      <div className="mt-2 flex gap-3">
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="h-3.5 w-3.5" />
          Reintentar
        </Button>
        <Button variant="brand" onClick={onRestart}>
          Volver al cotizador
        </Button>
      </div>
    </motion.div>
  )
}
