import type { ScoredProduct } from '@/domain/dashcam/DashcamRecommendationService'

const ALT_BADGES = [
  { label: 'Económica', bg: 'bg-success/10', text: 'text-success' },
  { label: 'Popular',   bg: 'bg-brand/10',   text: 'text-brand' },
  { label: 'Premium',   bg: 'bg-warning/15', text: 'text-warning' },
]

interface AlternativesSectionProps {
  alternatives: ScoredProduct[]
}

export function AlternativesSection({ alternatives }: AlternativesSectionProps) {
  if (!alternatives.length) return null

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] font-semibold uppercase tracking-[1px] text-muted-foreground">
        ALTERNATIVAS
      </p>
      <div className="flex flex-col gap-2 md:flex-row">
        {alternatives.slice(0, 3).map((alt, i) => {
          const badge = ALT_BADGES[i] ?? ALT_BADGES[0]
          return (
            <div
              key={alt.product.id}
              className="flex flex-1 items-center gap-2.5 rounded-xl border border-border bg-card p-3"
            >
              <span className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-semibold ${badge.bg} ${badge.text}`}>
                {badge.label}
              </span>
              <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                <span className="truncate text-[13px] font-semibold text-foreground">
                  {alt.product.name}
                </span>
                <span className="text-[12px] text-muted-foreground">{alt.product.priceDisplay}</span>
              </div>
              <button className="shrink-0 rounded-lg bg-muted px-3 py-2 text-[12px] font-semibold text-foreground transition-colors hover:bg-muted">
                Ver
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
