import { ChevronLeft, ChevronRight, CircleCheck } from 'lucide-react'

interface NavigationFooterProps {
  currentStep: number
  totalSteps?: number
  canGoNext: boolean
  onBack: () => void
  onNext: () => void
  isLoading?: boolean
  variant?: 'mobile' | 'desktop'
}

export function NavigationFooter({
  currentStep,
  totalSteps = 6,
  canGoNext,
  onBack,
  onNext,
  isLoading = false,
  variant = 'desktop',
}: NavigationFooterProps) {
  const isFirst = currentStep === 1
  const isLast = currentStep === totalSteps

  const footerClass =
    variant === 'mobile'
      ? 'flex items-center gap-3 px-5 py-4'
      : 'mt-6 flex items-center justify-between'

  const nextClass =
    variant === 'mobile'
      ? 'flex h-11 flex-1 items-center justify-center gap-1.5 rounded-[10px] text-[14px] font-semibold transition-opacity'
      : 'flex h-11 w-auto items-center justify-center gap-1.5 rounded-[10px] px-8 text-[14px] font-semibold transition-opacity'

  return (
    <footer className={footerClass}>
      {/* Back button */}
      <button
        onClick={onBack}
        disabled={isFirst}
        className={`flex h-11 w-20 items-center justify-center gap-1.5 rounded-[10px] text-[14px] font-medium transition-opacity
          ${isFirst ? 'cursor-not-allowed bg-muted text-muted-foreground' : 'bg-muted text-muted-foreground hover:opacity-80'}`}
      >
        <ChevronLeft className="h-4 w-4" />
        Atrás
      </button>

      {/* Next / Finish button */}
      <button
        onClick={onNext}
        disabled={!canGoNext || isLoading}
        className={`${nextClass}
          ${!canGoNext || isLoading ? 'cursor-not-allowed opacity-50' : 'hover:opacity-90'}
          ${isLast ? 'bg-success text-success-foreground' : 'bg-brand text-brand-foreground'}`}
      >
        {isLoading ? (
          <span>Cargando...</span>
        ) : isLast ? (
          <>
            <CircleCheck className="h-4 w-4" />
            Ver mi recomendación
          </>
        ) : (
          <>
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </>
        )}
      </button>
    </footer>
  )
}
