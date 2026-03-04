import { ShoppingCart } from 'lucide-react'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'

interface MainRecommendationCardProps {
  product: DashcamProduct
  matchScore: number
}

export function MainRecommendationCard({ product, matchScore }: MainRecommendationCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-brand p-4 md:gap-3.5 md:p-5">
      {/* Badge + Score */}
      <div className="flex items-center justify-between">
        <span className="rounded-md bg-brand/90 px-2 py-1 text-[10px] font-semibold tracking-[0.5px] text-white/70">
          RECOMENDACIÓN PRINCIPAL
        </span>
        <span className="rounded-full bg-white/20 px-2.5 py-1 text-[12px] font-bold text-white">
          {matchScore}%
        </span>
      </div>

      {/* Name */}
      <p className="text-[20px] font-bold text-white md:text-[24px]">{product.name}</p>

      {/* Description */}
      <p className="text-[12px] leading-relaxed text-white/70 md:text-[13px]">
        {product.description}
      </p>

      {/* Spec tags */}
      <div className="flex flex-wrap gap-1.5">
        {product.specs.map((spec) => (
          <span
            key={spec}
            className="rounded-md bg-brand/90 px-2 py-1 text-[10px] font-semibold text-white/70"
          >
            {spec}
          </span>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-brand/90" />

      {/* Price row */}
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-bold text-white md:text-[17px]">
          {product.priceDisplay}
        </span>
        <button className="flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2.5 text-[12px] font-bold text-brand transition-opacity hover:opacity-90">
          <ShoppingCart className="h-3.5 w-3.5" />
          Ver precio
        </button>
      </div>
    </div>
  )
}
