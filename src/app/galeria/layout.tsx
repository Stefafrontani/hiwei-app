import type { ReactNode } from 'react'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { ShopFab } from '@/components/gallery/ShopFab'

export default function GaleriaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader activeNav="galeria" />
      <main className="flex-1">{children}</main>
      <ShopFab />
    </div>
  )
}
