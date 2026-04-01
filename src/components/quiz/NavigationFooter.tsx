import { ChevronLeft, ChevronRight, CircleCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
  const isDisabled = !canGoNext || isLoading

  return (
    <footer className={isMobile
      ? 'flex items-center gap-4 px-5 py-4'
      : 'mt-8 flex items-center justify-between'}
    >
      {/* Back */}
      <Button
        variant="outline"
        size="lg"
        onClick={onBack}
        disabled={isFirst}
        className={isMobile ? 'w-12' : ''}
      >
        <ChevronLeft className="h-4 w-4" />
        {!isMobile && <span>Atrás</span>}
      </Button>

      {/* Next / Finish */}
      <Button
        variant={isLast ? 'info' : 'brand'}
        size="lg"
        onClick={onNext}
        disabled={isDisabled}
        className={isMobile ? 'flex-1' : ''}
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
      </Button>
    </footer>
  )
}
