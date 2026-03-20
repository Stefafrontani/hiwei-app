import type { ReactNode } from 'react'
import { GalleryHeader } from '@/components/gallery/GalleryHeader'
import { BottomNav } from '@/components/gallery/BottomNav'
import { ShopFab } from '@/components/gallery/ShopFab'

export default function GaleriaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GalleryHeader activeNav="feed" />
      <main className="flex-1">{children}</main>
      <BottomNav activeNav="feed" />
      <ShopFab />
    </div>
  )
}
