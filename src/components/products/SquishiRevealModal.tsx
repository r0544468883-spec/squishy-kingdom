'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, ShoppingBag, ArrowLeft, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Product } from '@/types'
import { useCart } from '@/hooks/useCart'
import RoyalButton from '@/components/ui/RoyalButton'
import { Badge } from '@/components/ui/badge'

interface SquishiRevealModalProps {
  product: Product
  onClose: () => void
}

export default function SquishiRevealModal({ product, onClose }: SquishiRevealModalProps) {
  const [phase, setPhase] = useState<'shadow' | 'revealing' | 'revealed'>('shadow')
  const { addToCart } = useCart()

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('revealing'), 500)
    const t2 = setTimeout(() => setPhase('revealed'), 1400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleAddToCart = () => {
    addToCart(product)
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-kingdom-charcoal/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Floating sparkles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute z-10"
            style={{ top: `${20 + Math.random() * 60}%`, left: `${10 + Math.random() * 80}%` }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          >
            <Sparkles className="w-4 h-4 text-kingdom-gold/40" />
          </motion.div>
        ))}

        {/* Modal */}
        <motion.div
          className="relative z-20 w-[92vw] max-w-md mx-auto bg-white rounded-3xl overflow-hidden border-2 border-kingdom-gold shadow-[0_0_60px_rgba(255,215,0,0.15)]"
          initial={{ opacity: 0, scale: 0.7, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Close */}
          <motion.button
            onClick={onClose}
            className="absolute top-3 left-3 z-30 bg-white/90 rounded-full p-1.5 cursor-pointer shadow-lg"
            whileHover={{ scale: 1.15, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5 text-kingdom-charcoal" />
          </motion.button>

          {/* Badges */}
          <div className="absolute top-3 right-3 z-30 flex gap-1.5">
            {product.is_new && <Badge className="bg-kingdom-gold text-kingdom-charcoal">חדש!</Badge>}
            {product.compare_at_price && <Badge className="bg-kingdom-red text-white">מבצע!</Badge>}
          </div>

          {/* Image Area */}
          <div className="relative w-full aspect-square bg-gradient-to-b from-kingdom-parchment to-white overflow-hidden">
            {/* Shadow phase */}
            <AnimatePresence mode="wait">
              {phase === 'shadow' && (
                <motion.div
                  key="shadow"
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Image src={product.shadow_image_url || product.image_url} alt="?" fill className="object-contain p-10 squishi-shadow" />
                </motion.div>
              )}

              {/* Revealing — golden burst */}
              {phase === 'revealing' && (
                <motion.div key="revealing" className="absolute inset-0 flex items-center justify-center">
                  {[1, 2, 3].map(ring => (
                    <motion.div
                      key={ring}
                      className="absolute rounded-full border-2 border-kingdom-gold"
                      initial={{ width: 0, height: 0, opacity: 0.8 }}
                      animate={{ width: ring * 120, height: ring * 120, opacity: 0 }}
                      transition={{ duration: 1, delay: ring * 0.15, ease: 'easeOut' }}
                    />
                  ))}
                  <motion.div
                    className="w-20 h-20 rounded-full bg-kingdom-gold/30 blur-2xl"
                    animate={{ scale: [1, 2, 1], opacity: [0.5, 0.8, 0] }}
                    transition={{ duration: 1 }}
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, ease: 'linear' }}
                  >
                    <Sparkles className="w-10 h-10 text-kingdom-gold" />
                  </motion.div>
                </motion.div>
              )}

              {/* Revealed */}
              {phase === 'revealed' && (
                <motion.div
                  key="revealed"
                  initial={{ opacity: 0, scale: 0.5, filter: 'brightness(2)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'brightness(1)' }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="absolute inset-0"
                >
                  <Image src={product.image_url} alt={product.name} fill className="object-contain p-8" />
                  {/* Golden glow behind product */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-40 h-40 bg-kingdom-gold/10 rounded-full blur-3xl" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Product Info */}
          <motion.div
            className="p-5 md:p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={phase === 'revealed' ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.2 }}
          >
            <h2 className="font-heading text-xl md:text-2xl text-kingdom-charcoal mb-1">{product.name}</h2>

            <div className="flex items-center gap-3 mb-3">
              <span className="text-price text-2xl md:text-3xl text-kingdom-red">₪{product.price.toFixed(0)}</span>
              {product.compare_at_price && (
                <>
                  <span className="text-kingdom-charcoal/25 line-through text-base font-body">₪{product.compare_at_price.toFixed(0)}</span>
                  <span className="bg-kingdom-red/10 text-kingdom-red text-xs font-bold px-2 py-0.5 rounded-full font-fun">
                    -{Math.round((1 - product.price / product.compare_at_price) * 100)}%
                  </span>
                </>
              )}
            </div>

            {product.description && (
              <p className="text-kingdom-charcoal/45 text-sm mb-5 line-clamp-2 font-body">{product.description}</p>
            )}

            <div className="flex flex-col gap-2.5">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96, scaleY: 0.92 }}>
                <RoyalButton variant="gold" size="lg" fullWidth onClick={handleAddToCart} disabled={product.stock_quantity <= 0} className="btn-magic">
                  <ShoppingBag className="w-5 h-5" />
                  {product.stock_quantity > 0 ? 'הוסיפו לעגלה!' : 'אזל מהמלאי'}
                </RoyalButton>
              </motion.div>
              <Link href={`/products/${product.slug}`} onClick={onClose}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <RoyalButton variant="secondary" size="md" fullWidth>
                    <ArrowLeft className="w-4 h-4" />
                    עוד פרטים
                  </RoyalButton>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
