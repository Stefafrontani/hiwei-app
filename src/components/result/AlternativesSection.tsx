import type { ScoredProduct } from '@/domain/dashcam/DashcamRecommendationService'

const ALT_BADGES = [
  { label: 'Económica', bg: 'bg-[#F0FDF4]', text: 'text-[#16A34A]' },
  { label: 'Popular',   bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]' },
  { label: 'Premium',   bg: 'bg-[#FEF9C3]', text: 'text-[#B45309]' },
]

interface AlternativesSectionProps {
  alternatives: ScoredProduct[]
}

export function AlternativesSection({ alternatives }: AlternativesSectionProps) {
  if (!alternatives.length) return null

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] font-semibold uppercase tracking-[1px] text-[#A1A1AA]">
        ALTERNATIVAS
      </p>
      <div className="flex flex-col gap-2 md:flex-row">
        {alternatives.slice(0, 3).map((alt, i) => {
          const badge = ALT_BADGES[i] ?? ALT_BADGES[0]
          return (
            <div
              key={alt.product.id}
              className="flex flex-1 items-center gap-2.5 rounded-xl border border-[#E4E4E7] bg-white p-3"
            >
              <span className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-semibold ${badge.bg} ${badge.text}`}>
                {badge.label}
              </span>
              <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                <span className="truncate text-[13px] font-semibold text-[#18181B]">
                  {alt.product.name}
                </span>
                <span className="text-[12px] text-[#71717A]">{alt.product.priceDisplay}</span>
              </div>
              <button className="shrink-0 rounded-lg bg-[#F4F4F5] px-3 py-2 text-[12px] font-semibold text-[#18181B] transition-colors hover:bg-[#E4E4E7]">
                Ver
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
