interface SubtitleBarProps {
  variant?: 'blue' | 'green'
  title: string
  subtitle: string
}

export function SubtitleBar({ variant = 'blue', title, subtitle }: SubtitleBarProps) {
  const isGreen = variant === 'green'
  return (
    <div className="px-6 py-4 md:px-8 md:py-5">
      <p className={`text-[16px] font-bold tracking-tight md:text-[18px]
        ${isGreen ? 'text-success' : 'text-brand'}`}
      >
        {title}
      </p>
      <p className="text-[12px] text-muted-foreground md:text-[13px]">{subtitle}</p>
    </div>
  )
}
