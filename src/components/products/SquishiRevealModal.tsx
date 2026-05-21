'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, ShoppingBag, ArrowLeft } from 'lucide-react'
import { Product } from '@/types'
import { useCart } from '@/hooks/useCart'
import RoyalButton from '@/components/ui/RoyalButton'
import Badge from '@/components/ui/Badge'

interface SquishiRevealModalProps {
  product: Product
  onClose: () => void
}

export default function SquishiRevealModal({ product, onClose }: SquishiRevealModalProps) {
  const [phase, setPhase] = useState<'shadow' | 'revealing' | 'revealed'>('shadow')
  const { addToCart } = useCart()

  useEffect(() => {
    // Start reveal animation sequence
    const t1 = setTimeout(() => setPhase('revealing'), 300)
    const t2 = setTimeout(() => setPhase('revealed'), 900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleAddToCart = () => {
    addToCart(product)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-kingdom-charcoal/90 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 w-[90vw] max-w-md mx-auto bg-white rounded-2xl overflow-hidden border-2 border-kingdom-gold shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 z-20 bg-white/80 rounded-full p-1.5 hover:bg-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 text-kingdom-charcoal" />
        </button>

        {/* Badges */}
        <div className="absolute top-3 right-3 z-20 flex gap-1.5">
          {product.is_new && <Badge variant="new">חדש!</Badge>}
          {product.compare_at_price && <Badge variant="sale">מבצע!</Badge>}
        </div>

        {/* Image Area */}
        <div className="relative w-full aspect-square bg-kingdom-parchment">
          {/* Shadow phase */}
          {phase === 'shadow' && (
            <Image
              src={product.shadow_image_url || product.image_url}
              alt="?"
              fill
              className="object-contain p-8 squishi-shadow"
            />
          )}

          {/* Revealing phase — golden glow */}
          {phase === 'revealing' && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-kingdom-gold/30 animate-ping" />
            </div>
          )}

          {/* Revealed phase */}
          {phase === 'revealed' && (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-contain p-6 animate-reveal-glow"
            />
          )}
        </div>

        {/* Product Info — slides in after reveal */}
        <div className={`p-5 md:p-6 transition-all duration-500 ${
          phase === 'revealed' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <h2 className="font-[Secular_One] text-xl md:text-2xl text-kingdom-charcoal mb-1">
            {product.name}
          </h2>

          <div className="flex items-center gap-3 mb-3">
            <span className="font-bold text-2xl text-kingdom-red">
              ₪{product.price.toFixed(0)}
            </span>
            {product.compare_at_price && (
              <span className="text-kingdom-charcoal/40 line-through text-sm">
                ₪{product.compare_at_price.toFixed(0)}
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-kingdom-charcoal/60 text-sm mb-4 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex flex-col gap-2">
            <RoyalButton
              variant="gold"
              size="lg"
              fullWidth
              onClick={handleAddToCart}
              disabled={product.stock_quantity <= 0}
            >
              <ShoppingBag className="w-5 h-5" />
              {product.stock_quantity > 0 ? 'הוסיפו לעגלה!' : 'אזל מהמלאי'}
            </RoyalButton>

            <Link href={`/products/${product.slug}`} onClick={onClose}>
              <RoyalButton variant="secondary" size="md" fullWidth>
                <ArrowLeft className="w-4 h-4" />
                עוד פרטים
              </RoyalButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
