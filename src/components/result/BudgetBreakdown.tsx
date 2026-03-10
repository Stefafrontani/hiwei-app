'use client'

import { useState } from 'react'
import { Receipt, HardDrive, MemoryStick, CreditCard, Banknote, Pencil, Plus } from 'lucide-react'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'
import type { MemoryCard } from '@/domain/entities/MemoryCard'
import type { QuizAnswers } from '@/domain/entities/QuizAnswers'
import { getRecommendedMemoryCardSize } from '@/domain/services/getRecommendedMemoryCardSize'
import { calculateRecordingHours } from '@/domain/services/calculateRecordingHours'
import { MemoryCardPicker } from './MemoryCardPicker'
import { HWK_PRICE, INSTALLATION_PRICE } from '@/lib/constants'

function parsePrice(display: string): number {
  const cleaned = display.replace(/[^0-9.,]/g, '').replace(/\./g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}

function formatARS(amount: number): string {
  return `$${amount.toLocaleString('es-AR')} ARS`
}

function MiniCheckbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={`flex h-4.5 w-4.5 shrink-0 cursor-pointer items-center justify-center rounded border-2 transition-colors ${checked ? 'border-brand bg-brand text-white' : 'border-muted-foreground/40 bg-transparent'}`}
    >
      {checked && (
        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

interface BudgetBreakdownProps {
  product: DashcamProduct
  answers: QuizAnswers
  memoryCards: MemoryCard[]
}

export function BudgetBreakdown({ product, answers, memoryCards }: BudgetBreakdownProps) {
  const dashcamPrice = parsePrice(product.priceFinalDisplay)
  const hasIncludedCard = product.includedMemoryCardSize != null
  const recommendedSize = getRecommendedMemoryCardSize(answers.vehicleUsage)
  const defaultCard = memoryCards.find((c) => c.size === recommendedSize) ?? memoryCards[0]

  // Scenario 1: selected card (replaceable)
  const [selectedCard, setSelectedCard] = useState<MemoryCard | null>(hasIncludedCard ? null : (defaultCard ?? null))
  // Scenario 2: expansion card (additional)
  const [expansionCard, setExpansionCard] = useState<MemoryCard | null>(null)
  const [includeExpansion, setIncludeExpansion] = useState(false)

  const [showCardPicker, setShowCardPicker] = useState(false)
  const [includeHWK, setIncludeHWK] = useState(answers.parkingMode === 'si')
  const [includeInstallation, setIncludeInstallation] = useState(answers.installation === 'si')

  const memoryCardPrice = hasIncludedCard ? 0 : (selectedCard ? parsePrice(selectedCard.priceFinalDisplay) : 0)
  const expansionPrice = hasIncludedCard && includeExpansion && expansionCard ? parsePrice(expansionCard.priceFinalDisplay) : 0

  const total =
    dashcamPrice +
    memoryCardPrice +
    expansionPrice +
    (includeHWK ? HWK_PRICE : 0) +
    (includeInstallation ? INSTALLATION_PRICE : 0)

  const handleExpansionSelect = (card: MemoryCard) => {
    setExpansionCard(card)
    setIncludeExpansion(true)
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm md:p-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10">
          <Receipt className="h-3.5 w-3.5 text-brand" />
        </div>
        <span className="text-[13px] font-bold text-foreground md:text-[14px]">Presupuesto</span>
      </div>

      <div className="h-px bg-border" />

      {/* === INCLUIDO section === */}
      <p className="text-[10px] font-semibold uppercase tracking-[1px] text-muted-foreground">
        Incluido
      </p>

      <div className="flex flex-col gap-3">
        {/* Dashcam */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-brand/10">
              <HardDrive className="h-3 w-3 text-brand" />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-foreground">
                {product.name.length > 20 ? `${product.name.slice(0, 20)}…` : product.name}
              </span>
              <span className="text-[11px] text-muted-foreground">Camara seleccionada</span>
            </div>
          </div>
          <span className="shrink-0 text-[13px] font-semibold text-foreground">{product.priceFinalDisplay}</span>
        </div>

        {/* Memory card — Scenario 1: separate card */}
        {!hasIncludedCard && (
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-brand/10">
                <MemoryStick className="h-3 w-3 text-brand" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-foreground">
                  {selectedCard ? `Tarjeta ${selectedCard.name}` : 'Tarjeta de memoria'}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-muted-foreground">
                    {selectedCard ? `${calculateRecordingHours(selectedCard.size, product.cycleSize)}+ hs de grabacion` : 'Sin tarjetas disponibles'}
                  </span>
                  {memoryCards.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowCardPicker(true)}
                      className="flex cursor-pointer items-center gap-0.5 text-[10px] font-medium text-brand/70 transition-colors hover:text-brand"
                    >
                      <Pencil className="h-2.5 w-2.5" />
                      editar
                    </button>
                  )}
                </div>
              </div>
            </div>
            <span className="shrink-0 text-[13px] font-semibold text-foreground">
              {selectedCard ? selectedCard.priceFinalDisplay : '—'}
            </span>
          </div>
        )}

        {/* Memory card — Scenario 2: included card */}
        {hasIncludedCard && (
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-success/10">
                <MemoryStick className="h-3 w-3 text-success" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-foreground">
                  Memoria incluida ({product.includedMemoryCardSize} GB)
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-muted-foreground">
                    {calculateRecordingHours(product.includedMemoryCardSize!, product.cycleSize)}+ hs de grabacion
                  </span>
                  {memoryCards.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowCardPicker(true)}
                      className="flex cursor-pointer items-center gap-0.5 text-[10px] font-medium text-brand/70 transition-colors hover:text-brand"
                    >
                      <Plus className="h-2.5 w-2.5" />
                      expandir
                    </button>
                  )}
                </div>
              </div>
            </div>
            <span className="shrink-0 text-[12px] font-semibold text-success">
              Incluida
            </span>
          </div>
        )}
      </div>

      {/* === EXTRAS section === */}
      <div className="h-px bg-border" />

      <div className="flex flex-col gap-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-[1px] text-muted-foreground">
          Extras opcionales
        </p>
        <p className="text-[10px] text-muted-foreground">
          Podes incluir o quitar extras de tu presupuesto
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {/* Expansion card (Scenario 2 only) */}
        {hasIncludedCard && expansionCard && (
          <div className={`flex items-start justify-between gap-3 transition-opacity ${includeExpansion ? '' : 'opacity-50'}`}>
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 shrink-0">
                <MiniCheckbox checked={includeExpansion} onChange={() => setIncludeExpansion((v) => !v)} />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-foreground">Expansión a {expansionCard.size} GB</span>
                <span className="text-[11px] text-muted-foreground">
                  Tarjeta adicional — {calculateRecordingHours(expansionCard.size, product.cycleSize)}+ hs extra
                </span>
              </div>
            </div>
            <span className={`shrink-0 text-[13px] font-semibold transition-colors ${includeExpansion ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
              {expansionCard.priceFinalDisplay}
            </span>
          </div>
        )}

        {/* HWK */}
        <div className={`flex items-start justify-between gap-3 transition-opacity ${includeHWK ? '' : 'opacity-50'}`}>
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 shrink-0">
              <MiniCheckbox checked={includeHWK} onChange={() => setIncludeHWK((v) => !v)} />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-foreground">Hardwire Kit (HWK)</span>
              <span className="text-[11px] text-muted-foreground">Modo estacionamiento — conexion a fusilera</span>
            </div>
          </div>
          <span className={`shrink-0 text-[13px] font-semibold transition-colors ${includeHWK ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
            {formatARS(HWK_PRICE)}
          </span>
        </div>

        {/* Installation */}
        <div className={`flex items-start justify-between gap-3 transition-opacity ${includeInstallation ? '' : 'opacity-50'}`}>
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 shrink-0">
              <MiniCheckbox checked={includeInstallation} onChange={() => setIncludeInstallation((v) => !v)} />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-foreground">Instalacion profesional</span>
              <span className="text-[11px] text-muted-foreground">Tecnico certificado — en taller</span>
            </div>
          </div>
          <span className={`shrink-0 text-[13px] font-semibold transition-colors ${includeInstallation ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
            {formatARS(INSTALLATION_PRICE)}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Total */}
      <div className="-mx-4 flex items-center justify-between bg-brand/5 px-4 py-2.5 md:-mx-5 md:px-5">
        <span className="text-[14px] font-bold text-foreground md:text-[15px]">Total</span>
        <span className="text-[16px] font-bold text-brand md:text-[18px]">{formatARS(total)}</span>
      </div>

      {/* Payment options */}
      <div className="flex flex-col gap-1.5 rounded-lg bg-muted/50 px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[11px] font-medium text-muted-foreground md:text-[12px]">
            <span className="font-bold text-foreground">6</span> cuotas <span className="font-bold text-foreground">sin interes</span> de <span className="font-bold text-foreground">{formatARS(Math.round(total / 6))}</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Banknote className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[11px] font-medium text-muted-foreground md:text-[12px]">
            <span className="font-bold text-foreground">10% off</span> en <span className="font-bold text-foreground">efectivo o transferencia</span>
          </span>
        </div>
      </div>

      {/* Memory Card Picker Modal */}
      {memoryCards.length > 0 && (
        <MemoryCardPicker
          open={showCardPicker}
          onClose={() => setShowCardPicker(false)}
          memoryCards={memoryCards}
          selectedId={hasIncludedCard ? (expansionCard?.id ?? -1) : (selectedCard?.id ?? -1)}
          recommendedSize={hasIncludedCard ? 0 : recommendedSize}
          cycleSize={product.cycleSize}
          onSelect={hasIncludedCard ? handleExpansionSelect : setSelectedCard}
          includedSize={product.includedMemoryCardSize ?? undefined}
        />
      )}
    </div>
  )
}
