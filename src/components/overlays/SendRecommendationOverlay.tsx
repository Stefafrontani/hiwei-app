'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, MailCheck, AlertCircle } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
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
    mode: 'onChange',
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
        title="¡Listo, revisá tu email!"
        message="Te enviamos tu recomendación personalizada. Si no la encontrás, revisá en Promociones o Spam."
        onClose={onClose}
        glow
      />
    )
  }

  if (status === 'error') {
    return (
      <FeedbackState
        icon={AlertCircle}
        iconBg="bg-destructive/10"
        iconColor="text-destructive"
        title="No pudimos enviar tu recomendación"
        message={errorMsg || 'Verificá tu conexión e intentá de nuevo. Tus datos no se perdieron.'}
        onClose={() => setStatus('idle')}
        buttonLabel="Reintentar"
        buttonVariant="default"
        glow
      />
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-1">
        <p className="text-lg font-semibold leading-none">Recibí tu recomendación</p>
        <p className="text-sm text-muted-foreground">
          Te enviamos un resumen personalizado para que puedas revisarlo cuando quieras.
        </p>
      </div>

      <div className="grid gap-3">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Nombre y apellido</FieldLabel>
              <Input
                {...field}
                placeholder="Ej: Juan Pérez"
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Email</FieldLabel>
              <Input
                {...field}
                type="email"
                placeholder="tu@email.com"
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-muted-foreground">
                Teléfono (opcional)
              </FieldLabel>
              <Input
                {...field}
                type="tel"
                placeholder="+54 11 1234-5678"
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </div>

      <label className="flex cursor-pointer items-start gap-2.5">
        <input
          type="checkbox"
          {...form.register('optInMarketing')}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-brand"
        />
        <span className="text-xs leading-relaxed text-muted-foreground">
          Quiero recibir noticias, ofertas exclusivas y descuentos de Hiwei
        </span>
      </label>

      <Button
        type="submit"
        disabled={status === 'loading' || !form.formState.isValid || !recommendationId}
        variant="brand"
        size="lg"
        className="w-full"
      >
        <Send />
        {status === 'loading' ? 'Enviando...' : 'Enviar a mi mail'}
      </Button>
    </form>
  )
}

export function SendRecommendationOverlay({ open, onClose, recommendationId }: SendRecommendationOverlayProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent showCloseButton={false} className="sm:max-w-[480px]">
          <DialogHeader className="sr-only">
            <DialogTitle>Recibí tu recomendación</DialogTitle>
            <DialogDescription>Te enviamos un resumen personalizado para que puedas revisarlo cuando quieras.</DialogDescription>
          </DialogHeader>
          <SendForm onClose={onClose} recommendationId={recommendationId} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="bottom" showCloseButton={false} className="rounded-t-[20px] p-0">
        <div className="flex justify-center pt-3">
          <div className="h-1 w-10 rounded-full bg-border" />
        </div>
        <SheetHeader className="sr-only">
          <SheetTitle>Recibí tu recomendación</SheetTitle>
          <SheetDescription>Te enviamos un resumen personalizado para que puedas revisarlo cuando quieras.</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-6">
          <SendForm onClose={onClose} recommendationId={recommendationId} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
