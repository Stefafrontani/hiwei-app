import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
  if (!productA && !productB) return null

  const rows = getRows(productA, productB)

  return (
    <div>
      <h3 className="mb-3 text-base font-bold text-foreground">Especificaciones</h3>

      <div className="overflow-hidden rounded-xl border-white/[0.06]">
        <Table>
          <TableHeader>
            <TableRow className="bg-white/[0.03] hover:bg-white/[0.03]">
              <TableHead className="w-1/3 whitespace-normal p-3 text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Modelo</TableHead>
              <TableHead className="w-1/3 whitespace-normal p-3 text-xs font-bold text-brand md:text-sm">{productA?.name ?? '—'}</TableHead>
              <TableHead className="w-1/3 whitespace-normal p-3 text-xs font-bold text-brand md:text-sm">{productB?.name ?? '—'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.label} className="border-white/[0.04] hover:bg-white/[0.02]">
                <TableCell className="w-1/3 whitespace-normal p-3 text-xs font-medium text-muted-foreground/60">{row.label}</TableCell>
                <TableCell className="w-1/3 whitespace-normal p-3 text-xs font-semibold text-foreground/80 md:text-sm">{row.valueA}</TableCell>
                <TableCell className="w-1/3 whitespace-normal p-3 text-xs font-semibold text-foreground/80 md:text-sm">{row.valueB}</TableCell>
              </TableRow>
            ))}
            <TableRow className="border-white/[0.04] hover:bg-white/[0.02]">
              <TableCell className="w-1/3 whitespace-normal p-3 text-xs font-medium text-muted-foreground/60">Tienda</TableCell>
              <TableCell className="w-1/3 whitespace-normal p-3">
                {productA?.ecommerceUrl ? (
                  <Link
                    href={productA.ecommerceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline md:text-sm"
                  >
                    Ver más info
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                ) : '—'}
              </TableCell>
              <TableCell className="w-1/3 whitespace-normal p-3">
                {productB?.ecommerceUrl ? (
                  <Link
                    href={productB.ecommerceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline md:text-sm"
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
    </div>
  )
}
