'use client'

import { useEffect, useMemo, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ComparatorPlayerCard } from './ComparatorPlayerCard'
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
  const [fullscreenSide, setFullscreenSide] = useState<'A' | 'B' | null>(null)

  const productA = products.find((p) => p.id === modelAId) ?? null
  const productB = products.find((p) => p.id === modelBId) ?? null

  const bothSelected = !!productA && !!productB

  // Restart both videos whenever either model changes (so they play in sync)
  useEffect(() => {
    if (bothSelected) setPlaybackKey((k) => k + 1)
  }, [modelAId, modelBId, bothSelected])

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

  return (
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

      {/* Shared Camera Angle Tabs */}
      <div className={`transition-all duration-300 ${bothSelected ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}`}>
        <Tabs value={activeAngle} onValueChange={(v) => handleAngleChange(v as CameraPosition)}>
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
      </div>

      {/* Video Comparison — stacked (mobile) / full-bleed side by side (desktop) */}
      {bothSelected && (
        <section className="animate-fade-in-up flex flex-col gap-1 md:flex-row md:items-center relative -ml-[50vw] left-1/2 w-screen" style={{ '--delay': '160ms' } as React.CSSProperties}>
          <ComparatorPlayerCard product={productA} activeAngle={activeAngle} autoplay={true} playbackKey={playbackKey} variant="immersive" onFullscreenChange={(fs) => setFullscreenSide(fs ? 'A' : null)} siblingFullscreen={fullscreenSide === 'B'} />
          <ComparatorPlayerCard product={productB} activeAngle={activeAngle} autoplay={true} playbackKey={playbackKey} variant="immersive" onFullscreenChange={(fs) => setFullscreenSide(fs ? 'B' : null)} siblingFullscreen={fullscreenSide === 'A'} />
        </section>
      )}

      {/* Specs Comparison Table — only when both models selected */}
      {bothSelected && (
        <div className="animate-fade-in-up" style={{ '--delay': '240ms' } as React.CSSProperties}>
          <SpecsTable productA={productA} productB={productB} />
        </div>
      )}
    </div>
  )
}
