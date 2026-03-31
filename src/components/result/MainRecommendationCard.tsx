'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardAction, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'

interface MainRecommendationCardProps {
  product: DashcamProduct
  matchScore: number
  onSendRecommendation?: () => void
}

export function MainRecommendationCard({ product, matchScore, onSendRecommendation }: MainRecommendationCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="shimmer-border">
      <Card className="gap-3 overflow-hidden rounded-[inherit] border-0 bg-background py-4 shadow-none md:gap-3.5 md:py-5">

        {/* Name + Score row */}
        <CardHeader className="px-4 md:px-5">
          <CardTitle className="text-lg font-bold text-foreground md:text-xl">
            {product.name}
          </CardTitle>
          <CardAction>
            <Badge variant="brand" className="rounded-lg px-3 py-1.5 text-sm font-bold">
              {matchScore}%
            </Badge>
          </CardAction>
        </CardHeader>

        {/* Description + Spec chips */}
        <CardContent className="flex flex-col gap-3 px-4 md:px-5">
          {/* Description — expandable */}
          <div>
            <p className={`text-xs leading-relaxed text-muted-foreground md:text-sm ${expanded ? '' : 'line-clamp-2'}`}>
              {product.description}
            </p>
            <Button
              variant="link"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="mt-1 h-auto p-0 text-xs font-semibold text-brand"
            >
              {expanded ? 'Ver menos' : 'Ver más'}
            </Button>
          </div>

          {/* Spec chips — first 3 only */}
          <div className="flex flex-wrap gap-1.5">
            {product.specs.slice(0, 3).map((spec) => (
              <Badge
                key={spec}
                className="rounded-full border-0 bg-brand/15 px-3 py-1 text-xs font-semibold text-brand"
              >
                {spec}
              </Badge>
            ))}
          </div>
        </CardContent>

        {/* CTAs */}
        <CardFooter className="mt-1 gap-2 px-4 md:px-5">
          {onSendRecommendation && (
            <Button
              variant="outline"
              onClick={onSendRecommendation}
            >
              <Send className="h-4 w-4" />
              Enviar por mail
            </Button>
          )}
          <Button variant="brand" className="flex-1">
            <a
              href={product.ecommerceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver más información
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
