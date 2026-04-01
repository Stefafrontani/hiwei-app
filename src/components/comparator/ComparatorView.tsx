'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Maximize2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ComparatorPlayerCard } from './ComparatorPlayerCard'
import { ImmersiveToolbar } from './ImmersiveToolbar'
import { DualFullscreenView } from './DualFullscreenView'
import { SpecsTable } from './SpecsTable'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'
import { type CameraPosition, CAMERA_POSITION_LABELS } from '@/domain/value-objects/CameraPosition'

interface ComparatorViewProps {
  products: DashcamProduct[]
}

export function ComparatorView({ products }: ComparatorViewProps) {
  const [modelAId, setModelAId] = useState<string | null>(null)
  const [modelBId, setModelBId] = useState<string | null>(null)
  const [activeAngle, setActiveAngle] = useState<CameraPosition>('frontal')
  const [playbackKey, setPlaybackKey] = useState(0)
  const [isImmersive, setIsImmersive] = useState(false)
  const [showDualFullscreen, setShowDualFullscreen] = useState(false)

  const productA = products.find((p) => p.id === modelAId) ?? null
  const productB = products.find((p) => p.id === modelBId) ?? null

  const bothSelected = !!productA && !!productB

  useEffect(() => {
    if (bothSelected) setPlaybackKey((k) => k + 1)
  }, [bothSelected])

  const handleAngleChange = (angle: CameraPosition) => {
    setActiveAngle(angle)
    setPlaybackKey((k) => k + 1)
  }

  const availableAngles = useMemo(() => {
    const angles = new Set<CameraPosition>()
    if (productA) productA.cameraPositions.forEach((a) => angles.add(a))
    if (productB) productB.cameraPositions.forEach((a) => angles.add(a))
    if (angles.size === 0) {
      angles.add('frontal')
      angles.add('trasera')
      angles.add('interior')
    }
    return Array.from(angles)
  }, [productA, productB])

  // Immersive mode: history state for back button (with reentrancy guard)
  const immersiveExitingRef = useRef(false)

  const enterImmersive = useCallback(() => {
    setIsImmersive(true)
    window.history.pushState({ immersive: true }, '')
  }, [])

  const doExitImmersive = useCallback((fromPopstate: boolean) => {
    if (immersiveExitingRef.current) return
    immersiveExitingRef.current = true

    setIsImmersive(false)

    if (!fromPopstate && window.history.state?.immersive) {
      window.history.back()
    }

    immersiveExitingRef.current = false
  }, [])

  const exitImmersive = useCallback(() => doExitImmersive(false), [doExitImmersive])

  useEffect(() => {
    if (!isImmersive) return
    const handlePopState = () => {
      // Don't collapse immersive when dual fullscreen is consuming this popstate
      if (showDualFullscreen) return
      doExitImmersive(true)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isImmersive, showDualFullscreen, doExitImmersive])

  // Escape to exit immersive
  useEffect(() => {
    if (!isImmersive) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        exitImmersive()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isImmersive, exitImmersive])

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Model Selectors */}
        <section className="animate-fade-in-up grid grid-cols-1 gap-4 md:grid-cols-2" style={{ '--delay': '80ms' } as React.CSSProperties}>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[1.5px] text-muted-foreground/70">Modelo A</label>
            <Select value={modelAId ?? ''} onValueChange={(v) => setModelAId(v || null)}>
              <SelectTrigger className="w-full glass-card border-white/[0.06] h-11">
                <SelectValue placeholder="Seleccioná un modelo" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id} disabled={p.id === modelBId}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[1.5px] text-muted-foreground/70">Modelo B</label>
            <Select value={modelBId ?? ''} onValueChange={(v) => setModelBId(v || null)}>
              <SelectTrigger className="w-full glass-card border-white/[0.06] h-11">
                <SelectValue placeholder="Seleccioná un modelo" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id} disabled={p.id === modelAId}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Shared Camera Angle Tabs + Immersive Button */}
        <div className={`transition-all duration-300 ${bothSelected ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}`}>
          <div className="flex items-center gap-2">
            <Tabs value={activeAngle} onValueChange={(v) => handleAngleChange(v as CameraPosition)} className="flex-1">
              <TabsList className="w-full bg-white/[0.05] p-1 rounded-lg gap-1">
                {availableAngles.map((angle) => (
                  <TabsTrigger
                    key={angle}
                    value={angle}
                    className="flex-1 py-2 text-xs font-medium data-[state=active]:bg-brand data-[state=active]:text-brand-foreground data-[state=active]:font-bold data-[state=active]:shadow-none"
                  >
                    {CAMERA_POSITION_LABELS[angle]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Button
              variant="ghost"
              size="sm"
              onClick={enterImmersive}
              className="shrink-0 h-10 w-10 p-0 text-muted-foreground hover:text-foreground md:hidden"
              title="Ver en grande"
            >
              <Maximize2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Video Comparison — stacked (mobile) / full-bleed side by side (desktop) */}
        {bothSelected && (
          <section className="animate-fade-in-up flex flex-col gap-1 md:flex-row md:items-center md:relative md:-ml-[50vw] md:left-1/2 md:w-screen" style={{ '--delay': '160ms' } as React.CSSProperties}>
            <ComparatorPlayerCard product={productA} activeAngle={activeAngle} autoplay={true} playbackKey={playbackKey} variant="immersive" />
            <ComparatorPlayerCard product={productB} activeAngle={activeAngle} autoplay={true} playbackKey={playbackKey} variant="immersive" />
          </section>
        )}

        {/* Specs Comparison Table */}
        <div className="animate-fade-in-up" style={{ '--delay': '240ms' } as React.CSSProperties}>
          <SpecsTable productA={productA} productB={productB} />
        </div>
      </div>

      {/* Immersive Mode Overlay */}
      {isImmersive && bothSelected && (
        <div className="fixed inset-0 z-40 flex flex-col bg-black">
          <ImmersiveToolbar
            activeAngle={activeAngle}
            availableAngles={availableAngles}
            onAngleChange={handleAngleChange}
            onClose={exitImmersive}
            onDualFullscreen={() => setShowDualFullscreen(true)}
          />
          <div className="flex flex-1 flex-col md:flex-row items-stretch gap-1 px-1 pb-1">
            <ComparatorPlayerCard
              product={productA}
              activeAngle={activeAngle}
              autoplay={true}
              playbackKey={playbackKey}
              variant="immersive"
            />
            <ComparatorPlayerCard
              product={productB}
              activeAngle={activeAngle}
              autoplay={true}
              playbackKey={playbackKey}
              variant="immersive"
            />
          </div>
        </div>
      )}

      {/* Dual Fullscreen */}
      {showDualFullscreen && productA && productB && (
        <DualFullscreenView
          productA={productA}
          productB={productB}
          activeAngle={activeAngle}
          availableAngles={availableAngles}
          onAngleChange={handleAngleChange}
          onClose={() => setShowDualFullscreen(false)}
          playbackKey={playbackKey}
        />
      )}
    </>
  )
}
