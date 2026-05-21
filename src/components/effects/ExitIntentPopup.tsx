'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gamepad2 } from 'lucide-react'
import Link from 'next/link'
import RoyalButton from '@/components/ui/RoyalButton'

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let triggered = false
    const SESSION_KEY = 'kingdom-exit-shown'

    if (sessionStorage.getItem(SESSION_KEY)) return

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !triggered) {
        triggered = true
        setShow(true)
        sessionStorage.setItem(SESSION_KEY, '1')
      }
    }

    // Also trigger after 60s of inactivity without adding to cart
    const timeout = setTimeout(() => {
      if (!triggered && !sessionStorage.getItem(SESSION_KEY)) {
        triggered = true
        setShow(true)
        sessionStorage.setItem(SESSION_KEY, '1')
      }
    }, 60000)

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShow(false)}
          />
          <motion.div
            className="relative z-10 bg-white rounded-3xl p-6 md:p-8 max-w-sm mx-4 border-2 border-kingdom-gold shadow-2xl text-center"
            initial={{ opacity: 0, scale: 0.7, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.button
              onClick={() => setShow(false)}
              className="absolute top-3 left-3 text-kingdom-charcoal/40 hover:text-kingdom-charcoal cursor-pointer"
              whileHover={{ scale: 1.2, rotate: 90 }}
            >
              <X className="w-5 h-5" />
            </motion.button>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-5xl block mb-4">🎮</span>
            </motion.div>

            <h3 className="font-heading text-xl text-kingdom-charcoal mb-2">
              רגע! לפני שעוזבים...
            </h3>
            <p className="font-body text-kingdom-charcoal/50 text-sm mb-5">
              שחקו במשחקי הממלכה וזכו בפרסים מיוחדים!
            </p>

            <div className="space-y-2">
              <Link href="/games" onClick={() => setShow(false)}>
                <RoyalButton variant="gold" size="lg" fullWidth className="btn-magic">
                  <Gamepad2 className="w-5 h-5" />
                  לזירת המשחקים!
                </RoyalButton>
              </Link>
              <button
                onClick={() => setShow(false)}
                className="text-sm text-kingdom-charcoal/40 hover:text-kingdom-charcoal/60 cursor-pointer font-body"
              >
                אולי אחר כך
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
