'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import { cn } from '@/lib/utils'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compare_at_price?: number | null
  image_url: string
  is_new?: boolean
  is_featured?: boolean
  stock_quantity?: number
  category_name?: string
}

export default function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { addToCart } = useCart()
  const isOnSale = product.compare_at_price && product.compare_at_price > product.price
  const isOutOfStock = product.stock_quantity === 0
  const discountPercent = isOnSale
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn('group relative', className)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-muted mb-3">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              'object-cover transition-transform duration-500 group-hover:scale-105',
              isOutOfStock && 'opacity-50'
            )}
          />

          {/* Badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {product.is_new && (
              <Badge className="bg-kingdom-red text-white text-[10px] px-2 py-0.5">חדש</Badge>
            )}
            {isOnSale && (
              <Badge className="bg-kingdom-gold text-kingdom-charcoal text-[10px] px-2 py-0.5 font-bold">
                {discountPercent}%-
              </Badge>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-sm font-medium text-muted-foreground bg-background/80 px-3 py-1.5 rounded-full">אזל מהמלאי</span>
            </div>
          )}

          {/* Hover Actions */}
          {!isOutOfStock && (
            <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <Button
                size="sm"
                className="flex-1 bg-kingdom-red hover:bg-kingdom-red-hover text-white h-9 text-xs gap-1.5 shadow-lg"
                onClick={(e) => {
                  e.preventDefault()
                  addToCart(product as any)
                }}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                הוסיפו לסל
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="w-9 h-9 p-0 shadow-lg"
                onClick={(e) => e.preventDefault()}
              >
                <Heart className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-1">
          {product.category_name && (
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{product.category_name}</p>
          )}
          <h3 className="text-card-title font-medium text-foreground line-clamp-2 leading-snug">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-price text-base text-kingdom-red">₪{product.price}</span>
            {isOnSale && (
              <span className="text-price text-sm text-muted-foreground line-through">₪{product.compare_at_price}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
