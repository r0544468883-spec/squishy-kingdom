'use client'

import { CartProvider } from '@/context/CartContext'
import Header from '@/modules/layout/components/header'
import Footer from '@/modules/layout/components/footer'
import MobileNav from '@/modules/layout/components/mobile-nav'
import CartDrawer from '@/modules/cart/components/cart-drawer'
import SmoothScroll from '@/components/providers/SmoothScroll'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <SmoothScroll>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileNav />
          <CartDrawer />
        </div>
      </SmoothScroll>
    </CartProvider>
  )
}
