import { Star, ShoppingCart } from 'lucide-react'
import type { DashcamProduct } from '@/domain/dashcam/DashcamProduct'

interface MainRecommendationCardProps {
  product: DashcamProduct
}

export function MainRecommendationCard({ product }: MainRecommendationCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-[#2563EB] p-4 md:gap-3.5 md:p-5">
      {/* Badge */}
      <div>
        <span className="rounded-md bg-[#1D4ED8] px-2 py-1 text-[10px] font-semibold tracking-[0.5px] text-[#BFDBFE]">
          RECOMENDACIÓN PRINCIPAL
        </span>
      </div>

      {/* Name */}
      <p className="text-[20px] font-bold text-white md:text-[24px]">{product.name}</p>

      {/* Stars */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-[#FCD34D] text-[#FCD34D] md:h-4 md:w-4" />
        ))}
        <span className="text-[12px] font-medium text-[#BFDBFE] md:text-[13px]">
          {product.rating} ({product.reviewCount} reseñas)
        </span>
      </div>

      {/* Description */}
      <p className="text-[12px] leading-relaxed text-[#BFDBFE] md:text-[13px]">
        {product.description}
      </p>

      {/* Spec tags */}
      <div className="flex flex-wrap gap-1.5">
        {product.specs.map((spec) => (
          <span
            key={spec}
            className="rounded-md bg-[#1D4ED8] px-2 py-1 text-[10px] font-semibold text-[#BFDBFE]"
          >
            {spec}
          </span>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-[#1D4ED8]" />

      {/* Price row */}
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-bold text-white md:text-[17px]">
          {product.priceDisplay}
        </span>
        <button className="flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2.5 text-[12px] font-bold text-[#2563EB] transition-opacity hover:opacity-90">
          <ShoppingCart className="h-3.5 w-3.5" />
          Ver precio
        </button>
      </div>
    </div>
  )
}
