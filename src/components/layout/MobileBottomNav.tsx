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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-l from-kingdom-red-deep via-kingdom-red to-kingdom-red-deep border-t-2 border-kingdom-gold/40 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(224,17,95,0.3)]">
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
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-kingdom-gold/20' : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-kingdom-gold' : 'text-white/60'}`} />
                </div>
                {itemCount > 0 && (
                  <span className="absolute top-1 right-2 bg-kingdom-gold text-kingdom-charcoal text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg shadow-kingdom-gold/40">
                    {itemCount}
                  </span>
                )}
                <span className={`text-[10px] ${isActive ? 'text-kingdom-gold font-bold' : 'text-white/60'}`}>
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
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-kingdom-gold/20' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-kingdom-gold' : 'text-white/60'}`} />
              </div>
              <span className={`text-[10px] ${isActive ? 'text-kingdom-gold font-bold' : 'text-white/60'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
