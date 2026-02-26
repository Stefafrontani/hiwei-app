import type { LucideIcon } from 'lucide-react'

interface OptionCardProps {
  icon: LucideIcon
  label: string
  subLabel?: string
  isActive: boolean
  onClick: () => void
}

export function OptionCard({ icon: Icon, label, subLabel, isActive, onClick }: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 rounded-xl transition-all
        h-[72px] w-[82px]
        md:h-24 md:w-[120px] md:rounded-2xl
        ${isActive
          ? 'border-2 border-[#2563EB] bg-[#EFF6FF]'
          : 'border border-[#E4E4E7] bg-white hover:border-[#2563EB]/40'}`}
    >
      <Icon
        className={`h-[22px] w-[22px] md:h-7 md:w-7 ${isActive ? 'text-[#2563EB]' : 'text-[#A1A1AA]'}`}
      />
      <span
        className={`text-[11px] font-semibold md:text-[13px] ${isActive ? 'text-[#2563EB]' : 'text-[#71717A]'}`}
      >
        {label}
      </span>
      {subLabel && (
        <span className={`text-[10px] font-medium ${isActive ? 'text-[#3B82F6]' : 'text-[#A1A1AA]'}`}>
          {subLabel}
        </span>
      )}
    </button>
  )
}
