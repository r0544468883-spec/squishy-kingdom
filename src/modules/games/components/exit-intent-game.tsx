'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gamepad2, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'

const STORAGE_KEY = 'squishy-exit-shown'

export default function ExitIntentGame() {
  const [show, setShow] = useState(false)
  const { itemCount } = useCart()

  useEffect(() => {
    const shown = sessionStorage.getItem(STORAGE_KEY)
    if (shown) return

    let timeout: NodeJS.Timeout

    // Exit intent — mouse leaves viewport
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        sessionStorage.setItem(STORAGE_KEY, 'true')
        setShow(true)
      }
    }

    // Inactivity — 60 seconds without adding to cart
    if (itemCount === 0) {
      timeout = setTimeout(() => {
        const alreadyShown = sessionStorage.getItem(STORAGE_KEY)
        if (!alreadyShown) {
          sessionStorage.setItem(STORAGE_KEY, 'true')
          setShow(true)
        }
      }, 60000)
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      clearTimeout(timeout)
    }
  }, [itemCount])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && setShow(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-background rounded-2xl p-6 max-w-sm w-full text-center relative"
          >
            <button onClick={() => setShow(false)} className="absolute top-3 left-3 text-muted-foreground hover:text-foreground cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <Gift className="w-12 h-12 text-kingdom-gold mx-auto mb-3 animate-float" />
              <h2 className="font-heading text-xl mb-2">רגע! לא לעזוב!</h2>
              <p className="text-sm text-muted-foreground">יש לנו הפתעה בשבילכם — שחקו וזכו בפרס!</p>
            </div>

            <div className="space-y-2">
              <Button asChild className="w-full h-11 bg-kingdom-red hover:bg-kingdom-red-hover text-white gap-2">
                <Link href="/games" onClick={() => setShow(false)}>
                  <Gamepad2 className="w-4 h-4" />
                  לשחק ולזכות!
                </Link>
              </Button>
              <Button variant="ghost" onClick={() => setShow(false)} className="w-full text-muted-foreground">
                לא תודה
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
