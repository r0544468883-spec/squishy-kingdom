'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Store, Gamepad2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

const navItems = [
  { href: '/', label: 'בית', icon: Home },
  { href: '/products', label: 'חנות', icon: Store },
  { href: '/games', label: 'משחקים', icon: Gamepad2 },
  { href: '/cart', label: 'עגלה', icon: ShoppingBag, isCart: true },
]

export default function MobileBottomNav() {
  const pathname = usePathname()
  const { itemCount, setCartOpen } = useCart()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-kingdom-red border-t-2 border-kingdom-gold pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          if (item.isCart) {
            return (
              <button
                key={item.href}
                onClick={() => setCartOpen(true)}
                className="flex flex-col items-center justify-center gap-0.5 w-16 h-full cursor-pointer relative"
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-kingdom-gold' : 'text-white/70'}`} />
                {itemCount > 0 && (
                  <span className="absolute top-1.5 right-2.5 bg-kingdom-gold text-kingdom-charcoal text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
                <span className={`text-[10px] ${isActive ? 'text-kingdom-gold font-bold' : 'text-white/70'}`}>
                  {item.label}
                </span>
              </button>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 w-16 h-full"
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-kingdom-gold' : 'text-white/70'}`} />
              <span className={`text-[10px] ${isActive ? 'text-kingdom-gold font-bold' : 'text-white/70'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
