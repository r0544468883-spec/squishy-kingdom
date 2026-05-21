'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Menu, X, Search, Crown } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

export default function KingdomHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { itemCount, setCartOpen } = useCart()

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-l from-kingdom-red-deep via-kingdom-red to-kingdom-red-deep border-b-2 border-kingdom-gold/50 shadow-lg shadow-kingdom-red/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Crown className="w-7 h-7 text-kingdom-gold group-hover:animate-float drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
            <span className="font-bubble text-xl md:text-2xl text-gold-shimmer">
              הממלכה של עדי
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: '/', label: 'ראשי' },
              { href: '/products', label: 'החנות' },
              { href: '/games', label: 'משחקים' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-white/90 hover:text-kingdom-gold transition-colors font-medium group"
              >
                {link.label}
                <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-kingdom-gold transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full text-white/70 hover:text-kingdom-gold hover:bg-white/10 transition-all cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 rounded-full text-white/80 hover:text-kingdom-gold hover:bg-white/10 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-kingdom-gold text-kingdom-charcoal text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce-in shadow-lg shadow-kingdom-gold/30">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-white/80 hover:text-kingdom-gold transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-kingdom-red-deep/95 backdrop-blur-lg border-t border-kingdom-gold/20 animate-fade-in">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {[
              { href: '/', label: 'ראשי' },
              { href: '/products', label: 'החנות' },
              { href: '/games', label: 'משחקים' },
              { href: '/search', label: 'חיפוש', icon: Search },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/90 hover:text-kingdom-gold hover:bg-white/5 px-4 py-3 rounded-xl transition-all font-medium flex items-center gap-2"
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
