'use client'

import { useState } from 'react'
import { MemoryStick } from 'lucide-react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { SelectionRow } from '@/components/ui/selection-row'
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
      <div className="flex flex-col gap-2">
        {memoryCards.map((card) => {
          const isSelected = card.id === tempSelectedId
          const isRecommended = !isExpand && card.size === recommendedSize
          const isDisabled = isExpand && includedSize != null && card.size <= includedSize

          return (
            <SelectionRow
              key={card.id}
              isActive={isSelected && !isDisabled}
              onClick={() => !isDisabled && setTempSelectedId(card.id)}
              disabled={isDisabled}
            >
              <div className="flex flex-1 flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold transition-colors duration-200 ${isSelected && !isDisabled ? 'text-brand' : 'text-foreground'}`}>
                    {card.size} GB
                  </span>
                  {isRecommended && (
                    <Badge variant="brand" className="px-1.5 py-0 text-xs">
                      Recomendada
                    </Badge>
                  )}
                  {isDisabled && (
                    <span className="text-xs font-medium text-muted-foreground">
                      Incluida o menor
                    </span>
                  )}
                </div>
                <span className={`text-xs transition-colors duration-200 ${isSelected && !isDisabled ? 'text-brand/70' : 'text-muted-foreground'}`}>
                  {calculateRecordingHours(card.size, cycleSize)}+ hs de grabación
                </span>
              </div>
              <span className={`shrink-0 text-sm font-semibold transition-colors duration-200 ${isSelected && !isDisabled ? 'text-brand' : 'text-foreground'}`}>
                {`$${card.basePrice.toLocaleString('es-AR')} ARS`}
              </span>
            </SelectionRow>
          )
        })}
      </div>

      <Button onClick={handleConfirm} variant="brand" size="xl" className="w-full">
        <MemoryStick className="h-4 w-4" />
        {isExpand ? 'Agregar expansión' : 'Confirmar selección'}
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

  const isExpand = includedSize != null
  const title = isExpand ? 'Expandir capacidad' : 'Tarjeta de memoria'
  const description = isExpand
    ? `Tu dashcam incluye memoria de ${includedSize} GB. Podés agregar una tarjeta adicional de mayor capacidad.`
    : 'Elegí la capacidad de memoria que mejor se adapte a tu uso.'

  const pickerProps = { memoryCards, selectedId, recommendedSize, cycleSize, onSelect, onClose, includedSize }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent showCloseButton={false} className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <PickerContent {...pickerProps} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-6">
          <PickerContent {...pickerProps} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
