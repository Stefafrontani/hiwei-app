'use client'

import { useState } from 'react'
import { X, MemoryStick } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import type { MemoryCard } from '@/domain/entities/MemoryCard'
import { calculateRecordingHours } from '@/domain/services/calculateRecordingHours'

interface MemoryCardPickerProps {
  open: boolean
  onClose: () => void
  memoryCards: MemoryCard[]
  selectedId: number
  recommendedSize: number
  cycleSize: number
  onSelect: (card: MemoryCard) => void
  includedSize?: number
}

function RadioCircle({ selected }: { selected: boolean }) {
  return (
    <div
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
        selected ? 'border-brand' : 'border-muted-foreground/40'
      }`}
    >
      {selected && <div className="h-2.5 w-2.5 rounded-full bg-brand" />}
    </div>
  )
}

function PickerContent({
  memoryCards,
  selectedId,
  recommendedSize,
  cycleSize,
  onSelect,
  onClose,
  includedSize,
}: Omit<MemoryCardPickerProps, 'open'>) {
  const [tempSelectedId, setTempSelectedId] = useState(selectedId)
  const isExpand = includedSize != null

  const handleConfirm = () => {
    const card = memoryCards.find((c) => c.id === tempSelectedId)
    if (card) onSelect(card)
    onClose()
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[13px] leading-relaxed text-muted-foreground">
        {isExpand
          ? `Tu dashcam incluye memoria de ${includedSize} GB. Podés agregar una tarjeta adicional de mayor capacidad.`
          : 'Elegí la capacidad de memoria que mejor se adapte a tu uso.'}
      </p>

      <div className="flex flex-col gap-2">
        {memoryCards.map((card) => {
          const isSelected = card.id === tempSelectedId
          const isRecommended = !isExpand && card.size === recommendedSize
          const isDisabled = isExpand && includedSize != null && card.size <= includedSize

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => !isDisabled && setTempSelectedId(card.id)}
              disabled={isDisabled}
              className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                isDisabled
                  ? 'cursor-not-allowed border-border bg-muted/30 opacity-40'
                  : isSelected
                    ? 'border-brand bg-brand/5'
                    : 'border-border bg-card hover:border-muted-foreground/30'
              }`}
            >
              <RadioCircle selected={isSelected && !isDisabled} />
              <div className="flex flex-1 flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-foreground">{card.size} GB</span>
                  {isRecommended && (
                    <Badge variant="brand" className="px-1.5 py-0 text-[10px]">
                      Recomendada
                    </Badge>
                  )}
                  {isDisabled && (
                    <span className="text-[10px] font-medium text-muted-foreground">
                      Incluida o menor
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {calculateRecordingHours(card.size, cycleSize)}+ hs de grabacion
                </span>
              </div>
              <span className="shrink-0 text-[13px] font-semibold text-foreground">
                {card.priceFinalDisplay}
              </span>
            </button>
          )
        })}
      </div>

      <Button
        onClick={handleConfirm}
        variant="brand"
        className="flex h-[50px] w-full items-center gap-2 rounded-xl text-[14px] font-semibold"
      >
        <MemoryStick className="h-4 w-4" />
        {isExpand ? 'Agregar expansión' : 'Confirmar seleccion'}
      </Button>
    </div>
  )
}

export function MemoryCardPicker({
  open,
  onClose,
  memoryCards,
  selectedId,
  recommendedSize,
  cycleSize,
  onSelect,
  includedSize,
}: MemoryCardPickerProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const title = includedSize != null ? 'Expandir capacidad' : 'Tarjeta de memoria'

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-[520px] rounded-2xl p-8">
          <DialogHeader>
            <DialogTitle className="text-[20px] font-bold text-foreground">{title}</DialogTitle>
          </DialogHeader>
          <PickerContent
            memoryCards={memoryCards}
            selectedId={selectedId}
            recommendedSize={recommendedSize}
            cycleSize={cycleSize}
            onSelect={onSelect}
            onClose={onClose}
            includedSize={includedSize}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="bottom" className="rounded-t-[20px] p-0">
        <div className="flex flex-col gap-4 px-5 pb-8 pt-5">
          <div className="flex justify-center">
            <div className="h-1 w-10 rounded-full bg-border" />
          </div>
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle className="text-[18px] font-bold text-foreground">{title}</SheetTitle>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </SheetHeader>
          <PickerContent
            memoryCards={memoryCards}
            selectedId={selectedId}
            recommendedSize={recommendedSize}
            cycleSize={cycleSize}
            onSelect={onSelect}
            onClose={onClose}
            includedSize={includedSize}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
