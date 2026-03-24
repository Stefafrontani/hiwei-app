import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ComparePromoCard() {
  return (
    <Card className="border-0 bg-brand shadow-none">
      <CardContent className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Sparkles className="h-8 w-8 shrink-0 text-brand-foreground" />
          <div>
            <p className="text-lg font-black uppercase leading-tight text-brand-foreground">
              Compare Models
            </p>
            <p className="text-sm font-medium text-brand-foreground/80">
              Find the perfect lens for your driving habits.
            </p>
          </div>
        </div>
        <Button asChild variant="secondary" className="w-full md:w-auto">
          <Link href="/comparador">
            GO TO COMPARATOR
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
