'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, CircleCheck, AlertCircle, X } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { FeedbackState } from './FeedbackState'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import {
  contactFormSchema,
  type ContactFormValues,
} from '@/domain/validation/schemas'

interface ContactAdvisorOverlayProps {
  open: boolean
  onClose: () => void
}

type Status = 'idle' | 'loading' | 'success' | 'error'

function ContactForm({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: '', email: '', phone: '', query: '', optInMarketing: false },
    mode: 'onBlur',
  })

  const onSubmit = async (values: ContactFormValues) => {
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone?.trim() || undefined,
          query: values.query.trim(),
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
        icon={CircleCheck}
        iconBg="bg-success/10"
        iconColor="text-success"
        title="¡Solicitud enviada!"
        message="Un asesor te va a contactar a la brevedad. Revisá tu teléfono y email."
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
        message={errorMsg || 'No pudimos enviar tu solicitud. Por favor, intentá nuevamente.'}
        onClose={() => setStatus('idle')}
        buttonLabel="Reintentar"
      />
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <p className="text-[13px] leading-relaxed text-muted-foreground">
        A la brevedad nos estaremos comunicando con vos para ayudarte en lo que necesites.
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
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} className="text-[11px]" />
              )}
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
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} className="text-[11px]" />
              )}
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
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} className="text-[11px]" />
              )}
            </Field>
          )}
        />

        <Controller
          name="query"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-[12px] font-semibold text-foreground">
                Consulta *
              </FieldLabel>
              <textarea
                {...field}
                placeholder="Escribí tu consulta..."
                rows={3}
                aria-invalid={fieldState.invalid}
                className="rounded-[10px] border border-border px-3.5 py-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 resize-none aria-invalid:border-destructive aria-invalid:ring-destructive/20"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} className="text-[11px]" />
              )}
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
        disabled={status === 'loading' || !form.formState.isValid}
        variant="brand"
        className="flex h-[50px] w-full items-center gap-2 rounded-xl text-[14px] font-semibold"
      >
        <Send className="h-4 w-4" />
        {status === 'loading' ? 'Enviando...' : 'Enviar consulta'}
      </Button>
    </form>
  )
}

export function ContactAdvisorOverlay({ open, onClose }: ContactAdvisorOverlayProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const title = 'Dejanos tu consulta'

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-[520px] rounded-2xl p-8">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-[20px] font-bold text-foreground">{title}</DialogTitle>
            </div>
          </DialogHeader>
          <ContactForm onClose={onClose} />
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
          <ContactForm onClose={onClose} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
