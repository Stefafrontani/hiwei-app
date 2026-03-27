'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, MailCheck, AlertCircle, X } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { FeedbackState } from './FeedbackState'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import {
  sendRecommendationFormSchema,
  type SendRecommendationFormValues,
} from '@/domain/validation/schemas'

interface SendRecommendationOverlayProps {
  open: boolean
  onClose: () => void
  recommendationId?: string | null
}

type Status = 'idle' | 'loading' | 'success' | 'error'

function SendForm({ onClose, recommendationId }: { onClose: () => void; recommendationId?: string | null }) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const form = useForm<SendRecommendationFormValues>({
    resolver: zodResolver(sendRecommendationFormSchema),
    defaultValues: { name: '', email: '', phone: '', optInMarketing: false },
    mode: 'onBlur',
  })

  const onSubmit = async (values: SendRecommendationFormValues) => {
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/send-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recommendationId,
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone?.trim() || undefined,
          optInMarketing: values.optInMarketing,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al enviar')
      setStatus('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al enviar')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <FeedbackState
        icon={MailCheck}
        iconBg="bg-success/10"
        iconColor="text-success"
        title="¡Recomendación enviada!"
        message="Revisá tu email. Te enviamos un resumen completo con tu recomendación personalizada. Si no lo encontrás, revisá la sección de Promociones o Spam."
        onClose={onClose}
      />
    )
  }

  if (status === 'error') {
    return (
      <FeedbackState
        icon={AlertCircle}
        iconBg="bg-destructive/10"
        iconColor="text-destructive"
        title="Hubo un problema"
        message={errorMsg || 'No pudimos enviar tu recomendación. Por favor, intentá nuevamente.'}
        onClose={() => setStatus('idle')}
        buttonLabel="Reintentar"
      />
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <p className="text-[13px] leading-relaxed text-muted-foreground">
        Te enviamos un resumen con tu recomendación personalizada para que puedas revisarla cuando
        quieras.
      </p>

      <div className="flex flex-col gap-3">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-[12px] font-semibold text-foreground">
                Nombre y apellido *
              </FieldLabel>
              <Input
                {...field}
                placeholder="Ej: Juan Pérez"
                aria-invalid={fieldState.invalid}
                className="h-11 rounded-[10px] border-border text-[13px]"
              />
              <FieldError
                errors={[fieldState.error]}
                className="text-[11px]"
              />
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-[12px] font-semibold text-foreground">
                Email *
              </FieldLabel>
              <Input
                {...field}
                type="email"
                placeholder="tu@email.com"
                aria-invalid={fieldState.invalid}
                className="h-11 rounded-[10px] border-border text-[13px]"
              />
              <FieldError
                errors={[fieldState.error]}
                className="text-[11px]"
              />
            </Field>
          )}
        />

        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-[12px] font-medium text-muted-foreground">
                Teléfono (opcional)
              </FieldLabel>
              <Input
                {...field}
                type="tel"
                placeholder="+54 11 1234-5678"
                aria-invalid={fieldState.invalid}
                className="h-11 rounded-[10px] border-border text-[13px]"
              />
              <FieldError
                errors={[fieldState.error]}
                className="text-[11px]"
              />
            </Field>
          )}
        />
      </div>

      {/* Opt-in marketing checkbox */}
      <label className="flex cursor-pointer items-start gap-2.5">
        <input
          type="checkbox"
          {...form.register('optInMarketing')}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-brand"
        />
        <span className="text-[12px] leading-relaxed text-muted-foreground">
          Quiero recibir noticias, ofertas exclusivas y descuentos de Hiwei
        </span>
      </label>

      <Button
        type="submit"
        disabled={status === 'loading' || !form.formState.isValid || !recommendationId}
        variant="brand"
        className="flex h-[50px] w-full items-center gap-2 rounded-xl text-[14px] font-semibold"
      >
        <Send className="h-4 w-4" />
        {status === 'loading' ? 'Enviando...' : 'Enviar a mi mail'}
      </Button>
    </form>
  )
}

export function SendRecommendationOverlay({ open, onClose, recommendationId }: SendRecommendationOverlayProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const title = 'Recibí tu recomendación por email'

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-[480px] rounded-2xl p-8">
          <DialogHeader>
            <DialogTitle className="text-[20px] font-bold text-foreground">{title}</DialogTitle>
          </DialogHeader>
          <SendForm onClose={onClose} recommendationId={recommendationId} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="bottom" className="rounded-t-[20px] p-0">
        <div className="flex flex-col gap-4 px-5 pb-8 pt-5">
          {/* Handle */}
          <div className="flex justify-center">
            <div className="h-1 w-10 rounded-full bg-border" />
          </div>
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle className="text-[18px] font-bold text-foreground">{title}</SheetTitle>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </SheetHeader>
          <SendForm onClose={onClose} recommendationId={recommendationId} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
