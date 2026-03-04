import { Car, X, Check, Info } from 'lucide-react'
import { OptionRow } from '@/components/quiz/OptionRow'
import { InfoBox } from '@/components/quiz/InfoBox'
import type { ParkingMode } from '@/domain/value-objects/ParkingMode'

interface Step5Props {
  parkingMode?: ParkingMode
  onChange: (mode: ParkingMode) => void
}

export function Step5({ parkingMode, onChange }: Step5Props) {
  return (
    <div className="flex flex-col gap-5">
      {/* Step title */}
      <div className="flex items-start gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-brand/10">
          <Car className="h-[18px] w-[18px] text-brand" />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-[16px] font-semibold text-foreground md:text-[22px] md:font-bold">
            ¿Querés que la dashcam funcione con el auto apagado?
          </p>
          <p className="text-[12px] text-muted-foreground md:text-[14px]">
            Esto se conoce como &quot;modo estacionamiento&quot;
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        <OptionRow
          icon={Check}
          title="Sí, quiero que grabe con el auto apagado"
          description="Se incluirá un hardwire kit para conectar la dashcam a la fusilera del auto."
          isActive={parkingMode === 'si'}
          onClick={() => onChange('si')}
        />

        <OptionRow
          icon={X}
          title="No, solo cuando manejo"
          description="La dashcam grabará únicamente con el motor encendido."
          isActive={parkingMode === 'no'}
          onClick={() => onChange('no')}
        />
      </div>

      <InfoBox
        icon={Info}
        text="El modo estacionamiento requiere un hardwire kit que conecta la dashcam a la fusilera del auto, permitiendo que funcione con el motor apagado."
        variant="amber"
      />
    </div>
  )
}
