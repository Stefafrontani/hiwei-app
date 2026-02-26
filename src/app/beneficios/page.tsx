'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Camera,
  ArrowLeft,
  Gift,
  Percent,
  UserCheck,
  PackageCheck,
  BellRing,
  Sparkles,
  CircleCheck,
  Check,
  TriangleAlert,
  RefreshCw,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type ViewState = 'form' | 'success' | 'error'

const BENEFITS: {
  Icon: LucideIcon
  containerClass: string
  iconClass: string
  titleClass: string
  subClass: string
  title: string
  sub: string
}[] = [
  {
    Icon: Percent,
    containerClass: 'bg-success/10',
    iconClass: 'text-success',
    titleClass: 'text-success',
    subClass: 'text-success/70',
    title: 'Descuento exclusivo',
    sub: 'Precio preferencial en tu primera compra',
  },
  {
    Icon: UserCheck,
    containerClass: 'bg-brand/10',
    iconClass: 'text-brand',
    titleClass: 'text-brand',
    subClass: 'text-brand/70',
    title: 'Asesoramiento personalizado',
    sub: 'Un experto te ayuda a elegir la mejor dashcam',
  },
  {
    Icon: PackageCheck,
    containerClass: 'bg-warning/15',
    iconClass: 'text-warning',
    titleClass: 'text-warning',
    subClass: 'text-warning',
    title: 'Prioridad en stock',
    sub: 'Reservá antes que nadie los nuevos modelos',
  },
  {
    Icon: BellRing,
    containerClass: 'bg-info/10',
    iconClass: 'text-info',
    titleClass: 'text-info',
    subClass: 'text-info/70',
    title: 'Promociones anticipadas',
    sub: 'Enteráte antes de ofertas y lanzamientos',
  },
]

const SUCCESS_ITEMS = [
  'Descuento exclusivo activado',
  'Prioridad en nuevos lanzamientos',
  'Asesoramiento personalizado',
  'Promociones anticipadas',
]

function BenefitCard({ Icon, containerClass, iconClass, titleClass, subClass, title, sub }: (typeof BENEFITS)[0]) {
  return (
    <div className={`flex items-center gap-3 rounded-[10px] w-full px-3.5 py-3 ${containerClass}`}>
      <Icon className={`h-[18px] w-[18px] shrink-0 ${iconClass}`} />
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className={`text-[13px] font-semibold leading-tight ${titleClass}`}>
          {title}
        </span>
        <span className={`text-[11px] ${subClass}`}>
          {sub}
        </span>
      </div>
    </div>
  )
}

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
      const res = await fetch('/api/beneficios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone: phone || undefined }),
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

  /* ── Header ──────────────────────────────────────────────────────────── */
  const header = (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-5 md:h-16 md:justify-between md:px-12">
      {/* Mobile: back arrow + title */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={handleBack}
          className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-muted"
        >
          <ArrowLeft className="h-[18px] w-[18px] text-foreground" />
        </button>
        <span className="text-[15px] font-semibold text-foreground">Beneficios exclusivos</span>
      </div>

      {/* Desktop: logo left */}
      <div className="hidden items-center gap-3 md:flex">
        <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-brand">
          <Camera className="h-[18px] w-[18px] text-white" />
        </div>
        <span className="text-[18px] font-bold text-foreground">Hiwei</span>
        <span className="text-[13px] text-muted-foreground">Asesor de Dashcams</span>
      </div>

      {/* Desktop: back button (only on form view) */}
      {view === 'form' && (
        <button
          onClick={handleBack}
          className="hidden items-center gap-1.5 rounded-[8px] bg-muted px-3.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted md:flex"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a recomendación
        </button>
      )}
    </header>
  )

  /* ── BenefitsList (shared) ───────────────────────────────────────────── */
  const benefitsList = (
    <div className="flex flex-col gap-2.5">
      {BENEFITS.map((b) => (
        <BenefitCard key={b.title} {...b} />
      ))}
    </div>
  )

  /* ── Form view ───────────────────────────────────────────────────────── */
  if (view === 'form') {
    return (
      <div className="flex h-screen flex-col overflow-hidden bg-card md:bg-background">
        {header}

        {/* Mobile: scroll column */}
        <main className="flex flex-1 flex-col overflow-y-auto md:items-center md:justify-center md:p-12">
          {/* Desktop card wrapper */}
          <div className="w-full md:flex md:max-w-[880px] md:overflow-hidden md:rounded-2xl md:border md:border-border md:bg-card">

            {/* Left Col — Hero + Benefits */}
            <div className="flex flex-col gap-4 px-5 pb-2 pt-6 md:flex-1 md:gap-4 md:bg-muted/30 md:p-8">
              {/* Hero */}
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 md:h-[52px] md:w-[52px] md:rounded-[14px]">
                  <Gift className="h-7 w-7 text-brand md:h-[26px] md:w-[26px]" />
                </div>
                <p className="text-[20px] font-bold text-foreground md:text-[24px] md:leading-[1.3] md:text-left md:whitespace-pre-line">
                  <span className="md:hidden">Accedé a beneficios exclusivos</span>
                  <span className="hidden md:inline">{`Accedé a beneficios\nexclusivos`}</span>
                </p>
                <p className="text-[13px] text-muted-foreground md:text-left md:text-[14px]">
                  <span className="md:hidden">Completá tus datos y accedé a ventajas pensadas para vos.</span>
                  <span className="hidden md:inline">Dejá tus datos y accedé a ventajas pensadas para vos.</span>
                </p>
              </div>

              {/* Benefits */}
              {benefitsList}
            </div>

            {/* Right Col — Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3.5 px-5 pb-8 pt-6 md:flex-1 md:gap-5 md:p-8"
            >
              {/* Desktop-only form title */}
              <p className="hidden text-[18px] font-bold text-foreground md:block">Completá tus datos</p>

              {/* Field 1 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-foreground">Nombre y apellido *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  required
                  className="h-11 w-full rounded-[10px] border border-border px-3.5 text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:border-brand focus:ring-1 focus:ring-brand/30"
                />
              </div>

              {/* Field 2 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-foreground">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="h-11 w-full rounded-[10px] border border-border px-3.5 text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:border-brand focus:ring-1 focus:ring-brand/30"
                />
              </div>

              {/* Field 3 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-muted-foreground">Teléfono (opcional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+54 11 1234-5678"
                  className="h-11 w-full rounded-[10px] border border-border px-3.5 text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:border-brand focus:ring-1 focus:ring-brand/30"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-brand to-brand/90 text-[15px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60 md:h-[50px]"
              >
                <Sparkles className="h-[18px] w-[18px]" />
                {submitting ? 'Registrando...' : 'Quiero mis beneficios'}
              </button>

              {/* Note */}
              <p className="text-center text-[11px] text-muted-foreground">
                Tus datos están protegidos. No compartimos tu información con terceros.
              </p>
            </form>
          </div>
        </main>
      </div>
    )
  }

  /* ── Success view ────────────────────────────────────────────────────── */
  if (view === 'success') {
    return (
      <div className="flex h-screen flex-col overflow-hidden bg-card md:bg-background">
        {header}
        <main className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-8 md:p-12">
          <div className="flex w-full max-w-[520px] flex-col items-center gap-4 md:rounded-2xl md:border md:border-border md:bg-card md:p-10">
            {/* Icon */}
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-success/10">
              <CircleCheck className="h-9 w-9 text-success" />
            </div>

            {/* Title */}
            <p className="text-center text-[22px] font-bold text-foreground md:text-[24px]">
              ¡Ya sos parte!
            </p>

            {/* Subtitle */}
            <p className="text-center text-[14px] leading-relaxed text-muted-foreground">
              Te enviamos un email con tus beneficios exclusivos. Revisá tu bandeja de entrada.
            </p>

            {/* Benefits mini */}
            <div className="flex w-full flex-col gap-2 rounded-xl bg-success/10 p-4">
              {SUCCESS_ITEMS.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-success" />
                  <span className="text-[13px] font-medium text-success">{item}</span>
                </div>
              ))}
            </div>

            {/* Back button */}
            <button
              onClick={handleBack}
              className="flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-brand text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a mi recomendación
            </button>
          </div>
        </main>
      </div>
    )
  }

  /* ── Error view ──────────────────────────────────────────────────────── */
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-card md:bg-background">
      {header}
      <main className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-8 md:p-12">
        <div className="flex w-full max-w-[520px] flex-col items-center gap-4 md:rounded-2xl md:border md:border-border md:bg-card md:p-10">
          {/* Icon */}
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-destructive/10">
            <TriangleAlert className="h-9 w-9 text-destructive" />
          </div>

          {/* Title */}
          <p className="text-center text-[22px] font-bold text-foreground md:text-[24px]">
            Algo salió mal
          </p>

          {/* Subtitle */}
          <p className="text-center text-[14px] leading-relaxed text-muted-foreground">
            No pudimos procesar tu solicitud. Verificá tu conexión e intentá de nuevo.
          </p>

          {/* Retry button */}
          <button
            onClick={() => setView('form')}
            className="flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-destructive text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            <RefreshCw className="h-4 w-4" />
            Intentar de nuevo
          </button>

          {/* Back button */}
          <button
            onClick={handleBack}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border text-[14px] font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a mi recomendación
          </button>
        </div>
      </main>
    </div>
  )
}
