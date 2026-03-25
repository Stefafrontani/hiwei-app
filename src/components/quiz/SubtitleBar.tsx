interface SubtitleBarProps {
  variant?: 'blue' | 'green'
  title: string
  subtitle: string
}

export function SubtitleBar({ variant = 'blue', title, subtitle }: SubtitleBarProps) {
  const isGreen = variant === 'green'
  return (
    <div
      className={`relative overflow-hidden px-6 py-4 md:px-8 md:py-5
        ${isGreen ? 'bg-success/5' : 'bg-brand/5'}`}
    >
      {/* Atmospheric radial glow */}
      <div
        className={`pointer-events-none absolute -top-12 -left-12 h-40 w-40 rounded-full blur-3xl opacity-30
          ${isGreen ? 'bg-success/30' : 'bg-brand/30'}`}
      />
      <div className="relative">
        <p className={`text-[16px] font-bold tracking-tight md:text-[18px]
          ${isGreen ? 'text-success' : 'text-brand'}`}
        >
          {title}
        </p>
        <p className="text-[12px] text-muted-foreground md:text-[13px]">{subtitle}</p>
      </div>
    </div>
  )
}
