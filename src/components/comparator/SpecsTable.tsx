'use client'

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useIsMobile } from '@/hooks/use-mobile'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'

const QUALITY_LABELS: Record<string, string> = {
  buena: 'Buena (Full HD)',
  'muy-buena': 'Muy buena (4K)',
  superior: 'Superior (4K+)',
}

const POSITION_LABELS: Record<string, string> = {
  frontal: 'Frontal',
  trasera: 'Trasera',
  interior: 'Interior',
}

function formatPositions(positions: string[]): string {
  return positions.map((p) => POSITION_LABELS[p] ?? p).join(' · ')
}

interface SpecsTableProps {
  productA: DashcamProduct | null
  productB: DashcamProduct | null
}

interface SpecRow {
  label: string
  valueA: string
  valueB: string
}

function getRows(a: DashcamProduct | null, b: DashcamProduct | null): SpecRow[] {
  const val = (p: DashcamProduct | null, fn: (p: DashcamProduct) => string) => (p ? fn(p) : '—')

  return [
    {
      label: 'Calidad máxima',
      valueA: val(a, (p) => QUALITY_LABELS[p.maxQuality] ?? p.maxQuality),
      valueB: val(b, (p) => QUALITY_LABELS[p.maxQuality] ?? p.maxQuality),
    },
    {
      label: 'Cámaras',
      valueA: val(a, (p) => formatPositions(p.cameraPositions)),
      valueB: val(b, (p) => formatPositions(p.cameraPositions)),
    },
    {
      label: 'Memoria incluida',
      valueA: val(a, (p) => (p.includedMemoryCardSize ? `${p.includedMemoryCardSize} GB` : 'No incluida')),
      valueB: val(b, (p) => (p.includedMemoryCardSize ? `${p.includedMemoryCardSize} GB` : 'No incluida')),
    },
  ]
}

export function SpecsTable({ productA, productB }: SpecsTableProps) {
  const isMobile = useIsMobile()

  if (!productA && !productB) return null

  const rows = getRows(productA, productB)

  const wrap = 'whitespace-normal'
  const pad = isMobile ? 'p-3' : 'p-3'
  const headSize = isMobile ? 'text-xs' : 'text-sm'
  const cellSize = isMobile ? 'text-xs' : 'text-sm'
  const labelSize = 'text-xs'

  return (
    <div className="glass-card rounded-2xl border-white/[0.06] overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <h3 className="text-base font-bold text-foreground">Especificaciones</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-white/[0.03] hover:bg-white/[0.03] border-white/[0.06]">
            <TableHead className={`w-1/3 ${wrap} ${pad} text-xs font-bold uppercase tracking-wider text-muted-foreground/60`}>Modelo</TableHead>
            <TableHead className={`w-1/3 ${wrap} ${pad} ${headSize} font-bold text-brand`}>{productA?.name ?? '—'}</TableHead>
            <TableHead className={`w-1/3 ${wrap} ${pad} ${headSize} font-bold text-brand`}>{productB?.name ?? '—'}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.label} className="border-white/[0.04] hover:bg-white/[0.02]">
              <TableCell className={`w-1/3 ${wrap} ${pad} ${labelSize} font-medium text-muted-foreground/60`}>{row.label}</TableCell>
              <TableCell className={`w-1/3 ${wrap} ${pad} ${cellSize} font-semibold text-foreground/80`}>{row.valueA}</TableCell>
              <TableCell className={`w-1/3 ${wrap} ${pad} ${cellSize} font-semibold text-foreground/80`}>{row.valueB}</TableCell>
            </TableRow>
          ))}
          <TableRow className="border-white/[0.04] hover:bg-white/[0.02]">
            <TableCell className={`w-1/3 ${wrap} ${pad} ${labelSize} font-medium text-muted-foreground/60`}>Tienda</TableCell>
            <TableCell className={`w-1/3 ${wrap} ${pad}`}>
              {productA?.ecommerceUrl ? (
                <Link
                  href={productA.ecommerceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 ${cellSize} font-semibold text-brand hover:underline`}
                >
                  Ver más info
                  <ExternalLink className="h-3 w-3" />
                </Link>
              ) : '—'}
            </TableCell>
            <TableCell className={`w-1/3 ${wrap} ${pad}`}>
              {productB?.ecommerceUrl ? (
                <Link
                  href={productB.ecommerceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 ${cellSize} font-semibold text-brand hover:underline`}
                >
                  Ver más info
                  <ExternalLink className="h-3 w-3" />
                </Link>
              ) : '—'}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
