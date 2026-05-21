'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Menu, X, Search, Crown } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

export default function KingdomHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { itemCount, setCartOpen } = useCart()

  return (
    <header className="sticky top-0 z-50 bg-kingdom-red border-b-2 border-kingdom-gold">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Crown className="w-7 h-7 text-kingdom-gold group-hover:animate-float" />
            <span className="font-[Secular_One] text-xl md:text-2xl text-kingdom-gold">
              הממלכה של עדי
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-white/90 hover:text-kingdom-gold transition-colors font-medium">
              ראשי
            </Link>
            <Link href="/products" className="text-white/90 hover:text-kingdom-gold transition-colors font-medium">
              החנות
            </Link>
            <Link href="/category/squishies" className="text-white/90 hover:text-kingdom-gold transition-colors font-medium">
              קטגוריות
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search (desktop) */}
            <Link
              href="/search"
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full text-white/80 hover:text-kingdom-gold hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 rounded-full text-white/80 hover:text-kingdom-gold hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-kingdom-gold text-kingdom-charcoal text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
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
        <div className="md:hidden bg-kingdom-red border-t border-kingdom-gold/30">
          <nav className="flex flex-col px-4 py-4 gap-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/90 hover:text-kingdom-gold hover:bg-white/5 px-4 py-3 rounded-lg transition-colors font-medium"
            >
              ראשי
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/90 hover:text-kingdom-gold hover:bg-white/5 px-4 py-3 rounded-lg transition-colors font-medium"
            >
              החנות
            </Link>
            <Link
              href="/category/squishies"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/90 hover:text-kingdom-gold hover:bg-white/5 px-4 py-3 rounded-lg transition-colors font-medium"
            >
              קטגוריות
            </Link>
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/90 hover:text-kingdom-gold hover:bg-white/5 px-4 py-3 rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              חיפוש
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
