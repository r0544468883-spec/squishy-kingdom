'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Store, Gamepad2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'בית', icon: Home },
  { href: '/products', label: 'חנות', icon: Store },
  { href: '/games', label: 'משחקים', icon: Gamepad2 },
  { href: '/cart', label: 'עגלה', icon: ShoppingBag, isCart: true },
]

export default function MobileNav() {
  const pathname = usePathname()
  const { itemCount, setCartOpen } = useCart()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border pb-[env(safe-area-inset-bottom)]">
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
                <Icon className={cn('w-5 h-5 transition-colors', isActive ? 'text-kingdom-red' : 'text-muted-foreground')} />
                {itemCount > 0 && (
                  <Badge className="absolute top-1 right-2 h-4 w-4 p-0 flex items-center justify-center text-[9px] bg-kingdom-red hover:bg-kingdom-red text-white">
                    {itemCount}
                  </Badge>
                )}
                <span className={cn('text-[10px] transition-colors', isActive ? 'text-kingdom-red font-semibold' : 'text-muted-foreground')}>
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
              <Icon className={cn('w-5 h-5 transition-colors', isActive ? 'text-kingdom-red' : 'text-muted-foreground')} />
              <span className={cn('text-[10px] transition-colors', isActive ? 'text-kingdom-red font-semibold' : 'text-muted-foreground')}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
