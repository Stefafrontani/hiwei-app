import { ArrowRight, Columns3 } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ComparePromoCard() {
  return (
    <div className="shimmer-border">
      <Card className="border-0 bg-info rounded-[inherit] shadow-none">
        <CardContent className="flex flex-col gap-5 py-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-info-foreground/15">
              <Columns3 className="h-5 w-5 text-info-foreground" />
            </div>
            <div>
              <p className="text-lg font-bold leading-tight text-info-foreground">
                ¿No sabés cuál elegir?
              </p>
              <p className="mt-1 text-sm text-info-foreground/70">
                Compará dos modelos lado a lado y encontrá tu dashcam ideal.
              </p>
            </div>
          </div>
          <Button asChild className="w-full bg-info-foreground text-gray-900 hover:bg-info-foreground/90 md:w-auto">
            <Link href="/compara-las-dashcams">
              Comparar ahora
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
