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

  const isMobile = variant === 'mobile'

  return (
    <footer className={isMobile
      ? 'flex items-center gap-3 px-5 py-4'
      : 'mt-8 flex items-center justify-between'}
    >
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        disabled={isFirst}
        className={`flex items-center justify-center gap-1.5 rounded-xl font-medium transition-all duration-200
          ${isMobile ? 'h-12 w-12' : 'h-12 w-auto px-5'}
          ${isFirst
            ? 'cursor-not-allowed border border-border/50 text-muted-foreground/40'
            : 'border border-border/80 text-muted-foreground hover:border-brand/30 hover:text-foreground hover:bg-card/50 active:scale-[0.97]'}`}
      >
        <ChevronLeft className="h-4 w-4" />
        {!isMobile && <span className="text-[14px]">Atrás</span>}
      </button>

      {/* Next / Finish button */}
      <button
        type="button"
        onClick={onNext}
        disabled={!canGoNext || isLoading}
        className={`flex items-center justify-center gap-2 rounded-xl text-[14px] font-semibold transition-all duration-200
          ${isMobile ? 'h-12 flex-1' : 'h-12 px-8'}
          ${!canGoNext || isLoading
            ? 'cursor-not-allowed opacity-40 blur-[0.3px] shadow-none'
            : `hover:brightness-110 active:scale-[0.98] ${isLast ? 'shadow-[0_0_20px_2px] shadow-success/15' : 'shadow-[0_0_20px_2px] shadow-brand/15'}`}
          ${isLast
            ? 'bg-gradient-to-r from-success to-success/80 text-success-foreground'
            : 'bg-gradient-to-r from-brand to-brand/80 text-brand-foreground'}`}
      >
        {isLoading ? (
          <span className="loading-dots flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
          </span>
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
