import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function ComparePromoCard() {
  return (
    <div className="flex flex-col justify-between rounded-xl bg-brand p-6 aspect-square">
      <div className="space-y-2">
        <Sparkles className="h-10 w-10 text-brand-foreground" />
        <h4 className="text-xl font-black uppercase leading-tight text-brand-foreground">
          Compare<br />Models
        </h4>
        <p className="text-sm font-medium text-brand-foreground/80">
          Find the perfect lens for your driving habits.
        </p>
      </div>
      <Link
        href="/comparador"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-background py-3 text-xs font-bold text-brand transition-transform active:scale-95"
      >
        GO TO COMPARATOR
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}
