'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, MailCheck, AlertCircle } from 'lucide-react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { FeedbackState } from './FeedbackState'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
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

function SendForm({ onClose, recommendationId, className, onStatusChange }: {
  onClose: () => void
  recommendationId?: string | null
  className?: string
  onStatusChange?: (status: Status) => void
}) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const updateStatus = (newStatus: Status) => {
    setStatus(newStatus)
    onStatusChange?.(newStatus)
  }

  const form = useForm<SendRecommendationFormValues>({
    resolver: zodResolver(sendRecommendationFormSchema),
    defaultValues: { name: '', email: '', phone: '', optInMarketing: false },
    mode: 'onChange',
  })

  const onSubmit = async (values: SendRecommendationFormValues) => {
    updateStatus('loading')
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
      updateStatus('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al enviar')
      updateStatus('error')
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
        onClose={() => updateStatus('idle')}
        buttonLabel="Reintentar"
        buttonVariant="default"
        glow
      />
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={cn('grid gap-4', className)}>
      <div className="grid gap-3">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="send-name">Nombre y apellido</FieldLabel>
              <Input
                {...field}
                id="send-name"
                autoComplete="name"
                enterKeyHint="next"
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
              <FieldLabel htmlFor="send-email">Email</FieldLabel>
              <Input
                {...field}
                id="send-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                enterKeyHint="next"
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
              <FieldLabel htmlFor="send-phone" className="text-muted-foreground">
                Teléfono (opcional)
              </FieldLabel>
              <Input
                {...field}
                id="send-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                enterKeyHint="done"
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
  const [formStatus, setFormStatus] = useState<Status>('idle')
  const showHeader = formStatus === 'idle' || formStatus === 'loading'

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent showCloseButton={false} className="sm:max-w-[480px]">
          <DialogHeader className={showHeader ? '' : 'sr-only'}>
            <DialogTitle>Recibí tu recomendación</DialogTitle>
            <DialogDescription>Te enviamos un resumen personalizado para que puedas revisarlo cuando quieras.</DialogDescription>
          </DialogHeader>
          <SendForm onClose={onClose} recommendationId={recommendationId} onStatusChange={setFormStatus} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()} repositionInputs={false}>
      <DrawerContent>
        <DrawerHeader className={showHeader ? 'text-left' : 'sr-only'}>
          <DrawerTitle>Recibí tu recomendación</DrawerTitle>
          <DrawerDescription>Te enviamos un resumen personalizado para que puedas revisarlo cuando quieras.</DrawerDescription>
        </DrawerHeader>
        <SendForm onClose={onClose} recommendationId={recommendationId} className="px-4" onStatusChange={setFormStatus} />
        <DrawerFooter className="pt-2" />
      </DrawerContent>
    </Drawer>
  )
}
