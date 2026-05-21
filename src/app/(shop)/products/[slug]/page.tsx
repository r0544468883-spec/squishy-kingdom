'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, MessageCircle, Minus, Plus, Share2 } from 'lucide-react'
import { Product } from '@/types'
import { getProductBySlug } from '@/lib/products'
import { useCart } from '@/hooks/useCart'
import { generateBuyForMeLink, generateShareProductLink } from '@/lib/whatsapp'
import RoyalButton from '@/components/ui/RoyalButton'
import Badge from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { addToCart } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    async function load() {
      try {
        const p = await getProductBySlug(slug)
        setProduct(p)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  if (loading) return <LoadingSpinner />

  if (!product) {
    return (
      <EmptyState
        title="המוצר לא נמצא"
        description="נראה שהמוצר הזה נעלם מהממלכה..."
        actionLabel="חזרה לחנות"
        actionHref="/products"
      />
    )
  }

  const allImages = [product.image_url, ...(product.gallery_urls || [])]
  const inStock = product.stock_quantity > 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-kingdom-charcoal/50 mb-6">
        <Link href="/" className="hover:text-kingdom-red transition-colors">ראשי</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-kingdom-red transition-colors">חנות</Link>
        <span>/</span>
        <span className="text-kingdom-charcoal line-clamp-1">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-square bg-kingdom-parchment rounded-2xl overflow-hidden border-2 border-kingdom-gold/30 mb-3">
            <Image
              src={allImages[selectedImage]}
              alt={product.name}
              fill
              className="object-contain p-6"
              priority
            />
            <div className="absolute top-3 right-3 flex gap-1.5">
              {product.is_new && <Badge variant="new">חדש!</Badge>}
              {product.compare_at_price && <Badge variant="sale">מבצע!</Badge>}
            </div>
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 cursor-pointer ${
                    i === selectedImage ? 'border-kingdom-gold' : 'border-kingdom-gold/20'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-contain p-1" />
                </button>
              ))}
            </div>
          )}

          {/* Video */}
          {product.video_url && (
            <div className="mt-4 rounded-2xl overflow-hidden border-2 border-kingdom-gold/30">
              <video
                src={product.video_url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="font-[Secular_One] text-2xl md:text-4xl text-kingdom-charcoal mb-3">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-3 mb-4">
            <span className="font-bold text-3xl text-kingdom-red">
              ₪{product.price.toFixed(0)}
            </span>
            {product.compare_at_price && (
              <span className="text-kingdom-charcoal/40 line-through text-lg">
                ₪{product.compare_at_price.toFixed(0)}
              </span>
            )}
          </div>

          {/* Stock */}
          <p className={`text-sm mb-6 ${inStock ? 'text-kingdom-emerald' : 'text-red-500'}`}>
            {inStock ? `במלאי (${product.stock_quantity} יחידות)` : 'אזל מהמלאי'}
          </p>

          {/* Description */}
          {product.description && (
            <p className="text-kingdom-charcoal/70 leading-relaxed mb-6">
              {product.description}
            </p>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map(tag => (
                <span key={tag} className="bg-kingdom-parchment text-kingdom-charcoal/60 text-xs px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div className="space-y-3">
            {/* Quantity Selector */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-kingdom-charcoal/70">כמות:</span>
              <div className="flex items-center border-2 border-kingdom-gold/30 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-kingdom-parchment transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 h-12 flex items-center justify-center font-bold text-lg border-x-2 border-kingdom-gold/30">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center hover:bg-kingdom-parchment transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <RoyalButton
              variant="gold"
              size="xl"
              fullWidth
              onClick={() => addToCart(product, quantity)}
              disabled={!inStock}
            >
              <ShoppingBag className="w-6 h-6" />
              {inStock ? `הוסיפו לעגלה — ₪${(product.price * quantity).toFixed(0)}` : 'אזל מהמלאי'}
            </RoyalButton>

            {/* WhatsApp Buy for Me */}
            <a
              href={generateBuyForMeLink([{ product, quantity }], product.price * quantity)}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <RoyalButton variant="whatsapp" size="lg" fullWidth>
                <MessageCircle className="w-5 h-5" />
                אבא/סבתא, תקנו לי!
              </RoyalButton>
            </a>

            {/* Share */}
            <a
              href={generateShareProductLink(product.name, product.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <RoyalButton variant="secondary" size="md" fullWidth>
                <Share2 className="w-4 h-4" />
                שתפו חברים
              </RoyalButton>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
