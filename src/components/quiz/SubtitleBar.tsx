interface SubtitleBarProps {
  variant?: 'blue' | 'green'
  title: string
  subtitle: string
}

export function SubtitleBar({ variant = 'blue', title, subtitle }: SubtitleBarProps) {
  const isBlue = variant === 'blue'
  return (
    <div
      className={`flex flex-col gap-1 px-5 py-3 ${isBlue ? 'bg-brand/10' : 'bg-success/10'}`}
    >
      <p className={`text-[14px] font-semibold ${isBlue ? 'text-brand' : 'text-success'}`}>
        {title}
      </p>
      <p className="text-[12px] text-muted-foreground">{subtitle}</p>
    </div>
  )
}
