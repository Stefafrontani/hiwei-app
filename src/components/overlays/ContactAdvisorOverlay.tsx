'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, CircleCheck, AlertCircle } from 'lucide-react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { FeedbackState } from './FeedbackState'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import {
  contactFormSchema,
  type ContactFormValues,
} from '@/domain/validation/schemas'

interface ContactAdvisorOverlayProps {
  open: boolean
  onClose: () => void
}

type Status = 'idle' | 'loading' | 'success' | 'error'

const QUERY_MAX = 500

function ContactForm({ onClose, className, onStatusChange }: {
  onClose: () => void
  className?: string
  onStatusChange?: (status: Status) => void
}) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const updateStatus = (newStatus: Status) => {
    setStatus(newStatus)
    onStatusChange?.(newStatus)
  }

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: '', email: '', phone: '', query: '', optInMarketing: false },
    mode: 'onChange',
  })

  const onSubmit = async (values: ContactFormValues) => {
    updateStatus('loading')
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
      updateStatus('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al enviar')
      updateStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <FeedbackState
        icon={CircleCheck}
        iconBg="bg-success/10"
        iconColor="text-success"
        title="¡Recibimos tu consulta!"
        message="Un asesor se va a comunicar con vos por email o teléfono a la brevedad."
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
        title="No pudimos enviar tu consulta"
        message={errorMsg || 'Verificá tu conexión e intentá de nuevo. Tus datos no se perdieron.'}
        onClose={() => updateStatus('idle')}
        buttonLabel="Reintentar"
        buttonVariant="default"
        glow
      />
    )
  }

  const queryLength = form.watch('query')?.length ?? 0

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={cn('grid gap-4', className)}>
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

        <Controller
          name="query"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-baseline justify-between">
                <FieldLabel>Consulta</FieldLabel>
                <span className={`text-xs tabular-nums ${queryLength > QUERY_MAX ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {queryLength}/{QUERY_MAX}
                </span>
              </div>
              <Textarea
                {...field}
                placeholder="Contanos en qué podemos ayudarte..."
                rows={3}
                aria-invalid={fieldState.invalid}
                className="resize-none"
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
        disabled={status === 'loading' || !form.formState.isValid}
        variant="brand"
        size="lg"
        className="w-full"
      >
        <Send />
        {status === 'loading' ? 'Enviando...' : 'Enviar consulta'}
      </Button>
    </form>
  )
}

export function ContactAdvisorOverlay({ open, onClose }: ContactAdvisorOverlayProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [formStatus, setFormStatus] = useState<Status>('idle')
  const showHeader = formStatus === 'idle' || formStatus === 'loading'

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent showCloseButton={false} className="sm:max-w-[480px]">
          <DialogHeader className={showHeader ? '' : 'sr-only'}>
            <DialogTitle>Dejanos tu consulta</DialogTitle>
            <DialogDescription>Completá el formulario y un asesor te contactará a la brevedad.</DialogDescription>
          </DialogHeader>
          <ContactForm onClose={onClose} onStatusChange={setFormStatus} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()} repositionInputs={false}>
      <DrawerContent>
        <DrawerHeader className={showHeader ? 'text-left' : 'sr-only'}>
          <DrawerTitle>Dejanos tu consulta</DrawerTitle>
          <DrawerDescription>Completá el formulario y un asesor te contactará a la brevedad.</DrawerDescription>
        </DrawerHeader>
        <ContactForm onClose={onClose} className="px-4" onStatusChange={setFormStatus} />
        <DrawerFooter className="pt-2" />
      </DrawerContent>
    </Drawer>
  )
}
