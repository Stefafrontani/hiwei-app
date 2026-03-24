'use client'

import { useMemo, useState } from 'react'
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

  const productA = products.find((p) => p.id === modelAId) ?? null
  const productB = products.find((p) => p.id === modelBId) ?? null

  const bothSelected = !!productA && !!productB

  // Union of camera positions from both selected models
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
    <div className="space-y-8">
      {/* Model Selectors */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Modelo A</label>
          <Select value={modelAId ?? ''} onValueChange={(v) => setModelAId(v || null)}>
            <SelectTrigger className="w-full">
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
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Modelo B</label>
          <Select value={modelBId ?? ''} onValueChange={(v) => setModelBId(v || null)}>
            <SelectTrigger className="w-full">
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
      <Tabs value={activeAngle} onValueChange={(v) => setActiveAngle(v as CameraPosition)}>
        <TabsList className="w-full bg-background p-1 rounded-lg gap-1">
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

      {/* Video Comparison Cards */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ComparatorPlayerCard product={productA} activeAngle={activeAngle} autoplay={bothSelected} />
        <ComparatorPlayerCard product={productB} activeAngle={activeAngle} autoplay={bothSelected} />
      </section>

      {/* Specs Comparison Table */}
      <SpecsTable productA={productA} productB={productB} />
    </div>
  )
}
