'use client'

import { Card, CardHeader, CardTitle, CardAction, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'

interface MainRecommendationCardProps {
  product: DashcamProduct
  matchScore: number
}

export function MainRecommendationCard({ product, matchScore }: MainRecommendationCardProps) {
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

        {/* Spec chips */}
        <CardContent className="px-4 md:px-5">
          <div className="flex flex-wrap gap-1.5">
            {product.specs.slice(0, 3).map((spec) => (
              <Badge key={spec} variant="secondary" className="text-xs">
                {spec}
              </Badge>
            ))}
          </div>
        </CardContent>

        {/* CTA */}
        <CardFooter className="mt-1 px-4 md:justify-end md:px-5">
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
