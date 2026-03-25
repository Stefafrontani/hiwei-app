import { SupabaseDashcamRepository } from '@/infrastructure/repositories/supabase/SupabaseDashcamRepository'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { ComparatorView } from '@/components/comparator/ComparatorView'

export default async function ComparatorPage() {
  const repo = new SupabaseDashcamRepository()
  const products = await repo.getAll()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader activeNav="comparador" />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-32 pt-8 md:px-6">
        {/* Section Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Compará los modelos
            </h2>
            <p className="max-w-xl text-muted-foreground">
              Elegí dos dashcams y compará su calidad de video, especificaciones y precio lado a lado.
            </p>
          </div>
        </div>

        <ComparatorView products={products} />
      </main>
    </div>
  )
}
