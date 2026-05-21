'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { Product } from '@/types'
import { useCart } from '@/hooks/useCart'
import Badge from '@/components/ui/Badge'
import { cardHover, springBouncy } from '@/components/motion'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  return (
    <motion.div
      className="kingdom-card"
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-kingdom-parchment overflow-hidden rounded-t-[18px]">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-contain p-4"
        />
        <div className="absolute top-2 right-2 flex gap-1.5">
          {product.is_new && <Badge variant="new">חדש!</Badge>}
          {product.compare_at_price && <Badge variant="sale">מבצע!</Badge>}
          {product.stock_quantity <= 0 && <Badge variant="soldout">אזל!</Badge>}
        </div>
      </Link>

      {/* Info */}
      <div className="p-3 md:p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-card-title text-kingdom-charcoal line-clamp-1 hover:text-kingdom-red transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="text-price text-lg text-kingdom-red">
              ₪{product.price.toFixed(0)}
            </span>
            {product.compare_at_price && (
              <span className="text-kingdom-charcoal/30 line-through text-xs font-body">
                ₪{product.compare_at_price.toFixed(0)}
              </span>
            )}
          </div>

          <motion.button
            onClick={() => addToCart(product)}
            disabled={product.stock_quantity <= 0}
            className="bg-kingdom-gold text-kingdom-charcoal p-2.5 rounded-xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.15, rotate: -5 }}
            whileTap={{ scale: 0.85, scaleX: 1.2, scaleY: 0.8 }}
            transition={springBouncy}
            title="הוסיפו לעגלה"
          >
            <ShoppingBag className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
