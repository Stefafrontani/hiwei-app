'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Percent,
  UserCheck,
  PackageCheck,
  Sparkles,
  CircleCheck,
  Check,
  TriangleAlert,
  RefreshCw,
  ShieldCheck,
  ImageIcon,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import {
  leadFormSchema,
  type LeadFormValues,
} from '@/domain/validation/schemas'

type ViewState = 'form' | 'success' | 'error'

const BENEFITS: {
  Icon: LucideIcon
  bg: string
  fg: string
  title: string
  sub: string
}[] = [
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
  const [view, setView] = useState<ViewState>('form')
  const [submitting, setSubmitting] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: { name: '', email: '', phone: '' },
    mode: 'onChange',
  })

  const onSubmit = async (values: LeadFormValues) => {
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
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone?.trim() || undefined,
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

  /* ── Render ────────────────────────────────────────────────────────── */
  return (
    <>
      <div className="quiz-gradient grain-overlay flex h-dvh flex-col overflow-hidden">
        <SiteHeader />

        <main className="flex-1 overflow-y-auto no-scrollbar">
          <div className="mx-auto w-full max-w-7xl px-4 pb-32 pt-6 md:px-6 md:pt-10">
            {/* Section header */}
            <div className="animate-fade-in-up mb-8 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Beneficios exclusivos
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
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
                        <p className="text-xs font-semibold uppercase tracking-[1.5px] text-muted-foreground">
                          Tus ventajas
                        </p>
                        <h2 className="mt-2 text-lg font-bold leading-tight text-foreground md:text-xl">
                          Ventajas que te esperan
                        </h2>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground md:text-sm">
                          Completá tus datos y empezá a disfrutar beneficios
                          pensados para vos.
                        </p>

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
                                <p className="text-sm font-semibold text-foreground">
                                  {b.title}
                                </p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  {b.sub}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div
                        className="animate-fade-in-up mt-6 flex items-center gap-2"
                        style={{ '--delay': '550ms' } as React.CSSProperties}
                      >
                        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                        <p className="text-xs text-muted-foreground/50">
                          Tus datos están protegidos. No compartimos tu
                          información.
                        </p>
                      </div>
                    </div>

                    {/* Right — Form */}
                    <div className="flex-1 bg-background p-6 md:p-8">
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                      >
                        <Controller
                          name="name"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel
                                htmlFor="benefit-name"
                                className="text-xs font-semibold"
                              >
                                Nombre y apellido *
                              </FieldLabel>
                              <Input
                                {...field}
                                id="benefit-name"
                                placeholder="Ej: Juan Pérez"
                                aria-invalid={fieldState.invalid}
                                className="h-11 rounded-lg"
                              />
                              <FieldError
                                errors={[fieldState.error]}
                                className="text-xs"
                              />
                            </Field>
                          )}
                        />

                        <Controller
                          name="email"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel
                                htmlFor="benefit-email"
                                className="text-xs font-semibold"
                              >
                                Email *
                              </FieldLabel>
                              <Input
                                {...field}
                                id="benefit-email"
                                type="email"
                                placeholder="tu@email.com"
                                aria-invalid={fieldState.invalid}
                                className="h-11 rounded-lg"
                              />
                              <FieldError
                                errors={[fieldState.error]}
                                className="text-xs"
                              />
                            </Field>
                          )}
                        />

                        <Controller
                          name="phone"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel
                                htmlFor="benefit-phone"
                                className="text-xs font-medium text-muted-foreground"
                              >
                                Teléfono (opcional)
                              </FieldLabel>
                              <Input
                                {...field}
                                id="benefit-phone"
                                type="tel"
                                placeholder="+54 11 1234-5678"
                                aria-invalid={fieldState.invalid}
                                className="h-11 rounded-lg"
                              />
                              <FieldError
                                errors={[fieldState.error]}
                                className="text-xs"
                              />
                            </Field>
                          )}
                        />

                        <div className="mt-2">
                          <Button
                            type="submit"
                            variant="brand"
                            size="lg"
                            disabled={submitting || !form.formState.isValid}
                            className="w-full font-bold"
                          >
                            <Sparkles className="h-[18px] w-[18px]" />
                            {submitting
                              ? 'Registrando...'
                              : 'Quiero mis beneficios'}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── Success overlay ──────────────────────────────────────────── */}
      {isDesktop ? (
        <Dialog open={view === 'success'} onOpenChange={() => {}}>
          <DialogContent
            showCloseButton={false}
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
            className="sm:max-w-[425px]"
          >
            <DialogHeader className="text-center sm:text-center">
              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 animate-glow-pulse">
                <CircleCheck className="h-8 w-8 text-success" />
              </div>
              <DialogTitle className="text-xl">¡Ya sos parte!</DialogTitle>
              <DialogDescription>
                Revisá tu email — te enviamos un resumen con todo lo que
                activaste.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              {BENEFITS.map((b) => (
                <div key={b.title} className="flex items-center gap-3 rounded-lg border px-3 py-2.5">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${b.bg}`}>
                    <b.Icon className={`h-3.5 w-3.5 ${b.fg}`} />
                  </div>
                  <span className="text-sm font-medium">{b.title}</span>
                  <Check className="ml-auto h-4 w-4 text-success" />
                </div>
              ))}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button variant="brand" className="w-full" asChild>
                <Link href="/galeria">
                  Explorá la galería
                </Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={view === 'success'} dismissible={false}>
          <DrawerContent>
            <DrawerHeader className="text-center">
              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 animate-glow-pulse">
                <CircleCheck className="h-8 w-8 text-success" />
              </div>
              <DrawerTitle className="text-xl font-bold">¡Ya sos parte!</DrawerTitle>
              <DrawerDescription>
                Revisá tu email — te enviamos un resumen con todo lo que
                activaste.
              </DrawerDescription>
            </DrawerHeader>
            <div className="grid gap-4 px-4 pb-6">
              <div className="grid gap-2">
                {BENEFITS.map((b) => (
                  <div key={b.title} className="flex items-center gap-3 rounded-lg border px-3 py-2.5">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${b.bg}`}>
                      <b.Icon className={`h-3.5 w-3.5 ${b.fg}`} />
                    </div>
                    <span className="text-sm font-medium">{b.title}</span>
                    <Check className="ml-auto h-4 w-4 text-success" />
                  </div>
                ))}
              </div>
              <Button variant="brand" className="w-full" asChild>
                <Link href="/galeria">
                  Explorar la galería
                </Link>
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {/* ── Error overlay ────────────────────────────────────────────── */}
      {isDesktop ? (
        <Dialog open={view === 'error'} onOpenChange={(open) => { if (!open) setView('form') }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader className="text-center sm:text-center">
              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <TriangleAlert className="h-8 w-8 text-destructive" />
              </div>
              <DialogTitle className="text-xl">No pudimos registrarte</DialogTitle>
              <DialogDescription>
                Hubo un problema con la conexión. Tus datos no se perdieron
                — podés volver a intentar.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button
                variant="default"
                className="w-full"
                onClick={() => setView('form')}
              >
                <RefreshCw />
                Reintentar
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/galeria">
                    Explorar la galería
                  </Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={view === 'error'} onOpenChange={(open) => { if (!open) setView('form') }}>
          <DrawerContent>
            <DrawerHeader className="text-center">
              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <TriangleAlert className="h-8 w-8 text-destructive" />
              </div>
              <DrawerTitle className="text-xl font-bold">No pudimos registrarte</DrawerTitle>
              <DrawerDescription>
                Hubo un problema con la conexión. Tus datos no se perdieron
                — podés volver a intentar.
              </DrawerDescription>
            </DrawerHeader>
            <div className="grid gap-2 px-4 pb-6">
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => setView('form')}
                >
                  <RefreshCw />
                  Reintentar
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/galeria">
                    Explorar la galería
                  </Link>
                </Button>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  )
}
