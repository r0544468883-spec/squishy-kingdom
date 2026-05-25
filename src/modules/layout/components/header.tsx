'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Menu, X, Search, Crown, Heart } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import ContentContainer from '@/modules/common/components/content-container'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'

const navLinks = [
  { href: '/', label: 'ראשי' },
  { href: '/products', label: 'החנות' },
  { href: '/games', label: 'משחקים' },
]

export default function Header() {
  const { itemCount, setCartOpen } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <ContentContainer>
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Crown className="w-6 h-6 text-kingdom-red transition-transform group-hover:rotate-12" />
            <span className="font-bubble text-xl md:text-2xl text-kingdom-red">
              הממלכה של עדי
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-foreground/70 hover:text-foreground transition-colors text-sm font-medium group"
              >
                {link.label}
                <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-kingdom-red transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <Link
              href="/search"
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full text-foreground/60 hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full text-foreground/60 hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 rounded-full text-foreground/60 hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-kingdom-red hover:bg-kingdom-red text-white border-2 border-background">
                  {itemCount}
                </Badge>
              )}
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetContent side="right" className="w-[300px] p-0">
                <SheetTitle className="sr-only">תפריט ניווט</SheetTitle>
                <div className="flex flex-col h-full">
                  {/* Mobile Logo */}
                  <div className="flex items-center gap-2 p-6 border-b border-border">
                    <Crown className="w-5 h-5 text-kingdom-red" />
                    <span className="font-bubble text-lg text-kingdom-red">הממלכה של עדי</span>
                  </div>

                  {/* Mobile Links */}
                  <nav className="flex flex-col p-4 gap-1 flex-1">
                    {navLinks.map(link => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="text-foreground/80 hover:text-foreground hover:bg-muted px-4 py-3 rounded-lg transition-colors text-base font-medium"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Link
                      href="/search"
                      onClick={() => setMobileOpen(false)}
                      className="text-foreground/80 hover:text-foreground hover:bg-muted px-4 py-3 rounded-lg transition-colors text-base font-medium flex items-center gap-3"
                    >
                      <Search className="w-4 h-4" />
                      חיפוש
                    </Link>
                    <Link
                      href="/wishlist"
                      onClick={() => setMobileOpen(false)}
                      className="text-foreground/80 hover:text-foreground hover:bg-muted px-4 py-3 rounded-lg transition-colors text-base font-medium flex items-center gap-3"
                    >
                      <Heart className="w-4 h-4" />
                      מועדפים
                    </Link>
                  </nav>

                  {/* Mobile Footer */}
                  <div className="p-4 border-t border-border">
                    <a
                      href="https://wa.me/972XXXXXXXXX"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                    >
                      וואטסאפ
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </ContentContainer>
    </header>
  )
}
