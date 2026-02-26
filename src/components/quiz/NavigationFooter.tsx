import { ChevronLeft, ChevronRight, CircleCheck } from 'lucide-react'

interface NavigationFooterProps {
  currentStep: number
  totalSteps?: number
  canGoNext: boolean
  onBack: () => void
  onNext: () => void
  isLoading?: boolean
}

export function NavigationFooter({
  currentStep,
  totalSteps = 6,
  canGoNext,
  onBack,
  onNext,
  isLoading = false,
}: NavigationFooterProps) {
  const isFirst = currentStep === 1
  const isLast = currentStep === totalSteps

  return (
    <footer className="flex h-20 items-center gap-3 border-t border-[#E4E4E7] bg-white px-5">
      {/* Back button */}
      <button
        onClick={onBack}
        disabled={isFirst}
        className={`flex h-11 w-20 items-center justify-center gap-1.5 rounded-[10px] text-[14px] font-medium transition-opacity
          ${isFirst ? 'cursor-not-allowed bg-[#F4F4F5] text-[#A1A1AA]' : 'bg-[#F4F4F5] text-[#71717A] hover:opacity-80'}`}
      >
        <ChevronLeft className="h-4 w-4" />
        Atrás
      </button>

      {/* Next / Finish button */}
      <button
        onClick={onNext}
        disabled={!canGoNext || isLoading}
        className={`flex h-11 flex-1 items-center justify-center gap-1.5 rounded-[10px] text-[14px] font-semibold text-white transition-opacity
          ${!canGoNext || isLoading ? 'cursor-not-allowed opacity-50' : 'hover:opacity-90'}
          ${isLast ? 'bg-[#16A34A]' : 'bg-[#2563EB]'}`}
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
