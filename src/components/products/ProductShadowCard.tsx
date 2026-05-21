'use client'

import { useState } from 'react'
import Image from 'next/image'
import { HelpCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Product } from '@/types'
import SquishiRevealModal from './SquishiRevealModal'
import { cardHover, springPlayful } from '@/components/motion'

interface ProductShadowCardProps {
  product: Product
}

export default function ProductShadowCard({ product }: ProductShadowCardProps) {
  const [showReveal, setShowReveal] = useState(false)

  return (
    <>
      <motion.button
        onClick={() => setShowReveal(true)}
        className="kingdom-card p-3 md:p-4 flex flex-col items-center cursor-pointer w-full text-right"
        variants={cardHover}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
      >
        {/* Shadow Image */}
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-kingdom-parchment mb-3">
          <motion.div
            className="w-full h-full"
            whileHover={{ scale: 1.08, rotate: -2 }}
            transition={springPlayful}
          >
            <Image
              src={product.shadow_image_url || product.image_url}
              alt="?"
              fill
              className="object-contain p-4 squishi-shadow"
            />
          </motion.div>
          <motion.div
            className="absolute top-2 left-2 bg-kingdom-gold/90 rounded-full p-1.5"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <HelpCircle className="w-4 h-4 text-kingdom-charcoal" />
          </motion.div>
        </div>

        {/* Teaser */}
        <p className="font-heading text-kingdom-charcoal text-sm md:text-base">
          מה מסתתר כאן?
        </p>
        <p className="text-kingdom-charcoal/40 text-xs mt-1 font-body">לחצו לגלות!</p>
      </motion.button>

      {showReveal && (
        <SquishiRevealModal product={product} onClose={() => setShowReveal(false)} />
      )}
    </>
  )
}
