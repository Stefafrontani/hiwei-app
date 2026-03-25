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
    <div className="flex flex-col gap-6">
      {/* Step title */}
      <div className="animate-fade-in-up flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10">
          <Car className="h-5 w-5 text-brand" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[18px] font-bold text-foreground md:text-[26px] md:tracking-tight">
            {STEP1.title}
          </p>
          <p className="text-[12px] text-muted-foreground md:text-[14px]">
            {STEP1.subtitle}
          </p>
        </div>
      </div>

      {/* Vehicle type */}
      <div className="animate-fade-in-up flex flex-col gap-3" style={{ '--delay': '80ms' } as React.CSSProperties}>
        <p className="text-[11px] font-semibold uppercase tracking-[1.5px] text-muted-foreground/70 md:text-[12px]">
          {STEP1.vehicleTypeLabel}
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
      <div className="animate-fade-in-up flex flex-col gap-3" style={{ '--delay': '160ms' } as React.CSSProperties}>
        <p className="text-[11px] font-semibold uppercase tracking-[1.5px] text-muted-foreground/70 md:text-[12px]">
          {STEP1.vehicleYearLabel}
        </p>
        <Select
          value={vehicleYear?.toString()}
          onValueChange={(val) => onVehicleYearChange(Number(val))}
        >
          <SelectTrigger
            className={`h-12 w-full rounded-xl border px-4 text-[14px] glass-card md:w-80
              ${showYearError ? 'border-destructive/40' : 'border-white/10 hover:border-brand/30'}`}
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
