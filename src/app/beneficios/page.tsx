'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Percent,
  UserCheck,
  PackageCheck,
  Sparkles,
  CircleCheck,
  Check,
  TriangleAlert,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

type ViewState = 'form' | 'success' | 'error'

const BENEFITS: { Icon: LucideIcon; bg: string; fg: string; title: string; sub: string }[] = [
  {
    Icon: Percent,
    bg: 'bg-success/10',
    fg: 'text-success',
    title: 'Ofertas exclusivas',
    sub: 'Precio preferencial en tu primera compra',
  },
  {
    Icon: UserCheck,
    bg: 'bg-brand/10',
    fg: 'text-brand',
    title: 'Asesoramiento personalizado',
    sub: 'Un experto te ayuda a elegir la mejor dashcam',
  },
  {
    Icon: PackageCheck,
    bg: 'bg-warning/15',
    fg: 'text-warning',
    title: 'Prioridad en stock',
    sub: 'Reservá antes que nadie los nuevos modelos',
  },
]

export default function BeneficiosPage() {
  const router = useRouter()
  const [view, setView] = useState<ViewState>('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const cached = localStorage.getItem('hiwei-recommendation')
      const recommendationId = cached
        ? JSON.parse(cached)?.recommendationId
        : undefined

      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          recommendationId,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setView('success')
    } catch {
      setView('error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleBack = () => router.back()

  /* ── Form view ───────────────────────────────────────────────────────── */
  if (view === 'form') {
    return (
      <div className="quiz-gradient grain-overlay flex h-dvh flex-col overflow-hidden">
        <SiteHeader />

        <main className="flex-1 overflow-y-auto no-scrollbar">
          <div className="mx-auto w-full max-w-7xl px-4 pb-32 pt-6 md:px-6 md:pt-10">
            {/* Section header — matches gallery/comparator pattern */}
            <div className="animate-fade-in-up mb-8 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Beneficios exclusivos
              </h1>
              <p className="mt-1 text-[13px] text-muted-foreground md:text-[14px]">
                Registrate y accedé a ventajas pensadas para vos.
              </p>
            </div>

            {/* Shimmer Split Card */}
            <div
              className="animate-fade-in-up mx-auto max-w-[780px]"
              style={{ '--delay': '80ms' } as React.CSSProperties}
            >
              <div className="shimmer-border">
                <div className="overflow-hidden rounded-[inherit]">
                  <div className="flex flex-col md:flex-row">
                    {/* Left — Benefits */}
                    <div className="flex flex-1 flex-col justify-between bg-card p-6 md:border-r md:border-white/[0.06] md:p-8">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[1.5px] text-muted-foreground">
                          Tus ventajas
                        </p>
                        <h2 className="mt-2 text-[18px] font-bold leading-tight text-foreground md:text-[20px]">
                          Ventajas que te esperan
                        </h2>
                        <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground md:text-[13px]">
                          Completá tus datos y empezá a disfrutar beneficios
                          pensados para vos.
                        </p>

                        {/* Benefits list */}
                        <div className="mt-5 flex flex-col gap-4">
                          {BENEFITS.map((b, i) => (
                            <div
                              key={b.title}
                              className="animate-fade-in-up flex items-start gap-3"
                              style={
                                {
                                  '--delay': `${(i + 2) * 100}ms`,
                                } as React.CSSProperties
                              }
                            >
                              <div
                                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${b.bg}`}
                              >
                                <b.Icon className={`h-4 w-4 ${b.fg}`} />
                              </div>
                              <div>
                                <p className="text-[13px] font-semibold text-foreground">
                                  {b.title}
                                </p>
                                <p className="mt-0.5 text-[11px] text-muted-foreground">
                                  {b.sub}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Trust signal */}
                      <div
                        className="animate-fade-in-up mt-6 flex items-center gap-2"
                        style={{ '--delay': '550ms' } as React.CSSProperties}
                      >
                        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                        <p className="text-[11px] text-muted-foreground/50">
                          Tus datos están protegidos. No compartimos tu
                          información.
                        </p>
                      </div>
                    </div>

                    {/* Right — Form */}
                    <div className="flex-1 bg-background p-6 md:p-8">
                      <p
                        className="animate-fade-in-up text-[16px] font-bold text-foreground"
                        style={{ '--delay': '200ms' } as React.CSSProperties}
                      >
                        Completá tus datos
                      </p>

                      <Separator className="my-4 bg-white/[0.06]" />

                      <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4"
                      >
                        <div
                          className="animate-fade-in-up flex flex-col gap-2"
                          style={
                            { '--delay': '280ms' } as React.CSSProperties
                          }
                        >
                          <Label
                            htmlFor="benefit-name"
                            className="text-[12px] font-semibold"
                          >
                            Nombre y apellido *
                          </Label>
                          <Input
                            id="benefit-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej: Juan Pérez"
                            required
                            className="h-11 rounded-lg"
                          />
                        </div>

                        <div
                          className="animate-fade-in-up flex flex-col gap-2"
                          style={
                            { '--delay': '360ms' } as React.CSSProperties
                          }
                        >
                          <Label
                            htmlFor="benefit-email"
                            className="text-[12px] font-semibold"
                          >
                            Email *
                          </Label>
                          <Input
                            id="benefit-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            required
                            className="h-11 rounded-lg"
                          />
                        </div>

                        <div
                          className="animate-fade-in-up flex flex-col gap-2"
                          style={
                            { '--delay': '440ms' } as React.CSSProperties
                          }
                        >
                          <Label
                            htmlFor="benefit-phone"
                            className="text-[12px] font-medium text-muted-foreground"
                          >
                            Teléfono (opcional)
                          </Label>
                          <Input
                            id="benefit-phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+54 11 1234-5678"
                            className="h-11 rounded-lg"
                          />
                        </div>

                        <Button
                          type="submit"
                          variant="brand"
                          size="lg"
                          disabled={submitting}
                          className="animate-fade-in-up mt-2 w-full font-bold"
                          style={
                            { '--delay': '520ms' } as React.CSSProperties
                          }
                        >
                          <Sparkles className="h-[18px] w-[18px]" />
                          {submitting
                            ? 'Registrando...'
                            : 'Quiero mis beneficios'}
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  /* ── Success view ────────────────────────────────────────────────────── */
  if (view === 'success') {
    return (
      <div className="quiz-gradient grain-overlay flex h-dvh flex-col overflow-hidden">
        <SiteHeader />
        <main className="flex flex-1 flex-col items-center justify-center overflow-y-auto no-scrollbar px-4">
          <div className="mx-auto w-full max-w-[480px]">
            <div className="animate-fade-in-up glass-card rounded-2xl border-white/[0.06] p-6 md:p-8">
              {/* Icon */}
              <div className="mb-5 flex justify-center">
                <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-success/10">
                  <CircleCheck className="h-9 w-9 text-success" />
                </div>
              </div>

              {/* Title */}
              <h2 className="mb-2 text-center text-[22px] font-bold text-foreground">
                ¡Ya sos parte!
              </h2>

              {/* Subtitle */}
              <p className="mb-5 text-center text-[14px] leading-relaxed text-muted-foreground">
                Te enviamos un email con tus beneficios exclusivos. Revisá tu
                bandeja de entrada.
              </p>

              {/* Benefits checklist */}
              <Alert variant="success" className="mb-5 rounded-xl">
                <Check className="h-4 w-4" />
                <AlertTitle>Beneficios activados</AlertTitle>
                <AlertDescription>
                  <ul className="mt-1.5 flex flex-col gap-1.5">
                    {BENEFITS.map((b) => (
                      <li key={b.title} className="flex items-center gap-2">
                        <Check className="h-3 w-3 shrink-0" />
                        <span className="text-[13px]">{b.title}</span>
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Back button */}
              <Button
                variant="brand"
                size="lg"
                onClick={handleBack}
                className="h-[50px] w-full rounded-xl"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a mi recomendación
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  /* ── Error view ──────────────────────────────────────────────────────── */
  return (
    <div className="quiz-gradient grain-overlay flex h-dvh flex-col overflow-hidden">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center overflow-y-auto no-scrollbar px-4">
        <div className="mx-auto w-full max-w-[480px]">
          <div className="animate-fade-in-up glass-card rounded-2xl border-white/[0.06] p-6 md:p-8">
            {/* Icon */}
            <div className="mb-5 flex justify-center">
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-destructive/10">
                <TriangleAlert className="h-9 w-9 text-destructive" />
              </div>
            </div>

            {/* Title */}
            <h2 className="mb-2 text-center text-[22px] font-bold text-foreground">
              Algo salió mal
            </h2>

            {/* Subtitle */}
            <p className="mb-5 text-center text-[14px] leading-relaxed text-muted-foreground">
              No pudimos procesar tu solicitud. Verificá tu conexión e intentá
              de nuevo.
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button
                variant="destructive"
                size="lg"
                onClick={() => setView('form')}
                className="h-[50px] w-full rounded-xl"
              >
                <RefreshCw className="h-4 w-4" />
                Intentar de nuevo
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleBack}
                className="h-12 w-full rounded-xl"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a mi recomendación
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
