'use client'

import { MessageCircle, Mail, X } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ContactAdvisorOverlay } from './ContactAdvisorOverlay'
import { buildWhatsAppUrl } from '@/lib/buildWhatsAppUrl'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import type { QuizAnswers } from '@/domain/entities/QuizAnswers'

interface ContactMethodOverlayProps {
  open: boolean
  onClose: () => void
  showEmailForm: boolean
  onEmailFormOpen: () => void
  onEmailFormClose: () => void
  whatsAppProps?: {
    answers?: QuizAnswers
    currentStep?: number
    productName?: string
  }
}

function MethodOptions({
  onClose,
  onEmailFormOpen,
  whatsAppProps,
}: {
  onClose: () => void
  onEmailFormOpen: () => void
  whatsAppProps?: ContactMethodOverlayProps['whatsAppProps']
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[13px] leading-relaxed text-muted-foreground">
        Elegí cómo preferís contactarnos.
      </p>

      {/* WhatsApp option */}
      <a
        href={buildWhatsAppUrl(whatsAppProps ?? {})}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose}
        className="flex items-center gap-4 rounded-xl border border-whatsapp/30 bg-whatsapp/5 p-4 transition-colors hover:bg-whatsapp/10"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-whatsapp/15">
          <MessageCircle className="h-5 w-5 text-whatsapp" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] font-semibold text-foreground">Escribinos por WhatsApp</span>
          <span className="text-[12px] text-muted-foreground">Respuesta rápida en horario comercial</span>
        </div>
      </a>

      {/* Email form option */}
      <button
        onClick={onEmailFormOpen}
        className="flex items-center gap-4 rounded-xl border border-brand/30 bg-brand/5 p-4 text-left transition-colors hover:bg-brand/10"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/15">
          <Mail className="h-5 w-5 text-brand" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] font-semibold text-foreground">Dejanos tu consulta</span>
          <span className="text-[12px] text-muted-foreground">Te contactamos por email o teléfono</span>
        </div>
      </button>
    </div>
  )
}

export function ContactMethodOverlay({
  open,
  onClose,
  showEmailForm,
  onEmailFormOpen,
  onEmailFormClose,
  whatsAppProps,
}: ContactMethodOverlayProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const title = 'Consultanos'

  const handleEmailClick = () => {
    onClose()
    onEmailFormOpen()
  }

  return (
    <>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
          <DialogContent className="max-w-[520px] rounded-2xl p-8">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-[20px] font-bold text-foreground">{title}</DialogTitle>
              </div>
            </DialogHeader>
            <MethodOptions onClose={onClose} onEmailFormOpen={handleEmailClick} whatsAppProps={whatsAppProps} />
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
          <SheetContent side="bottom" className="rounded-t-[20px] p-0">
            <div className="flex flex-col gap-4 px-5 pb-8 pt-5">
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
              <MethodOptions onClose={onClose} onEmailFormOpen={handleEmailClick} whatsAppProps={whatsAppProps} />
            </div>
          </SheetContent>
        </Sheet>
      )}

      <ContactAdvisorOverlay open={showEmailForm} onClose={onEmailFormClose} />
    </>
  )
}
