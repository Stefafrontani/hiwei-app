'use client'

import { MessageCircle, Mail } from 'lucide-react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
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
          <span className="text-sm font-semibold text-foreground">Escribinos por WhatsApp</span>
          <span className="text-xs text-muted-foreground">Respuesta rápida en horario comercial</span>
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
          <span className="text-sm font-semibold text-foreground">Dejanos tu consulta</span>
          <span className="text-xs text-muted-foreground">Te contactamos por email o teléfono</span>
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

  const handleEmailClick = () => {
    onClose()
    onEmailFormOpen()
  }

  return (
    <>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
          <DialogContent showCloseButton={false} className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Consultanos</DialogTitle>
              <DialogDescription>
                Elegí cómo preferís contactarnos.
              </DialogDescription>
            </DialogHeader>
            <MethodOptions onClose={onClose} onEmailFormOpen={handleEmailClick} whatsAppProps={whatsAppProps} />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Consultanos</DrawerTitle>
              <DrawerDescription>
                Elegí cómo preferís contactarnos.
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-6">
              <MethodOptions onClose={onClose} onEmailFormOpen={handleEmailClick} whatsAppProps={whatsAppProps} />
            </div>
          </DrawerContent>
        </Drawer>
      )}

      <ContactAdvisorOverlay open={showEmailForm} onClose={onEmailFormClose} />
    </>
  )
}
