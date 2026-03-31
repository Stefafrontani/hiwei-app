'use client'

import { useState, useEffect, useRef } from 'react'
import { Send } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardAction, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'

interface MainRecommendationCardProps {
  product: DashcamProduct
  matchScore: number
  onSendRecommendation?: () => void
}

export function MainRecommendationCard({ product, matchScore, onSendRecommendation }: MainRecommendationCardProps) {
  const [descOpen, setDescOpen] = useState(false)
  const [descOverflows, setDescOverflows] = useState(false)
  const descWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = descWrapRef.current
    if (!el) return
    setDescOverflows(el.scrollHeight > el.clientHeight + 1)
  }, [product.description])

  return (
    <div className="shimmer-border">
      <Card className="gap-3 overflow-hidden rounded-[inherit] border-0 bg-background py-4 shadow-none md:gap-3.5 md:py-5">

        {/* Name + Score row */}
        <CardHeader className="px-4 md:px-5">
          <CardTitle className="text-lg font-bold text-foreground md:text-xl">
            {product.name}
          </CardTitle>
          <CardAction>
            <Badge variant="brand">
              {matchScore}%
            </Badge>
          </CardAction>
        </CardHeader>

        {/* Spec chips + Description */}
        <CardContent className="flex flex-col gap-3 px-4 md:px-5">
          {/* Spec chips — first 3 only */}
          <div className="flex flex-wrap gap-1.5">
            {product.specs.slice(0, 3).map((spec) => (
              <Badge key={spec} variant="secondary" className="text-xs">
                {spec}
              </Badge>
            ))}
          </div>

          {/* Description — expandable with animated height (same pattern as gallery ProductCard) */}
          <Collapsible open={descOpen} onOpenChange={setDescOpen}>
            <div
              ref={descWrapRef}
              className="overflow-hidden transition-[max-height] duration-300 ease-out"
              style={{ maxHeight: descOpen ? `${descWrapRef.current?.scrollHeight ?? 200}px` : '3.4rem' }}
            >
              <p className="text-xs leading-relaxed text-muted-foreground md:text-sm">
                {product.description}
              </p>
            </div>
            {descOverflows && (
              <CollapsibleTrigger asChild>
                <Button variant="link" className="mt-1 h-auto p-0 text-xs font-semibold text-brand">
                  {descOpen ? 'Ver menos' : 'Ver más'}
                </Button>
              </CollapsibleTrigger>
            )}
          </Collapsible>
        </CardContent>

        {/* CTAs — primary (brand) first, secondary (outline) below on mobile */}
        <CardFooter className="mt-1 flex-col-reverse gap-2 px-4 md:flex-row md:justify-end md:px-5">
          {onSendRecommendation && (
            <Button
              variant="outline"
              onClick={onSendRecommendation}
              className="w-full md:w-auto"
            >
              <Send className="h-4 w-4" />
              Enviar por mail
            </Button>
          )}
          <Button variant="brand" asChild className="w-full md:w-auto md:px-12">
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
