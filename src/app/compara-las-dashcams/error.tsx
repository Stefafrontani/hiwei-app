'use client'

import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/layout/SiteHeader'

export default function ComparadorError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="quiz-gradient grain-overlay flex h-dvh flex-col overflow-hidden">
      <SiteHeader activeNav="comparador" />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-7 w-7 text-destructive" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-foreground">No pudimos cargar el comparador</h2>
          <p className="text-sm text-muted-foreground">Hubo un problema al obtener los productos</p>
        </div>
        <Button variant="outline" onClick={reset} className="mt-2">
          <RefreshCw className="h-3.5 w-3.5" />
          Reintentar
        </Button>
      </main>
    </div>
  )
}
