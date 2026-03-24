'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Headphones, Gift } from 'lucide-react'
import { ContactMethodOverlay } from '@/components/overlays/ContactMethodOverlay'
import type { QuizAnswers } from '@/domain/entities/QuizAnswers'
import type { NavItem } from '@/components/gallery/types'

const NAV_LINKS: { key: NavItem; label: string; href: string }[] = [
  { key: 'galeria', label: 'Galería', href: '/galeria' },
  { key: 'comparador', label: 'Comparador', href: '#' },
  { key: 'cotizador', label: 'Cotizador', href: '/cotiza-tu-dashcam' },
]

interface SiteHeaderProps {
  activeNav?: NavItem
  answers?: QuizAnswers
  currentStep?: number
}

export function SiteHeader({ activeNav, answers, currentStep }: SiteHeaderProps) {
  const [showContact, setShowContact] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-5 md:h-16 md:px-6">
          {/* Logo */}
          <Link href="/galeria" className="flex items-center gap-2">
            <Image
              src="/hiwei-isotipo.png"
              alt="Hiwei"
              width={32}
              height={32}
              className="h-8 w-8 md:hidden"
            />
            <Image
              src="/hiwei-logo.png"
              alt="Hiwei"
              width={80}
              height={24}
              className="hidden h-5 w-auto md:block"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={
                  link.key === activeNav
                    ? 'border-b-2 border-brand pb-1 font-semibold text-brand'
                    : 'font-medium text-muted-foreground transition-colors hover:text-foreground'
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-2">
            <Link
              href="/beneficios"
              className="flex items-center gap-1.5 rounded-lg border border-brand px-3 py-2 transition-opacity hover:opacity-90 md:gap-2 md:px-[18px] md:py-2.5"
            >
              <Gift className="h-3.5 w-3.5 text-brand md:h-4 md:w-4" />
              <span className="text-[11px] font-semibold text-brand md:text-[14px]">
                <span className="md:hidden">Beneficios</span>
                <span className="hidden md:inline">Beneficios exclusivos</span>
              </span>
            </Link>
            <button
              onClick={() => setShowContact(true)}
              className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 transition-colors hover:bg-brand/90 md:gap-2 md:px-[18px] md:py-2.5"
            >
              <Headphones className="h-3.5 w-3.5 text-brand-foreground md:h-4 md:w-4" />
              <span className="text-[11px] font-bold text-brand-foreground md:text-[14px]">Contactanos</span>
            </button>
          </div>
        </div>
      </header>

      <ContactMethodOverlay
        open={showContact}
        onClose={() => setShowContact(false)}
        showEmailForm={showEmailForm}
        onEmailFormOpen={() => setShowEmailForm(true)}
        onEmailFormClose={() => setShowEmailForm(false)}
        whatsAppProps={{ answers, currentStep }}
      />
    </>
  )
}
