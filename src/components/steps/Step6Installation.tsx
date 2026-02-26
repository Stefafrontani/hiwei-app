import { Wrench, Package } from 'lucide-react'
import { OptionRow } from '@/components/quiz/OptionRow'
import type { Installation } from '@/types/dashcam'

interface Step6InstallationProps {
  installation?: Installation
  onChange: (value: Installation) => void
}

export function Step6Installation({ installation, onChange }: Step6InstallationProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Step title */}
      <div className="flex items-start gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#F0FDF4]">
          <Wrench className="h-[18px] w-[18px] text-[#16A34A]" />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-[16px] font-semibold text-[#18181B] md:text-[22px] md:font-bold">
            ¿Te gustaría que instalemos tu dashcam?
          </p>
          <p className="text-[12px] text-[#71717A] md:text-[14px]">
            Instalación profesional en nuestro taller
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        <OptionRow
          icon={Wrench}
          title="Sí, quiero instalación profesional"
          description="Nuestro equipo instala tu dashcam de forma segura y prolija."
          isActive={installation === 'si'}
          onClick={() => onChange('si')}
          accentColor="green"
        />

        <OptionRow
          icon={Package}
          title="No, solo quiero el producto"
          description="Te enviamos con todo lo necesario para instalar."
          isActive={installation === 'no'}
          onClick={() => onChange('no')}
          accentColor="green"
        />
      </div>
    </div>
  )
}
