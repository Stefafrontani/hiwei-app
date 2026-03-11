'use client'

import { Car, Truck, CircleHelp, Info } from 'lucide-react'
import { OptionCard } from '@/components/quiz/OptionCard'
import { InfoBox } from '@/components/quiz/InfoBox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { VehicleType } from '@/domain/value-objects/VehicleType'
import { STEP1 } from '@/content/quiz/steps'

const VEHICLE_ICONS: Record<string, typeof Car> = {
  auto: Car,
  pickup: Truck,
  suv: Truck,
  otro: CircleHelp,
}

const YEARS = Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() - i))

interface Step1Props {
  vehicleType?: VehicleType
  vehicleYear?: number
  showYearError: boolean
  onVehicleTypeChange: (type: VehicleType) => void
  onVehicleYearChange: (year: number) => void
}

export function Step1({
  vehicleType,
  vehicleYear,
  showYearError,
  onVehicleTypeChange,
  onVehicleYearChange,
}: Step1Props) {
  return (
    <div className="flex flex-col gap-5">
      {/* Step title */}
      <div className="flex items-start gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-brand/10">
          <Car className="h-[18px] w-[18px] text-brand" />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-[16px] font-semibold text-foreground md:text-[22px] md:font-bold">
            {STEP1.title}
          </p>
          <p className="text-[12px] text-muted-foreground md:text-[14px]">
            {STEP1.subtitle}
          </p>
        </div>
      </div>

      {/* Vehicle type */}
      <div className="flex flex-col gap-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-[1px] text-muted-foreground md:text-[12px]">
          {STEP1.vehicleTypeLabel}
        </p>
        <div className="flex flex-wrap gap-2.5">
          {STEP1.options.map(({ type, label }) => (
            <OptionCard
              key={type}
              icon={VEHICLE_ICONS[type]}
              subLabel={label}
              isActive={vehicleType === type}
              onClick={() => onVehicleTypeChange(type)}
            />
          ))}
        </div>
      </div>

      {/* Vehicle year */}
      <div className="flex flex-col gap-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-[1px] text-muted-foreground md:text-[12px]">
          {STEP1.vehicleYearLabel}
        </p>
        <Select
          value={vehicleYear?.toString()}
          onValueChange={(val) => onVehicleYearChange(Number(val))}
        >
          <SelectTrigger
            className={`h-12 w-full rounded-[10px] border px-3.5 text-[14px] md:w-80
              ${showYearError ? 'border-destructive/30' : 'border-border'}`}
          >
            <SelectValue placeholder={STEP1.yearPlaceholder} />
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
            text={STEP1.yearError}
            variant="red"
          />
        )}
      </div>
    </div>
  )
}
