'use client'

import Link from 'next/link'
import { ExternalLink, Play } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardAction, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { VideoThumbnail } from '@/components/gallery/VideoThumbnail'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'

interface MainRecommendationCardProps {
  product: DashcamProduct
  matchScore: number
}

export function MainRecommendationCard({ product, matchScore }: MainRecommendationCardProps) {
  const hasVideos = product.videos.length > 0
  const previewVideo = hasVideos
    ? (product.videos.find((v) => v.cameraPosition === 'frontal') ?? product.videos[0])
    : null

  return (
    <div className="shimmer-border">
      <Card className={`gap-3 overflow-hidden rounded-[inherit] border-0 bg-background shadow-none md:gap-3.5 ${hasVideos ? 'py-0' : 'py-4 md:py-5'}`}>

        {/* Video Preview */}
        {previewVideo && (
          <div className="overflow-hidden rounded-t-[inherit]">
            <VideoThumbnail
              video={previewVideo}
              maxQuality={product.maxQuality}
              size="lg"
              autoplay={false}
              showFullscreen={false}
            />
          </div>
        )}

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

        {/* CTAs */}
        {hasVideos ? (
          <CardFooter className="mt-1 flex-col gap-2 px-4 pb-4 md:flex-row md:justify-end md:px-5 md:pb-5">
            <Button variant="outline" asChild className="w-full md:w-auto md:px-8">
              <Link href={`/galeria/${product.id}`}>
                Ver más videos
              </Link>
            </Button>
            <Button variant="brand" asChild className="w-full md:w-auto md:px-8">
              <a href={product.ecommerceUrl} target="_blank" rel="noopener noreferrer">
                Ver en tienda
              </a>
            </Button>
          </CardFooter>
        ) : (
          <CardFooter className="mt-1 px-4 md:justify-end md:px-5">
            <Button variant="brand" asChild className="w-full md:w-auto md:px-12">
              <a href={product.ecommerceUrl} target="_blank" rel="noopener noreferrer">
                Ver más información
              </a>
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
