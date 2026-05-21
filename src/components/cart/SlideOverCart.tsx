'use client'

import { useEffect } from 'react'
import { X, ShoppingBag, Trash2, MessageCircle } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import RoyalButton from '@/components/ui/RoyalButton'
import CartProgressBar from './CartProgressBar'
import MysteryBoxUpsell from './MysteryBoxUpsell'
import DynamicBundling from './DynamicBundling'
import Link from 'next/link'
import Image from 'next/image'
import { generateBuyForMeLink } from '@/lib/whatsapp'

export default function SlideOverCart() {
  const { items, cartOpen, setCartOpen, removeFromCart, updateQuantity, subtotal, itemCount } = useCart()

  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [cartOpen])

  if (!cartOpen) return null

  const shipping = subtotal >= 100 ? 0 : 30
  const total = subtotal + shipping

  return (
    <div className="fixed inset-0 z-[90]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setCartOpen(false)}
      />

      {/* Cart Panel */}
      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-kingdom-cream border-l-2 border-kingdom-gold shadow-2xl flex flex-col animate-[slideIn_0.3s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-kingdom-red border-b-2 border-kingdom-gold">
          <div className="flex items-center gap-2 text-kingdom-gold">
            <ShoppingBag className="w-5 h-5" />
            <span className="font-bubble text-lg">העגלה המלכותית</span>
            <span className="bg-kingdom-gold text-kingdom-charcoal text-xs font-bold px-2 py-0.5 rounded-full">
              {itemCount}
            </span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="text-white/80 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        {items.length > 0 && (
          <div className="px-4 pt-4">
            <CartProgressBar total={subtotal} />
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-kingdom-gold/30 mb-4" />
              <p className="font-bubble text-lg text-kingdom-charcoal mb-2">העגלה ריקה!</p>
              <p className="text-kingdom-charcoal/50 text-sm mb-6">הממלכה מחכה לך...</p>
              <RoyalButton variant="gold" onClick={() => setCartOpen(false)}>
                לחנות
              </RoyalButton>
            </div>
          ) : (
            items.map(item => (
              <div key={item.product.id} className="flex gap-3 bg-white rounded-xl p-3 border border-kingdom-gold/20">
                {/* Thumbnail */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-kingdom-parchment flex-shrink-0">
                  <Image
                    src={item.product.image_url}
                    alt={item.product.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-kingdom-charcoal line-clamp-1">
                    {item.product.name}
                  </h4>
                  <p className="text-kingdom-red font-bold text-sm mt-1">
                    ₪{(item.product.price * item.quantity).toFixed(0)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg bg-kingdom-parchment text-kingdom-charcoal flex items-center justify-center font-bold hover:bg-kingdom-gold/20 transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-kingdom-parchment text-kingdom-charcoal flex items-center justify-center font-bold hover:bg-kingdom-gold/20 transition-colors cursor-pointer"
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="mr-auto text-red-400 hover:text-red-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Upsells */}
        {items.length > 0 && (
          <div className="px-4 space-y-2">
            <DynamicBundling />
            <MysteryBoxUpsell />
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t-2 border-kingdom-gold p-4 bg-white space-y-3">
            {/* Summary */}
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-kingdom-charcoal/70">
                <span>סה&quot;כ מוצרים</span>
                <span>₪{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-kingdom-charcoal/70">
                <span>משלוח</span>
                <span>{shipping === 0 ? 'חינם! 🎉' : `₪${shipping}`}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-kingdom-charcoal pt-1 border-t border-kingdom-gold/20">
                <span>סה&quot;כ לתשלום</span>
                <span className="text-kingdom-red">₪{total.toFixed(0)}</span>
              </div>
            </div>

            {/* Actions */}
            <Link href="/checkout" onClick={() => setCartOpen(false)}>
              <RoyalButton variant="gold" size="lg" fullWidth>
                לתשלום מאובטח
              </RoyalButton>
            </Link>

            <a
              href={generateBuyForMeLink(items, total)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <RoyalButton variant="whatsapp" size="md" fullWidth>
                <MessageCircle className="w-5 h-5" />
                אבא/סבתא, תקנו לי! 🙏
              </RoyalButton>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
