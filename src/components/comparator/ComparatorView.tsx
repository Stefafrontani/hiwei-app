'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ComparatorPlayerCard } from './ComparatorPlayerCard'
import { SpecsTable } from './SpecsTable'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'
import type { CameraPosition } from '@/domain/value-objects/CameraPosition'

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

      {/* Video Comparison Cards */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ComparatorPlayerCard
          product={productA}
          activeAngle={activeAngle}
          onAngleChange={setActiveAngle}
          autoplay={bothSelected}
        />
        <ComparatorPlayerCard
          product={productB}
          activeAngle={activeAngle}
          onAngleChange={setActiveAngle}
          autoplay={bothSelected}
        />
      </section>

      {/* Specs Comparison Table */}
      <SpecsTable productA={productA} productB={productB} />
    </div>
  )
}
