import { Flame } from 'lucide-react'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'

interface MainRecommendationCardProps {
  product: DashcamProduct
  matchScore: number
}

export function MainRecommendationCard({ product, matchScore }: MainRecommendationCardProps) {
  return (
    <div className="relative flex flex-col gap-3 overflow-hidden rounded-xl border-2 border-brand bg-brand/5 p-4 shadow-md shadow-brand/10 md:gap-3.5 md:p-5">
      {/* Accent bar */}
      <div className="absolute inset-x-0 top-0 h-1 bg-brand" />

      {/* Name + Score row */}
      <div className="flex items-start justify-between gap-3 pt-1">
        <p className="text-[18px] font-bold text-foreground md:text-[22px]">{product.name}</p>
        <span className="shrink-0 rounded-lg bg-brand px-3 py-1.5 text-[13px] font-bold text-white md:text-[14px]">
          {matchScore}%
        </span>
      </div>

      {/* Discount badge */}
      {product.discount && (
        <div>
          <span className="inline-flex items-center gap-1 rounded-md bg-warning/20 px-2.5 py-1 text-[11px] font-bold text-warning">
            <Flame className="h-3.5 w-3.5" />
            {product.discount}
          </span>
        </div>
      )}

      {/* Description — truncated to 2 lines */}
      <p className="line-clamp-2 text-[12px] leading-relaxed text-muted-foreground md:text-[13px]">
        {product.description}
      </p>

      {/* Spec chips — first 3 only */}
      <div className="flex flex-wrap gap-1.5">
        {product.specs.slice(0, 3).map((spec) => (
          <span
            key={spec}
            className="rounded-full bg-brand/15 px-3 py-1 text-[11px] font-semibold text-brand"
          >
            {spec}
          </span>
        ))}
      </div>
    </div>
  )
}
