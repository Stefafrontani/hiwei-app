'use client'

import { useState } from 'react'
import { FeaturedCard } from './FeaturedCard'
import { CompactCard } from './CompactCard'
import { WideCard } from './WideCard'
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
  const compactItems = products.slice(1, -1)
  const wide = products[products.length - 1]

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Featured — col-span-8 */}
      {featured && (
        <FeaturedCard
          product={featured}
          activeAngle={activeAngles[featured.id]}
          onAngleChange={(angle) => handleAngleChange(featured.id, angle)}
        />
      )}

      {/* Sidebar — col-span-4 */}
      <div className="flex flex-col gap-6 lg:col-span-4">
        {compactItems.map((product) => (
          <CompactCard
            key={product.id}
            product={product}
            activeAngle={activeAngles[product.id]}
            onAngleChange={(angle) => handleAngleChange(product.id, angle)}
          />
        ))}
        <ComparePromoCard />
      </div>

      {/* Wide — col-span-12 */}
      {wide && wide !== featured && <WideCard product={wide} />}
    </div>
  )
}
