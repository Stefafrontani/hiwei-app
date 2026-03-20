import type { ComponentType } from 'react'
import Link from 'next/link'
import { MonitorPlay, ShoppingBag, Columns3, User } from 'lucide-react'
import type { NavItem } from './types'

const NAV_ITEMS: { key: NavItem; label: string; href: string; icon: ComponentType<{ className?: string }> }[] = [
  { key: 'feed', label: 'Feed', href: '/galeria', icon: MonitorPlay },
  { key: 'catalog', label: 'Catalog', href: '#', icon: ShoppingBag },
  { key: 'comparator', label: 'Comparator', href: '#', icon: Columns3 },
  { key: 'profile', label: 'Profile', href: '#', icon: User },
]

interface BottomNavProps {
  activeNav?: NavItem
}

export function BottomNav({ activeNav = 'feed' }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-xl border-t border-border bg-card/95 px-4 py-3 shadow-2xl backdrop-blur-md md:hidden">
      {NAV_ITEMS.map(({ key, label, href, icon: Icon }) => {
        const isActive = key === activeNav
        return (
          <Link
            key={key}
            href={href}
            className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 transition-transform active:scale-90 ${
              isActive ? 'bg-brand/10 text-brand' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="h-6 w-6" />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
