'use client'

import { Car, Truck, Bike, Info } from 'lucide-react'
import { OptionCard } from '@/components/quiz/OptionCard'
import { InfoBox } from '@/components/quiz/InfoBox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { VehicleType } from '@/types/dashcam'

const VEHICLE_OPTIONS: { type: VehicleType; label: string; icon: typeof Car }[] = [
  { type: 'auto', label: 'Auto', icon: Car },
  { type: 'pickup', label: 'Pickup', icon: Truck },
  { type: 'suv', label: 'SUV', icon: Truck },
  { type: 'moto', label: 'Moto', icon: Bike },
]

const YEARS = Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() - i))

interface Step1VehicleProps {
  vehicleType?: VehicleType
  vehicleYear?: number
  showYearError: boolean
  onVehicleTypeChange: (type: VehicleType) => void
  onVehicleYearChange: (year: number) => void
}

export function Step1Vehicle({
  vehicleType,
  vehicleYear,
  showYearError,
  onVehicleTypeChange,
  onVehicleYearChange,
}: Step1VehicleProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Step title */}
      <div className="flex items-start gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EFF6FF]">
          <Car className="h-[18px] w-[18px] text-[#2563EB]" />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-[16px] font-semibold text-[#18181B] md:text-[22px] md:font-bold">
            ¿Qué tipo de vehículo tenés?
          </p>
          <p className="text-[12px] text-[#71717A] md:text-[14px]">
            Elegí el que mejor describe tu auto o moto
          </p>
        </div>
      </div>

      {/* Vehicle type */}
      <div className="flex flex-col gap-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-[1px] text-[#A1A1AA] md:text-[12px]">
          TIPO DE VEHÍCULO *
        </p>
        <div className="flex flex-wrap gap-2.5">
          {VEHICLE_OPTIONS.map(({ type, label, icon }) => (
            <OptionCard
              key={type}
              icon={icon}
              label={label}
              isActive={vehicleType === type}
              onClick={() => onVehicleTypeChange(type)}
            />
          ))}
        </div>
      </div>

      {/* Vehicle year */}
      <div className="flex flex-col gap-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-[1px] text-[#A1A1AA] md:text-[12px]">
          AÑO DEL VEHÍCULO *
        </p>
        <Select
          value={vehicleYear?.toString()}
          onValueChange={(val) => onVehicleYearChange(Number(val))}
        >
          <SelectTrigger
            className={`h-12 w-full rounded-[10px] border px-3.5 text-[14px] md:w-80
              ${showYearError ? 'border-[#FCA5A5]' : 'border-[#E4E4E7]'}`}
          >
            <SelectValue placeholder="Ej: 2020" />
          </SelectTrigger>
          <SelectContent>
            {YEARS.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {showYearError && (
          <InfoBox
            icon={Info}
            text="Seleccioná el año del vehículo"
            variant="red"
          />
        )}
      </div>
    </div>
  )
}
