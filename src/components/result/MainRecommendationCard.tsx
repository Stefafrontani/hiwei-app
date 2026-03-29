'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'

interface MainRecommendationCardProps {
  product: DashcamProduct
  matchScore: number
  onSendRecommendation?: () => void
}

export function MainRecommendationCard({ product, matchScore, onSendRecommendation }: MainRecommendationCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="relative flex flex-col gap-3 overflow-hidden rounded-xl border-2 border-brand bg-brand/5 p-4 shadow-md shadow-brand/10 md:gap-3.5 md:p-5">

      {/* Name + Score row */}
      <div className="flex items-start justify-between gap-3 pt-1">
        <p className="text-lg font-bold text-foreground md:text-xl">{product.name}</p>
        <span className="shrink-0 rounded-lg bg-brand px-3 py-1.5 text-sm font-bold text-brand-foreground">
          {matchScore}%
        </span>
      </div>

      {/* Description — expandable */}
      <div>
        <p className={`text-xs leading-relaxed text-muted-foreground md:text-sm ${expanded ? '' : 'line-clamp-2'}`}>
          {product.description}
        </p>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-xs font-semibold text-brand hover:underline"
        >
          {expanded ? 'Ver menos' : 'Ver más'}
        </button>
      </div>

      {/* Spec chips — first 3 only */}
      <div className="flex flex-wrap gap-1.5">
        {product.specs.slice(0, 3).map((spec) => (
          <span
            key={spec}
            className="rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold text-brand"
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
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-brand bg-card px-4 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand/10 md:text-base"
          >
            <Send className="h-4 w-4" />
            Enviar por mail
          </button>
        )}
        <a
          href={product.ecommerceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90 md:text-base"
        >
          Comprar
        </a>
      </div>
    </div>
  )
}
