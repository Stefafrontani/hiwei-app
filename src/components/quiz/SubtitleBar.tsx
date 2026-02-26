interface SubtitleBarProps {
  variant?: 'blue' | 'green'
  title: string
  subtitle: string
}

export function SubtitleBar({ variant = 'blue', title, subtitle }: SubtitleBarProps) {
  const isBlue = variant === 'blue'
  return (
    <div
      className={`flex flex-col gap-1 px-5 py-3 ${isBlue ? 'bg-[#EFF6FF]' : 'bg-[#F0FDF4]'}`}
    >
      <p className={`text-[14px] font-semibold ${isBlue ? 'text-[#2563EB]' : 'text-[#16A34A]'}`}>
        {title}
      </p>
      <p className="text-[12px] text-[#71717A]">{subtitle}</p>
    </div>
  )
}
