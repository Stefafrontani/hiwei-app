import { Flame, Send } from 'lucide-react'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'

interface MainRecommendationCardProps {
  product: DashcamProduct
  matchScore: number
  onSendRecommendation?: () => void
}

export function MainRecommendationCard({ product, matchScore, onSendRecommendation }: MainRecommendationCardProps) {
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

      {/* CTAs */}
      <div className="mt-1 flex gap-2">
        {onSendRecommendation && (
          <button
            type="button"
            onClick={onSendRecommendation}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-brand bg-card px-4 py-2.5 text-[14px] font-semibold text-brand transition-colors hover:bg-brand/10 md:text-[15px]"
          >
            <Send className="h-4 w-4" />
            Enviar x mail
          </button>
        )}
        <a
          href={product.ecommerceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-brand/90 md:text-[15px]"
        >
          Comprar
        </a>
      </div>
    </div>
  )
}
