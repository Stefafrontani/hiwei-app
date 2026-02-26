'use client'

import { useState } from 'react'
import { Send, MailCheck, AlertCircle, X } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FeedbackState } from './FeedbackState'
import { useMediaQuery } from '@/hooks/useMediaQuery'

interface SendRecommendationOverlayProps {
  open: boolean
  onClose: () => void
}

type Status = 'idle' | 'loading' | 'success' | 'error'

function SendForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/send-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
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
        message="Revisá tu email. Te enviamos un resumen completo con tu recomendación personalizada."
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-[13px] leading-relaxed text-muted-foreground">
        Te enviamos un resumen con tu recomendación personalizada para que puedas revisarla cuando
        quieras.
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label className="text-[12px] font-semibold text-foreground">Nombre y apellido *</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Juan Pérez"
            required
            className="h-11 rounded-[10px] border-border text-[13px]"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-[12px] font-semibold text-foreground">Email *</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            type="email"
            className="h-11 rounded-[10px] border-border text-[13px]"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-[12px] font-medium text-muted-foreground">Teléfono (opcional)</Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+54 11 1234-5678"
            type="tel"
            className="h-11 rounded-[10px] border-border text-[13px]"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={status === 'loading'}
        variant="brand"
        className="flex h-[50px] w-full items-center gap-2 rounded-xl text-[14px] font-semibold"
      >
        <Send className="h-4 w-4" />
        {status === 'loading' ? 'Enviando...' : 'Enviar recomendación'}
      </Button>
    </form>
  )
}

export function SendRecommendationOverlay({ open, onClose }: SendRecommendationOverlayProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const title = 'Enviar recomendación'

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-[480px] rounded-2xl p-8">
          <DialogHeader>
            <DialogTitle className="text-[20px] font-bold text-foreground">{title}</DialogTitle>
          </DialogHeader>
          <SendForm onClose={onClose} />
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
          <SendForm onClose={onClose} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
