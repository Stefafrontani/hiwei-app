import { Timer, Info } from 'lucide-react'
import { OptionCard } from '@/components/quiz/OptionCard'
import { InfoBox } from '@/components/quiz/InfoBox'
import type { VehicleUsage } from '@/domain/value-objects/VehicleUsage'

const USAGE_OPTIONS: { value: VehicleUsage; label: string; subLabel: string }[] = [
  { value: 'work_tool', label: 'Trabajo', subLabel: 'Taxi, delivery, remis' },
  { value: 'commute', label: 'Viaje ocasional', subLabel: 'Uso diario' },
  { value: 'recreational', label: 'Recreativo', subLabel: 'Uso ocasional' },
  { value: 'other', label: 'Otro', subLabel: 'Sin preferencia' },
]

interface Step4Props {
  vehicleUsage?: VehicleUsage
  onChange: (usage: VehicleUsage) => void
}

export function Step4({ vehicleUsage, onChange }: Step4Props) {
  return (
    <div className="flex flex-col gap-5">
      {/* Step title */}
      <div className="flex items-start gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-brand/10">
          <Timer className="h-[18px] w-[18px] text-brand" />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-[16px] font-semibold text-foreground md:text-[22px] md:font-bold">
            ¿Qué uso le das al vehículo?
          </p>
          <p className="text-[12px] text-muted-foreground md:text-[14px]">
            Esto nos ayuda a saber cuanto tiempo pasas por día arriba del auto y así poder calcular que duración de grabación continua necesitás
          </p>
        </div>
      </div>

      {/* Usage options */}
      <div className="flex flex-col gap-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-[1px] text-muted-foreground md:text-[12px]">
          USO PRINCIPAL DEL VEHÍCULO *
        </p>
        <div className="flex flex-wrap gap-2.5">
          {USAGE_OPTIONS.map(({ value, label, subLabel }) => (
            <OptionCard
              key={value}
              label={label}
              subLabel={subLabel}
              isActive={vehicleUsage === value}
              onClick={() => onChange(value)}
            />
          ))}
        </div>
      </div>

      <InfoBox
        icon={Info}
        text="A mayor uso del vehículo, recomendamos una tarjeta de memoria con más capacidad para mayor tiempo de grabación."
        variant="orange"
      />
    </div>
  )
}
