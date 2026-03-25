'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useIsMobile } from '@/hooks/use-mobile'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'

const QUALITY_LABELS: Record<string, string> = {
  buena: 'Buena (Full HD)',
  'muy-buena': 'Muy buena (4K)',
  superior: 'Superior (4K+)',
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
      valueA: val(a, (p) => p.cameraPositions.join(', ')),
      valueB: val(b, (p) => p.cameraPositions.join(', ')),
    },
    {
      label: 'Memoria incluida',
      valueA: val(a, (p) => (p.includedMemoryCardSize ? `${p.includedMemoryCardSize} GB` : 'No incluida')),
      valueB: val(b, (p) => (p.includedMemoryCardSize ? `${p.includedMemoryCardSize} GB` : 'No incluida')),
    },
    {
      label: 'Ciclo de grabación',
      valueA: val(a, (p) => `${p.cycleSize} GB/h`),
      valueB: val(b, (p) => `${p.cycleSize} GB/h`),
    },
  ]
}

export function SpecsTable({ productA, productB }: SpecsTableProps) {
  const isMobile = useIsMobile()

  if (!productA && !productB) return null

  const rows = getRows(productA, productB)

  const wrap = 'whitespace-normal'
  const headSize = isMobile ? 'text-xs' : 'text-sm'
  const cellSize = isMobile ? 'text-xs' : 'text-sm'
  const labelSize = isMobile ? 'text-[10px]' : 'text-xs'

  return (
    <div>
      <h3 className="mb-4 flex items-center gap-3 text-lg font-bold">
        Especificaciones
      </h3>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/20 hover:bg-muted/20">
            <TableHead className={`w-1/3 ${wrap} text-[10px] font-bold uppercase tracking-wider text-muted-foreground`}>Modelo</TableHead>
            <TableHead className={`w-1/3 ${wrap} ${headSize} font-bold text-brand`}>{productA?.name ?? '—'}</TableHead>
            <TableHead className={`w-1/3 ${wrap} ${headSize} font-bold text-brand`}>{productB?.name ?? '—'}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.label}>
              <TableCell className={`w-1/3 ${wrap} ${labelSize} font-medium text-muted-foreground`}>{row.label}</TableCell>
              <TableCell className={`w-1/3 ${wrap} ${cellSize} font-semibold text-foreground`}>{row.valueA}</TableCell>
              <TableCell className={`w-1/3 ${wrap} ${cellSize} font-semibold text-foreground`}>{row.valueB}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
