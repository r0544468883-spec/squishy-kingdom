'use client'

import { useCart } from '@/hooks/useCart'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Trash2, Plus, Minus, Crown, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import CartProgressBar from './cart-progress-bar'

export default function CartDrawer() {
  const { items, itemCount, subtotal, cartOpen, setCartOpen, removeFromCart, updateQuantity } = useCart()

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="left" className="w-full sm:w-[420px] p-0 flex flex-col">
        <SheetHeader className="p-4 pb-0">
          <SheetTitle className="flex items-center gap-2 font-heading text-lg">
            <ShoppingBag className="w-5 h-5 text-kingdom-red" />
            העגלה שלי
            {itemCount > 0 && (
              <span className="text-sm text-muted-foreground font-normal">({itemCount} פריטים)</span>
            )}
          </SheetTitle>
        </SheetHeader>

        {itemCount > 0 && (
          <div className="px-4 pt-3">
            <CartProgressBar total={subtotal} />
          </div>
        )}

        <Separator className="mt-3" />

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {itemCount === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="font-heading text-lg mb-2">העגלה ריקה</h3>
              <p className="text-muted-foreground text-sm mb-6">הממלכה מחכה לך!</p>
              <Button asChild onClick={() => setCartOpen(false)} className="bg-kingdom-red hover:bg-kingdom-red-hover text-white">
                <Link href="/products">לחנות</Link>
              </Button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="flex gap-3 py-3 border-b border-border last:border-0"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={item.product.image_url}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{item.product.name}</h4>
                    <p className="text-price text-kingdom-red text-sm mt-0.5">₪{item.product.price}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer self-start mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {itemCount > 0 && (
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">סה&quot;כ</span>
              <span className="text-price text-lg text-kingdom-red">₪{subtotal.toFixed(2)}</span>
            </div>

            <Button
              asChild
              className="w-full bg-kingdom-red hover:bg-kingdom-red-hover text-white h-12 text-base font-medium"
              onClick={() => setCartOpen(false)}
            >
              <Link href="/checkout">לתשלום</Link>
            </Button>

            <Button
              variant="outline"
              className="w-full h-11 text-sm border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 gap-2"
              asChild
            >
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`היי! הזמנתי מהממלכה של עדי:\n${items.map(i => `• ${i.product.name} x${i.quantity} — ₪${i.product.price * i.quantity}`).join('\n')}\nסה"כ: ₪${subtotal.toFixed(2)}`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4" />
                אבא/סבתא, תקנו לי!
              </a>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
