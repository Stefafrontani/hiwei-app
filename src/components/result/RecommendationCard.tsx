import { Check, Star, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { DashcamProduct } from '@/domain/dashcam/DashcamProduct'

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price)
}

interface RecommendationCardProps {
  product: DashcamProduct
  matchScore: number
  reasons: string[]
}

export function RecommendationCard({ product, matchScore, reasons }: RecommendationCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-semibold uppercase tracking-[1px] text-muted-foreground">
            {product.brand}
          </p>
          <h2 className="text-[22px] font-bold text-foreground md:text-[26px]">{product.name}</h2>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-1 rounded-full bg-brand/10 px-3 py-1">
            <Star className="h-3.5 w-3.5 fill-brand text-brand" />
            <span className="text-[13px] font-bold text-brand">{matchScore}%</span>
          </div>
          <span className="text-[10px] text-muted-foreground">compatibilidad</span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-muted-foreground" />
        <span className="text-[24px] font-bold text-foreground">{formatPrice(product.price)}</span>
      </div>

      {/* Description */}
      <p className="text-[13px] leading-relaxed text-muted-foreground">{product.description}</p>

      {/* Why it matches */}
      {reasons.length > 0 && (
        <div className="flex flex-col gap-2 rounded-xl bg-success/10 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[1px] text-success">
            Por qué te recomendamos esta
          </p>
          <ul className="flex flex-col gap-1.5">
            {reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                <span className="text-[12px] text-success">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Features */}
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[1px] text-muted-foreground">
          Características
        </p>
        <ul className="flex flex-col gap-1.5">
          {product.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              <span className="text-[13px] text-muted-foreground">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {product.tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="rounded-full bg-muted text-[11px] text-muted-foreground"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}
