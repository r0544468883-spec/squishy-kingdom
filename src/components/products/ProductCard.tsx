'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Product } from '@/types'
import { useCart } from '@/hooks/useCart'
import Badge from '@/components/ui/Badge'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  return (
    <div className="kingdom-card overflow-hidden group">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-kingdom-parchment overflow-hidden">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
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
          <h3 className="font-medium text-kingdom-charcoal text-sm md:text-base line-clamp-1 hover:text-kingdom-red transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-kingdom-red">
              ₪{product.price.toFixed(0)}
            </span>
            {product.compare_at_price && (
              <span className="text-kingdom-charcoal/40 line-through text-xs">
                ₪{product.compare_at_price.toFixed(0)}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={product.stock_quantity <= 0}
            className="bg-kingdom-gold text-kingdom-charcoal p-2 rounded-lg hover:bg-kingdom-gold-dark transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="הוסיפו לעגלה"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
