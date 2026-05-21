'use client'

import { useState } from 'react'
import Image from 'next/image'
import { HelpCircle } from 'lucide-react'
import { Product } from '@/types'
import SquishiRevealModal from './SquishiRevealModal'

interface ProductShadowCardProps {
  product: Product
}

export default function ProductShadowCard({ product }: ProductShadowCardProps) {
  const [showReveal, setShowReveal] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowReveal(true)}
        className="kingdom-card p-3 md:p-4 flex flex-col items-center cursor-pointer group w-full text-right"
      >
        {/* Shadow Image */}
        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-kingdom-parchment mb-3">
          <Image
            src={product.shadow_image_url || product.image_url}
            alt="?"
            fill
            className={`object-contain p-4 transition-all duration-300 ${
              product.shadow_image_url ? 'squishi-shadow' : 'squishi-shadow'
            } group-hover:scale-105`}
          />
          <div className="absolute top-2 left-2 bg-kingdom-gold/90 rounded-full p-1.5">
            <HelpCircle className="w-4 h-4 text-kingdom-charcoal" />
          </div>
        </div>

        {/* Teaser Text */}
        <p className="font-bubble text-kingdom-charcoal text-sm md:text-base">
          מה מסתתר כאן?
        </p>
        <p className="text-kingdom-charcoal/50 text-xs mt-1">לחצו לגלות!</p>
      </button>

      {showReveal && (
        <SquishiRevealModal
          product={product}
          onClose={() => setShowReveal(false)}
        />
      )}
    </>
  )
}
