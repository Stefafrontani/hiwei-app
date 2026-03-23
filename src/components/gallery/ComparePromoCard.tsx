import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ComparePromoCard() {
  return (
    <Card className="border-0 bg-brand shadow-none aspect-square">
      <CardHeader className="flex-1">
        <Sparkles className="h-10 w-10 text-brand-foreground" />
        <CardTitle className="text-xl font-black uppercase leading-tight text-brand-foreground">
          Compare<br />Models
        </CardTitle>
        <CardDescription className="font-medium text-brand-foreground/80">
          Find the perfect lens for your driving habits.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild variant="secondary" className="w-full">
          <Link href="/comparador">
            GO TO COMPARATOR
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
