import { Suspense } from 'react'
import { GetAllDashcamsUseCase } from '@/application/use-cases/dashcam/GetAllDashcams/GetAllDashcams.usecase'
import { SupabaseDashcamRepository } from '@/infrastructure/repositories/supabase/SupabaseDashcamRepository'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { ComparatorView } from '@/components/comparator/ComparatorView'

export default async function ComparatorPage() {
  const useCase = new GetAllDashcamsUseCase(new SupabaseDashcamRepository())
  const products = await useCase.execute()

  return (
    <div className="quiz-gradient grain-overlay flex h-dvh flex-col overflow-hidden">
      <SiteHeader activeNav="comparador" />
      <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        <div className="mx-auto w-full max-w-7xl px-4 pb-32 pt-6 md:px-6 md:pt-8">
          <Suspense fallback={null}>
            <ComparatorView products={products} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
