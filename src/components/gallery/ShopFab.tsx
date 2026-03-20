import { ShoppingCart } from 'lucide-react'

export function ShopFab() {
  return (
    <a
      href="https://www.hiwei.com.ar"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-40 hidden items-center gap-2 rounded-full bg-brand px-6 py-4 font-bold text-brand-foreground shadow-2xl transition-all hover:scale-105 active:scale-95 md:flex"
    >
      <ShoppingCart className="h-5 w-5" />
      Shop Hiwei
    </a>
  )
}
