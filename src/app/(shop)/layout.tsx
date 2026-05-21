import KingdomHeader from '@/components/layout/KingdomHeader'
import KingdomFooter from '@/components/layout/KingdomFooter'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import { CartProvider } from '@/context/CartContext'
import SlideOverCart from '@/components/cart/SlideOverCart'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <KingdomHeader />
      <main className="flex-1 bg-kingdom-cream min-h-screen">
        {children}
      </main>
      <SlideOverCart />
      <KingdomFooter />
      <MobileBottomNav />
    </CartProvider>
  )
}
