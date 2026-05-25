'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Truck, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import Link from 'next/link'

const FREE_SHIPPING_THRESHOLD = 100

export default function FreeShippingNudge() {
  const { subtotal, itemCount } = useCart()
  const [dismissed, setDismissed] = useState(false)
  const [show, setShow] = useState(false)

  const remaining = FREE_SHIPPING_THRESHOLD - subtotal
  const percentage = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const reached = subtotal >= FREE_SHIPPING_THRESHOLD

  useEffect(() => {
    if (itemCount > 0 && !reached && !dismissed) {
      setShow(true)
    } else if (reached) {
      // Auto-hide after reaching threshold
      const timer = setTimeout(() => setShow(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [itemCount, reached, dismissed])

  if (!show || dismissed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-20 md:bottom-5 left-5 z-50 w-[320px] bg-foreground text-background rounded-xl p-4 shadow-2xl"
      >
        <button onClick={() => setDismissed(true)} className="absolute top-2 left-2 text-background/50 hover:text-background cursor-pointer">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Truck className={`w-5 h-5 ${reached ? 'text-green-400' : 'text-kingdom-gold'}`} />
          <span className="text-sm font-medium">
            {reached ? 'משלוח חינם!' : `עוד ₪${remaining.toFixed(0)} למשלוח חינם`}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-background/20 rounded-full overflow-hidden mb-3">
          <motion.div
            className={`h-full rounded-full ${reached ? 'bg-green-400' : 'bg-kingdom-gold'}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {!reached && (
          <div className="flex gap-2">
            <Button asChild size="sm" className="flex-1 bg-background text-foreground hover:bg-background/90 text-xs h-8">
              <Link href="/products"><ShoppingBag className="w-3 h-3 ml-1" />המשיכו לקנות</Link>
            </Button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
