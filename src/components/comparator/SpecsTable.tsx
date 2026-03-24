import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'

const QUALITY_LABELS: Record<string, string> = {
  buena: 'Buena (Full HD)',
  'muy-buena': 'Muy buena (4K)',
  superior: 'Superior (4K+)',
}

function formatPrice(basePrice: number, discount: number): string {
  const final = Math.round(basePrice * (1 - discount))
  return `$${final.toLocaleString('es-AR')}`
}

interface SpecsTableProps {
  productA: DashcamProduct | null
  productB: DashcamProduct | null
}

interface SpecRow {
  label: string
  valueA: string
  valueB: string
  highlight?: boolean
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
    {
      label: 'Precio',
      valueA: val(a, (p) => formatPrice(p.basePrice, p.discount)),
      valueB: val(b, (p) => formatPrice(p.basePrice, p.discount)),
      highlight: true,
    },
  ]
}

export function SpecsTable({ productA, productB }: SpecsTableProps) {
  if (!productA && !productB) return null

  const rows = getRows(productA, productB)

  return (
    <Card className="overflow-hidden border-border/50">
      <CardHeader className="border-b border-border bg-card/30 px-6 py-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <BarChart3 className="h-5 w-5 text-brand" />
          Especificaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/20">
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Característica</th>
                <th className="p-4 text-sm font-bold text-brand">{productA?.name ?? '—'}</th>
                <th className="p-4 text-sm font-bold text-brand">{productB?.name ?? '—'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {rows.map((row) => (
                <tr
                  key={row.label}
                  className={`transition-colors hover:bg-muted/10 ${row.highlight ? 'bg-brand/5' : ''}`}
                >
                  <td className="p-4 text-sm font-medium text-muted-foreground">{row.label}</td>
                  <td className={`p-4 text-sm font-semibold ${row.highlight ? 'text-lg text-brand' : 'text-foreground'}`}>
                    {row.valueA}
                  </td>
                  <td className={`p-4 text-sm font-semibold ${row.highlight ? 'text-lg text-brand' : 'text-foreground'}`}>
                    {row.valueB}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
