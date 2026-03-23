import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ShopFab() {
  return (
    <Button
      asChild
      variant="brand"
      size="lg"
      className="fixed bottom-8 right-8 z-40 hidden rounded-full px-6 py-4 shadow-2xl transition-transform hover:scale-105 active:scale-95 md:flex"
    >
      <a href="https://www.hiwei.com.ar" target="_blank" rel="noopener noreferrer">
        <ShoppingCart className="h-5 w-5" />
        Shop Hiwei
      </a>
    </Button>
  )
}
