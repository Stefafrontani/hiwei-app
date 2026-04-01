'use client'

import { useState } from 'react'
import { HardDrive, MemoryStick, CreditCard, Banknote, Pencil, Plus, Flame, Send } from 'lucide-react'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'
import type { MemoryCard } from '@/domain/entities/MemoryCard'
import type { QuizAnswers } from '@/domain/entities/QuizAnswers'
import { getRecommendedMemoryCardSize } from '@/domain/services/getRecommendedMemoryCardSize'
import { calculateRecordingHours } from '@/domain/services/calculateRecordingHours'
import { MemoryCardPicker } from './MemoryCardPicker'
import { HWK_PRICE, INSTALLATION_PRICE, CASH_DISCOUNT } from '@/lib/constants'

function formatARS(amount: number): string {
  return `$${amount.toLocaleString('es-AR')}`
}

function MiniCheckbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={`flex h-4.5 w-4.5 shrink-0 cursor-pointer items-center justify-center rounded border-2 transition-colors ${checked ? 'border-brand bg-brand text-brand-foreground' : 'border-muted-foreground/40 bg-transparent'}`}
    >
      {checked && (
        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

function PriceWithDiscount({ original, discounted, active = true }: { original: number; discounted: number; active?: boolean }) {
  const hasDiscount = discounted < original
  if (!hasDiscount) {
    return (
      <span className={`shrink-0 text-sm font-semibold transition-colors ${active ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
        {formatARS(original)}
      </span>
    )
  }
  return (
    <span className={`flex shrink-0 flex-col items-end transition-opacity ${active ? '' : 'opacity-50'}`}>
      <span className={`text-sm font-semibold ${active ? 'text-foreground' : 'text-muted-foreground line-through'}`}>{formatARS(discounted)}</span>
      <span className="text-xs text-muted-foreground line-through">{formatARS(original)}</span>
    </span>
  )
}

interface BudgetBreakdownProps {
  product: DashcamProduct
  answers: QuizAnswers
  memoryCards: MemoryCard[]
  onSendRecommendation?: () => void
}

export function BudgetBreakdown({ product, answers, memoryCards, onSendRecommendation }: BudgetBreakdownProps) {
  const dashcamPrice = Math.round(product.basePrice * (1 - product.discount))
  const hasIncludedCard = product.includedMemoryCardSize != null
  const recommendedSize = getRecommendedMemoryCardSize(answers.vehicleUsage)
  const defaultCard = memoryCards.find((c) => c.size === recommendedSize) ?? memoryCards[0]

  const discount = product.discount
  const applyDiscount = (price: number) => Math.round(price * (1 - discount))

  const [selectedCard, setSelectedCard] = useState<MemoryCard | null>(hasIncludedCard ? null : (defaultCard ?? null))
  const [expansionCard, setExpansionCard] = useState<MemoryCard | null>(null)
  const [includeExpansion, setIncludeExpansion] = useState(false)

  const [showCardPicker, setShowCardPicker] = useState(false)
  const [includeHWK, setIncludeHWK] = useState(answers.parkingMode === 'si')
  const [includeInstallation, setIncludeInstallation] = useState(answers.installation === 'si')

  const memoryCardRaw = hasIncludedCard ? 0 : (selectedCard?.basePrice ?? 0)
  const memoryCardPrice = applyDiscount(memoryCardRaw)
  const expansionRaw = hasIncludedCard && includeExpansion && expansionCard ? expansionCard.basePrice : 0
  const expansionPrice = applyDiscount(expansionRaw)

  const total =
    dashcamPrice +
    memoryCardPrice +
    expansionPrice +
    (includeHWK ? applyDiscount(HWK_PRICE) : 0) +
    (includeInstallation ? applyDiscount(INSTALLATION_PRICE) : 0)

  const handleExpansionSelect = (card: MemoryCard) => {
    setExpansionCard(card)
    setIncludeExpansion(true)
  }

  return (
    <Card className="gap-0 overflow-hidden border-border py-0 shadow-sm">

      {/* ── Hero price block ── */}
      <CardHeader className="flex-col items-stretch gap-3 bg-brand/5 px-4 py-4 md:px-5">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tu presupuesto</span>
            <span className="text-2xl font-bold tracking-tight text-brand md:text-3xl">{formatARS(total)}</span>
          </div>
          {product.discount > 0 && (
            <Badge variant="warning" className="gap-1">
              <Flame className="h-3 w-3" />
              {Math.round(product.discount * 100)}% OFF
            </Badge>
          )}
        </div>

        {/* Payment options — prominent */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <CreditCard className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              <span className="font-bold text-foreground">6</span> cuotas <span className="font-bold text-foreground">sin interés</span> de <span className="font-bold text-foreground">{formatARS(Math.round(total / 6))}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Banknote className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              <span className="font-bold text-foreground">{Math.round(CASH_DISCOUNT * 100)}% off</span> en <span className="font-bold text-foreground">efectivo o transferencia</span>
            </span>
          </div>
        </div>
      </CardHeader>

      {/* ── Breakdown details ── */}
      <CardContent className="flex flex-col gap-3 px-4 py-4 md:px-5">

        {/* Incluido */}
        <p className="text-xs font-semibold uppercase tracking-[1px] text-muted-foreground">
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
                <span className="text-sm font-semibold text-foreground">
                  {product.name.length > 20 ? `${product.name.slice(0, 20)}…` : product.name}
                </span>
                <span className="text-xs text-muted-foreground">Cámara seleccionada</span>
              </div>
            </div>
            <PriceWithDiscount original={product.basePrice} discounted={dashcamPrice} />
          </div>

          {/* Memory card — Scenario 1: separate card */}
          {!hasIncludedCard && (
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-brand/10">
                  <MemoryStick className="h-3 w-3 text-brand" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    {selectedCard ? `Tarjeta ${selectedCard.name}` : 'Tarjeta de memoria'}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">
                      {selectedCard ? `${calculateRecordingHours(selectedCard.size, product.cycleSize)}+ hs de grabación` : 'Sin tarjetas disponibles'}
                    </span>
                    {memoryCards.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowCardPicker(true)}
                        className="flex cursor-pointer items-center gap-0.5 text-xs font-medium text-brand/70 transition-colors hover:text-brand"
                      >
                        <Pencil className="h-2.5 w-2.5" />
                        editar
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {selectedCard ? (
                <PriceWithDiscount original={memoryCardRaw} discounted={memoryCardPrice} />
              ) : (
                <span className="shrink-0 text-sm font-semibold text-foreground">—</span>
              )}
            </div>
          )}

          {/* Memory card — Scenario 2: included card */}
          {hasIncludedCard && (
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-info/20">
                  <MemoryStick className="h-3 w-3 text-info" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    Memoria incluida ({product.includedMemoryCardSize} GB)
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">
                      {calculateRecordingHours(product.includedMemoryCardSize!, product.cycleSize)}+ hs de grabación
                    </span>
                    {memoryCards.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowCardPicker(true)}
                        className="flex cursor-pointer items-center gap-0.5 text-xs font-medium text-brand/70 transition-colors hover:text-brand"
                      >
                        <Plus className="h-2.5 w-2.5" />
                        expandir
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <Badge variant="info" className="text-xs">
                Incluida
              </Badge>
            </div>
          )}
        </div>

        {/* Extras */}
        <Separator />

        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-semibold uppercase tracking-[1px] text-muted-foreground">
            Extras opcionales
          </p>
          <p className="text-xs text-muted-foreground">
            Podés incluir o quitar extras de tu presupuesto
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
                  <span className="text-sm font-semibold text-foreground">Expansión a {expansionCard.size} GB</span>
                  <span className="text-xs text-muted-foreground">
                    Tarjeta adicional — {calculateRecordingHours(expansionCard.size, product.cycleSize)}+ hs extra
                  </span>
                </div>
              </div>
              <PriceWithDiscount original={expansionRaw} discounted={expansionPrice} active={includeExpansion} />
            </div>
          )}

          {/* HWK */}
          <div className={`flex items-start justify-between gap-3 transition-opacity ${includeHWK ? '' : 'opacity-50'}`}>
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 shrink-0">
                <MiniCheckbox checked={includeHWK} onChange={() => setIncludeHWK((v) => !v)} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Hardwire Kit (HWK)</span>
                <span className="text-xs text-muted-foreground">Modo estacionamiento — conexión a fusilera</span>
              </div>
            </div>
            <PriceWithDiscount original={HWK_PRICE} discounted={applyDiscount(HWK_PRICE)} active={includeHWK} />
          </div>

          {/* Installation */}
          <div className={`flex items-start justify-between gap-3 transition-opacity ${includeInstallation ? '' : 'opacity-50'}`}>
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 shrink-0">
                <MiniCheckbox checked={includeInstallation} onChange={() => setIncludeInstallation((v) => !v)} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Instalación profesional</span>
                <span className="text-xs text-muted-foreground">Técnico certificado — en taller</span>
              </div>
            </div>
            <PriceWithDiscount original={INSTALLATION_PRICE} discounted={applyDiscount(INSTALLATION_PRICE)} active={includeInstallation} />
          </div>
        </div>
      </CardContent>

      {/* Send quote */}
      {onSendRecommendation && (
        <CardFooter className="px-4 pb-4 pt-0 md:justify-end md:px-5">
          <Button
            variant="outline"
            onClick={onSendRecommendation}
            className="w-full md:w-auto md:px-12"
          >
            <Send className="h-4 w-4" />
            Enviar presupuesto por mail
          </Button>
        </CardFooter>
      )}

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
    </Card>
  )
}
