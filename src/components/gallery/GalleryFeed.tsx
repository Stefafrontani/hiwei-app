'use client'

import { useState } from 'react'
import { ProductCard } from './ProductCard'
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

  const firstRow = products.slice(0, 2)
  const rest = products.slice(2)

  return (
    <div className="flex flex-col gap-6">
      {/* First row of products */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {firstRow.map((product, i) => (
          <div key={product.id} className="animate-fade-in-up" style={{ '--delay': `${i * 80}ms` } as React.CSSProperties}>
            <ProductCard
              product={product}
              activeAngle={activeAngles[product.id]}
              onAngleChange={(angle) => handleAngleChange(product.id, angle)}
            />
          </div>
        ))}
      </div>

      {/* Compare promo — full width */}
      <div className="animate-fade-in-up" style={{ '--delay': '160ms' } as React.CSSProperties}>
        <ComparePromoCard />
      </div>

      {/* Remaining products */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {rest.map((product, i) => (
            <div key={product.id} className="animate-fade-in-up" style={{ '--delay': `${200 + i * 80}ms` } as React.CSSProperties}>
              <ProductCard
                product={product}
                activeAngle={activeAngles[product.id]}
                onAngleChange={(angle) => handleAngleChange(product.id, angle)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
