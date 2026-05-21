'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, ShoppingBag, ArrowLeft, Sparkles } from 'lucide-react'
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
    const t1 = setTimeout(() => setPhase('revealing'), 400)
    const t2 = setTimeout(() => setPhase('revealed'), 1200)
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-kingdom-charcoal/95 backdrop-blur-md animate-fade-in" />

      {/* Sparkle decorations */}
      <Sparkles className="absolute top-[20%] right-[15%] w-6 h-6 text-kingdom-gold/50 animate-sparkle z-10" />
      <Sparkles className="absolute top-[30%] left-[20%] w-4 h-4 text-kingdom-pink/40 animate-sparkle z-10" style={{ animationDelay: '0.5s' }} />
      <Sparkles className="absolute bottom-[25%] right-[25%] w-5 h-5 text-kingdom-gold/40 animate-sparkle z-10" style={{ animationDelay: '1s' }} />

      {/* Modal */}
      <div
        className="relative z-20 w-[92vw] max-w-md mx-auto bg-white rounded-3xl overflow-hidden border-2 border-kingdom-gold shadow-2xl shadow-kingdom-gold/20 animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 z-30 bg-white/90 rounded-full p-1.5 hover:bg-white transition-colors cursor-pointer shadow-lg"
        >
          <X className="w-5 h-5 text-kingdom-charcoal" />
        </button>

        {/* Badges */}
        <div className="absolute top-3 right-3 z-30 flex gap-1.5">
          {product.is_new && <Badge variant="new">חדש!</Badge>}
          {product.compare_at_price && <Badge variant="sale">מבצע!</Badge>}
        </div>

        {/* Image Area */}
        <div className="relative w-full aspect-square bg-gradient-to-b from-kingdom-parchment to-white overflow-hidden">
          {/* Shadow phase */}
          {phase === 'shadow' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={product.shadow_image_url || product.image_url}
                alt="?"
                fill
                className="object-contain p-10 squishi-shadow animate-float"
              />
            </div>
          )}

          {/* Revealing phase — epic golden explosion */}
          {phase === 'revealing' && (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Multiple expanding rings */}
              <div className="absolute w-32 h-32 rounded-full border-4 border-kingdom-gold/60 animate-ping" />
              <div className="absolute w-48 h-48 rounded-full border-2 border-kingdom-gold/30 animate-ping" style={{ animationDelay: '0.2s' }} />
              <div className="absolute w-64 h-64 rounded-full border border-kingdom-gold/20 animate-ping" style={{ animationDelay: '0.4s' }} />
              {/* Center glow */}
              <div className="w-24 h-24 rounded-full bg-kingdom-gold/40 blur-xl animate-pulse" />
              <Sparkles className="absolute w-12 h-12 text-kingdom-gold animate-spin" />
            </div>
          )}

          {/* Revealed phase */}
          {phase === 'revealed' && (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-contain p-8 animate-reveal-glow"
            />
          )}
        </div>

        {/* Product Info */}
        <div className={`p-5 md:p-6 transition-all duration-700 ${
          phase === 'revealed' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <h2 className="font-bubble text-xl md:text-2xl text-kingdom-charcoal mb-1">
            {product.name}
          </h2>

          <div className="flex items-center gap-3 mb-3">
            <span className="font-bold text-2xl md:text-3xl text-kingdom-red">
              ₪{product.price.toFixed(0)}
            </span>
            {product.compare_at_price && (
              <span className="text-kingdom-charcoal/30 line-through text-base">
                ₪{product.compare_at_price.toFixed(0)}
              </span>
            )}
            {product.compare_at_price && (
              <span className="bg-kingdom-red-light/10 text-kingdom-red text-xs font-bold px-2 py-0.5 rounded-full">
                -{Math.round((1 - product.price / product.compare_at_price) * 100)}%
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-kingdom-charcoal/50 text-sm mb-5 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex flex-col gap-2.5">
            <RoyalButton
              variant="gold"
              size="lg"
              fullWidth
              onClick={handleAddToCart}
              disabled={product.stock_quantity <= 0}
              className="btn-magic"
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
