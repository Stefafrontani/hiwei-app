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
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E4E4E7] bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-semibold uppercase tracking-[1px] text-[#A1A1AA]">
            {product.brand}
          </p>
          <h2 className="text-[22px] font-bold text-[#18181B] md:text-[26px]">{product.name}</h2>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-1 rounded-full bg-[#EFF6FF] px-3 py-1">
            <Star className="h-3.5 w-3.5 fill-[#2563EB] text-[#2563EB]" />
            <span className="text-[13px] font-bold text-[#2563EB]">{matchScore}%</span>
          </div>
          <span className="text-[10px] text-[#A1A1AA]">compatibilidad</span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-[#71717A]" />
        <span className="text-[24px] font-bold text-[#18181B]">{formatPrice(product.price)}</span>
      </div>

      {/* Description */}
      <p className="text-[13px] leading-relaxed text-[#71717A]">{product.description}</p>

      {/* Why it matches */}
      {reasons.length > 0 && (
        <div className="flex flex-col gap-2 rounded-xl bg-[#F0FDF4] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[1px] text-[#16A34A]">
            Por qué te recomendamos esta
          </p>
          <ul className="flex flex-col gap-1.5">
            {reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#16A34A]" />
                <span className="text-[12px] text-[#166534]">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Features */}
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[1px] text-[#A1A1AA]">
          Características
        </p>
        <ul className="flex flex-col gap-1.5">
          {product.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563EB]" />
              <span className="text-[13px] text-[#71717A]">{f}</span>
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
            className="rounded-full bg-[#F4F4F5] text-[11px] text-[#71717A]"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}
