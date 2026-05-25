'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, MessageCircle, Minus, Plus, Share2, ChevronLeft } from 'lucide-react'
import { Product } from '@/types'
import { getProductBySlug } from '@/lib/products'
import { useCart } from '@/hooks/useCart'
import { generateBuyForMeLink, generateShareProductLink } from '@/lib/whatsapp'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import ContentContainer from '@/modules/common/components/content-container'
import { motion } from 'framer-motion'

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
      const p = await getProductBySlug(slug)
      setProduct(p)
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) {
    return (
      <ContentContainer className="py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 animate-pulse">
          <div className="aspect-square rounded-2xl bg-muted" />
          <div className="space-y-4">
            <div className="h-4 w-1/3 bg-muted rounded" />
            <div className="h-8 w-3/4 bg-muted rounded" />
            <div className="h-10 w-1/3 bg-muted rounded" />
            <div className="h-20 w-full bg-muted rounded" />
            <div className="h-12 w-full bg-muted rounded" />
          </div>
        </div>
      </ContentContainer>
    )
  }

  if (!product) {
    return (
      <ContentContainer className="py-20 text-center">
        <h2 className="text-xl font-heading mb-2">המוצר לא נמצא</h2>
        <p className="text-muted-foreground mb-6">נראה שהמוצר הזה נעלם מהממלכה...</p>
        <Button asChild><Link href="/products">חזרה לחנות</Link></Button>
      </ContentContainer>
    )
  }

  const allImages = [product.image_url, ...(product.gallery_urls || [])]
  const inStock = product.stock_quantity > 0
  const isOnSale = product.compare_at_price && product.compare_at_price > product.price
  const discountPercent = isOnSale ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100) : 0

  return (
    <div className="py-6 md:py-12">
      <ContentContainer>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">ראשי</Link>
          <ChevronLeft className="w-3 h-3" />
          <Link href="/products" className="hover:text-foreground transition-colors">חנות</Link>
          <ChevronLeft className="w-3 h-3" />
          <span className="text-foreground line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Image Gallery */}
          <div>
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border mb-3"
            >
              <Image
                src={allImages[selectedImage]}
                alt={product.name}
                fill
                className="object-contain p-4"
                priority
              />
              <div className="absolute top-3 right-3 flex gap-1.5">
                {product.is_new && <Badge className="bg-kingdom-red text-white">חדש!</Badge>}
                {isOnSale && <Badge className="bg-kingdom-gold text-kingdom-charcoal font-bold">{discountPercent}%-</Badge>}
              </div>
            </motion.div>

            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 cursor-pointer transition-colors ${
                      i === selectedImage ? 'border-kingdom-red' : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}

            {product.video_url && (
              <div className="mt-4 rounded-2xl overflow-hidden border border-border">
                <video src={product.video_url} autoPlay loop muted playsInline className="w-full" />
              </div>
            )}
          </div>

          {/* Product Info — sticky on desktop */}
          <div className="md:sticky md:top-24 md:self-start">
            <h1 className="font-heading text-2xl md:text-3xl text-foreground mb-3">{product.name}</h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-price text-3xl text-kingdom-red">₪{product.price.toFixed(0)}</span>
              {isOnSale && (
                <span className="text-muted-foreground line-through text-lg">₪{product.compare_at_price!.toFixed(0)}</span>
              )}
            </div>

            {/* Stock */}
            <p className={`text-sm mb-5 ${inStock ? 'text-kingdom-emerald' : 'text-destructive'}`}>
              {inStock ? `במלאי (${product.stock_quantity} יחידות)` : 'אזל מהמלאי'}
            </p>

            <Separator className="mb-5" />

            {/* Description */}
            {product.description && (
              <p className="text-muted-foreground leading-relaxed mb-5">{product.description}</p>
            )}

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map(tag => (
                  <span key={tag} className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            )}

            {/* Quantity + Actions */}
            <div className="space-y-3">
              {/* Quantity */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">כמות:</span>
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-11 h-11 flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-11 h-11 flex items-center justify-center font-semibold text-base border-x border-border">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-11 h-11 flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                onClick={() => addToCart(product, quantity)}
                disabled={!inStock}
                className="w-full h-13 text-base bg-kingdom-red hover:bg-kingdom-red-hover text-white gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                {inStock ? `הוסיפו לעגלה — ₪${(product.price * quantity).toFixed(0)}` : 'אזל מהמלאי'}
              </Button>

              {/* WhatsApp */}
              <Button
                variant="outline"
                className="w-full h-11 text-sm border-green-500 text-green-600 hover:bg-green-50 gap-2"
                asChild
              >
                <a href={generateBuyForMeLink([{ product, quantity }], product.price * quantity)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4" />
                  אבא/סבתא, תקנו לי!
                </a>
              </Button>

              {/* Share */}
              <Button
                variant="ghost"
                className="w-full h-10 text-sm text-muted-foreground gap-2"
                asChild
              >
                <a href={generateShareProductLink(product.name, product.slug)} target="_blank" rel="noopener noreferrer">
                  <Share2 className="w-4 h-4" />
                  שתפו חברים
                </a>
              </Button>
            </div>
          </div>
        </div>
      </ContentContainer>
    </div>
  )
}
