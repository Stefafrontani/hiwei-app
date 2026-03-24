'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ContactMethodOverlay } from '@/components/overlays/ContactMethodOverlay'
import type { QuizAnswers } from '@/domain/entities/QuizAnswers'
import type { NavItem } from '@/components/gallery/types'

const NAV_LINKS: { key: NavItem; label: string; href: string }[] = [
  { key: 'galeria', label: 'Galería', href: '/galeria' },
  { key: 'comparador', label: 'Comparador', href: '/compara-las-dashcams' },
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
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center px-5 md:h-14 md:px-6">
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
          <nav className="ml-8 hidden gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="text-sm font-semibold transition-colors hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex-1" />

          {/* CTAs */}
          <div className="flex items-center gap-2">
            <Link
              href="/beneficios"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors hover:bg-muted md:gap-2 md:px-3 md:py-2"
            >
              <span className="text-sm font-semibold">
                <span className="md:hidden">Beneficios</span>
                <span className="hidden md:inline">Beneficios exclusivos</span>
              </span>
            </Link>
            <button
              onClick={() => setShowContact(true)}
              className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 transition-colors hover:bg-brand/90 md:gap-2 md:px-[18px] md:py-2"
            >
              <span className="text-sm font-bold text-brand-foreground">Contactanos</span>
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
