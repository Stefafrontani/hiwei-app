'use client'

import { useState } from 'react'
import { FeaturedCard } from './FeaturedCard'
import { CompactCard } from './CompactCard'
import { WideCard } from './WideCard'
import { ComparePromoCard } from './ComparePromoCard'
import type { GalleryItem } from '@/domain/entities/GalleryItem'
import type { CameraPosition } from '@/domain/value-objects/CameraPosition'

interface GalleryFeedProps {
  items: GalleryItem[]
}

export function GalleryFeed({ items }: GalleryFeedProps) {
  const [activeAngles, setActiveAngles] = useState<Record<string, CameraPosition>>(() => {
    const initial: Record<string, CameraPosition> = {}
    for (const item of items) {
      initial[item.id] = item.cameraPositions[0]
    }
    return initial
  })

  const handleAngleChange = (itemId: string, angle: CameraPosition) => {
    setActiveAngles((prev) => ({ ...prev, [itemId]: angle }))
  }

  const featured = items.find((i) => i.layout === 'featured')
  const compact = items.find((i) => i.layout === 'compact')
  const wide = items.find((i) => i.layout === 'wide')

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Featured — col-span-8 */}
      {featured && (
        <FeaturedCard
          item={featured}
          activeAngle={activeAngles[featured.id]}
          onAngleChange={(angle) => handleAngleChange(featured.id, angle)}
        />
      )}

      {/* Sidebar — col-span-4 */}
      <div className="flex flex-col gap-6 lg:col-span-4">
        {compact && (
          <CompactCard
            item={compact}
            activeAngle={activeAngles[compact.id]}
            onAngleChange={(angle) => handleAngleChange(compact.id, angle)}
          />
        )}
        <ComparePromoCard />
      </div>

      {/* Wide — col-span-12 */}
      {wide && <WideCard item={wide} />}
    </div>
  )
}
