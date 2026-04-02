import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { GetDashcamByIdUseCase } from '@/application/use-cases/dashcam/GetDashcamById/GetDashcamById.usecase'
import { SupabaseDashcamRepository } from '@/infrastructure/repositories/supabase/SupabaseDashcamRepository'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SharedProductView } from '@/components/gallery/SharedProductView'

interface Props {
  params: Promise<{ id: string }>
}

export default async function SharedProductPage({ params }: Props) {
  const { id } = await params
  const useCase = new GetDashcamByIdUseCase(new SupabaseDashcamRepository())
  const product = await useCase.execute(id)

  if (!product) notFound()

  return (
    <div className="quiz-gradient grain-overlay flex h-dvh flex-col overflow-hidden">
      <SiteHeader activeNav="galeria" />
      <main className="flex-1 overflow-y-auto no-scrollbar">
        <div className="mx-auto w-full max-w-7xl px-4 pb-32 pt-6 md:px-6 md:pt-8">
          <Suspense fallback={null}>
            <SharedProductView product={product} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
