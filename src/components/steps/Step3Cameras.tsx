import { Camera } from 'lucide-react'
import { OptionRow } from '@/components/quiz/OptionRow'
import type { CameraPosition } from '@/types/dashcam'

interface Step3CamerasProps {
  cameraPosition?: CameraPosition
  onChange: (position: CameraPosition) => void
}

export function Step3Cameras({ cameraPosition, onChange }: Step3CamerasProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Step title */}
      <div className="flex items-start gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-brand/10">
          <Camera className="h-[18px] w-[18px] text-brand" />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-[16px] font-semibold text-foreground md:text-[22px] md:font-bold">
            ¿Cuántas cámaras necesitás?
          </p>
          <p className="text-[12px] text-muted-foreground md:text-[14px]">
            Cada opción incluye todo lo necesario
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-[1px] text-muted-foreground md:text-[12px]">
          UBICACIÓN DE CÁMARAS *
        </p>

        <OptionRow
          icon={Camera}
          title="Frontal"
          description="Una cámara apuntando hacia el frente"
          isActive={cameraPosition === 'frontal'}
          onClick={() => onChange('frontal')}
        />

        <OptionRow
          icon={Camera}
          title="Frontal + Trasera"
          description="Cubre adelante y atrás del vehículo"
          isActive={cameraPosition === 'frontal-trasera'}
          onClick={() => onChange('frontal-trasera')}
        />

        <OptionRow
          icon={Camera}
          title="Frontal + Trasera + Interior"
          description="Cobertura completa: ruta y habitáculo"
          isActive={cameraPosition === 'frontal-trasera-interior'}
          onClick={() => onChange('frontal-trasera-interior')}
        />
      </div>
    </div>
  )
}
