import Image from 'next/image'
import Link from 'next/link'
import { Search, Bell } from 'lucide-react'
import type { NavItem } from './types'

const NAV_LINKS: { key: NavItem; label: string; href: string }[] = [
  { key: 'feed', label: 'Feed', href: '/galeria' },
  { key: 'catalog', label: 'Catalog', href: '#' },
  { key: 'comparator', label: 'Comparator', href: '#' },
  { key: 'profile', label: 'Profile', href: '#' },
]

interface GalleryHeaderProps {
  activeNav?: NavItem
}

export function GalleryHeader({ activeNav = 'feed' }: GalleryHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
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
            className="hidden h-7 w-auto md:block"
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

        {/* Icon buttons */}
        <div className="flex items-center gap-2">
          <button aria-label="Buscar" className="rounded-md p-2 text-muted-foreground transition-all hover:bg-secondary active:scale-95">
            <Search className="h-5 w-5" />
          </button>
          <button aria-label="Notificaciones" className="rounded-md p-2 text-muted-foreground transition-all hover:bg-secondary active:scale-95">
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
