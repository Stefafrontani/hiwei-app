'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { shareUrl } from '@/lib/shareUrl'
import { ProductCard } from './ProductCard'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'
import type { CameraPosition } from '@/domain/value-objects/CameraPosition'

interface SharedProductViewProps {
  product: DashcamProduct
}

export function SharedProductView({ product }: SharedProductViewProps) {
  const searchParams = useSearchParams()
  const angleParam = searchParams.get('angle') as CameraPosition | null
  const initialAngle = angleParam && product.cameraPositions.includes(angleParam)
    ? angleParam
    : product.cameraPositions[0]

  const [activeAngle, setActiveAngle] = useState<CameraPosition>(initialAngle)

  const handleShare = () => {
    const url = `${window.location.origin}/galeria/${product.id}?angle=${activeAngle}`
    shareUrl(url, `${product.name} — Hiwei`)
  }

  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-6">
      <ProductCard
        product={product}
        activeAngle={activeAngle}
        onAngleChange={setActiveAngle}
        onShare={handleShare}
      />
      {product.ecommerceUrl && (
        <Button asChild variant="brand" size="lg" className="w-full">
          <a href={product.ecommerceUrl} target="_blank" rel="noopener noreferrer">
            Ver en tienda
          </a>
        </Button>
      )}
    </div>
  )
}
