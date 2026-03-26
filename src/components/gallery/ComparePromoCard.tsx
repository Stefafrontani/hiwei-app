import { ArrowRight, Columns3 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function ComparePromoCard() {
  return (
    <div className="shimmer-border">
      <div className="bg-background rounded-[inherit] p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10">
              <Columns3 className="h-5 w-5 text-brand" />
            </div>
            <div>
              <p className="text-[16px] font-bold text-foreground">
                ¿No sabés cuál elegir?
              </p>
              <p className="mt-0.5 text-[13px] text-muted-foreground">
                Compará dos modelos lado a lado y encontrá tu dashcam ideal.
              </p>
            </div>
          </div>
          <Button asChild variant="brand" size="xl" className="w-full md:w-auto">
            <Link href="/compara-las-dashcams">
              Comparar ahora
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
