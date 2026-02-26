import { Package, Sun, Bluetooth, Car, Info } from 'lucide-react'
import { CheckboxRow } from '@/components/quiz/CheckboxRow'
import { InfoBox } from '@/components/quiz/InfoBox'
import type { Extra } from '@/types/dashcam'

const EXTRAS_CONFIG = [
  {
    value: 'filtro-polarizador' as Extra,
    icon: Sun,
    title: 'Filtro polarizador',
    description: 'Mejora imagen filtrando reflejos y luz.',
  },
  {
    value: 'control-bluetooth' as Extra,
    icon: Bluetooth,
    title: 'Control Bluetooth',
    description: 'Botón para guardar clips rápidamente.',
    note: (
      <InfoBox
        icon={Info}
        text="Disponibilidad según modelo."
        variant="blue"
      />
    ),
  },
  {
    value: 'modo-estacionamiento' as Extra,
    icon: Car,
    title: 'Modo estacionamiento',
    description: 'Permite grabar cuando el auto está apagado.',
    note: (
      <InfoBox
        icon={Info}
        text="Requiere kit de estacionamiento para un uso seguro y prolijo."
        variant="amber"
      />
    ),
  },
]

interface Step5ExtrasProps {
  extras: Extra[]
  onChange: (extras: Extra[]) => void
}

export function Step5Extras({ extras, onChange }: Step5ExtrasProps) {
  const toggle = (value: Extra, checked: boolean) => {
    if (checked) {
      onChange([...extras, value])
    } else {
      onChange(extras.filter((e) => e !== value))
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Step title */}
      <div className="flex items-start gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-brand/10">
          <Package className="h-[18px] w-[18px] text-brand" />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-[16px] font-semibold text-foreground md:text-[22px] md:font-bold">
            Extras sugeridos
          </p>
          <p className="text-[12px] text-muted-foreground md:text-[14px]">
            Seleccioná los que quieras agregar
          </p>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-col gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[1px] text-muted-foreground md:text-[12px]">
          ACCESORIOS OPCIONALES
        </p>

        {EXTRAS_CONFIG.map(({ value, icon, title, description, note }) => (
          <CheckboxRow
            key={value}
            icon={icon}
            title={title}
            description={description}
            isChecked={extras.includes(value)}
            onChange={(checked) => toggle(value, checked)}
            note={note}
          />
        ))}
      </div>
    </div>
  )
}
