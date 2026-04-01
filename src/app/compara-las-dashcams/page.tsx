import { InMemoryDashcamRepository } from '@/infrastructure/repositories/mock/InMemoryDashcamRepository'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { ComparatorView } from '@/components/comparator/ComparatorView'

export default async function ComparatorPage() {
  // TODO: Switch back to SupabaseDashcamRepository after testing
  const repo = new InMemoryDashcamRepository()
  const products = await repo.getAll()

  return (
    <div className="quiz-gradient grain-overlay flex h-dvh flex-col overflow-hidden">
      <SiteHeader activeNav="comparador" />
      <main className="flex-1 overflow-y-auto no-scrollbar">
        <div className="mx-auto w-full max-w-7xl px-4 pb-32 pt-6 md:px-6 md:pt-8">
          <div className="animate-fade-in-up mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Compará lado a lado
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Elegí dos modelos y mirá la diferencia en calidad de video y especificaciones.
            </p>
          </div>

          <ComparatorView products={products} />
        </div>
      </main>
    </div>
  )
}
