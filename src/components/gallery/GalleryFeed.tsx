'use client'

import { useState } from 'react'
import { FeaturedCard } from './FeaturedCard'
import { CompactCard } from './CompactCard'
import { ComparePromoCard } from './ComparePromoCard'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'
import type { CameraPosition } from '@/domain/value-objects/CameraPosition'

interface GalleryFeedProps {
  products: DashcamProduct[]
}

export function GalleryFeed({ products }: GalleryFeedProps) {
  const [activeAngles, setActiveAngles] = useState<Record<string, CameraPosition>>(() => {
    const initial: Record<string, CameraPosition> = {}
    for (const product of products) {
      initial[product.id] = product.cameraPositions[0]
    }
    return initial
  })

  const handleAngleChange = (productId: string, angle: CameraPosition) => {
    setActiveAngles((prev) => ({ ...prev, [productId]: angle }))
  }

  const featured = products[0]
  const rest = products.slice(1)

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* Featured + Compare promo — col-span-2, row-span-2 */}
      {featured && (
        <div className="flex flex-col gap-6 md:col-span-2 md:row-span-2">
          <FeaturedCard
            product={featured}
            activeAngle={activeAngles[featured.id]}
            onAngleChange={(angle) => handleAngleChange(featured.id, angle)}
          />
          <ComparePromoCard />
        </div>
      )}

      {/* Compact cards — col-span-1 each */}
      {rest.map((product) => (
        <CompactCard
          key={product.id}
          product={product}
          activeAngle={activeAngles[product.id]}
          onAngleChange={(angle) => handleAngleChange(product.id, angle)}
        />
      ))}
    </div>
  )
}
