'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Crown, MessageCircle, ArrowLeft, Sparkles } from 'lucide-react'
import { Product, Category } from '@/types'
import { getFeaturedProducts, getNewProducts } from '@/lib/products'
import { getCategories } from '@/lib/categories'
import ProductShadowCard from '@/components/products/ProductShadowCard'
import ProductCard from '@/components/products/ProductCard'
import CategoryCard from '@/components/products/CategoryCard'
import SectionTitle from '@/components/ui/SectionTitle'
import RoyalButton from '@/components/ui/RoyalButton'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [newProducts, setNewProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [f, n, c] = await Promise.all([
          getFeaturedProducts(),
          getNewProducts(),
          getCategories(),
        ])
        setFeatured(f)
        setNewProducts(n)
        setCategories(c)
      } catch (err) {
        console.error('Failed to load homepage data:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <LoadingSpinner text="הממלכה נפתחת..." />

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-kingdom-red overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 border-2 border-kingdom-gold rounded-full" />
          <div className="absolute bottom-10 left-20 w-24 h-24 border-2 border-kingdom-gold rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-16 h-16 border-2 border-kingdom-gold rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 md:py-28 text-center relative">
          <Crown className="w-16 h-16 md:w-20 md:h-20 text-kingdom-gold mx-auto mb-6 animate-float" />

          <h1 className="font-[Secular_One] text-3xl md:text-6xl text-kingdom-gold mb-4 leading-tight">
            ברוכים הבאים לממלכה של עדי
          </h1>

          <p className="text-white/80 text-lg md:text-xl mb-8 max-w-xl mx-auto">
            הטרנדים הכי חמים — סקווישים, פידג&apos;טס, נידו ועוד.
            ישר מהארמון אליכם הביתה!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/products">
              <RoyalButton variant="gold" size="xl">
                <Sparkles className="w-5 h-5" />
                כניסה לממלכה
              </RoyalButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products — THE SQUISHI */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <SectionTitle
            title="מה מסתתר בממלכה?"
            subtitle="לחצו על הצללית כדי לגלות את הטרנד!"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {featured.map(product => (
              <ProductShadowCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <SectionTitle
            title="חדרי הממלכה"
            subtitle="בחרו חדר ותגלו את האוצרות שבפנים"
          />
          <div className="flex md:grid md:grid-cols-4 gap-3 md:gap-6 overflow-x-auto pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
            {categories.map(cat => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <SectionTitle
            title="הגיעו לארמון!"
            subtitle="המוצרים החדשים ביותר בממלכה"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {newProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/products">
              <RoyalButton variant="secondary" size="lg">
                <ArrowLeft className="w-5 h-5" />
                לכל המוצרים
              </RoyalButton>
            </Link>
          </div>
        </section>
      )}

      {/* WhatsApp CTA */}
      <section className="bg-kingdom-gold">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 text-center">
          <h2 className="font-[Secular_One] text-2xl md:text-3xl text-kingdom-charcoal mb-3">
            הצטרפו לקבוצת הממלכה בוואטסאפ!
          </h2>
          <p className="text-kingdom-charcoal/70 mb-6">
            קבלו עדכונים על טרנדים חדשים, מבצעים והפתעות ישר לנייד
          </p>
          <a href="https://wa.me/972XXXXXXXXX" target="_blank" rel="noopener noreferrer">
            <RoyalButton variant="whatsapp" size="xl">
              <MessageCircle className="w-6 h-6" />
              הצטרפו עכשיו
            </RoyalButton>
          </a>
        </div>
      </section>

      {/* Empty State — if no products yet */}
      {featured.length === 0 && newProducts.length === 0 && (
        <section className="max-w-7xl mx-auto px-4 py-20 text-center">
          <Crown className="w-20 h-20 text-kingdom-gold/30 mx-auto mb-6" />
          <h2 className="font-[Secular_One] text-2xl text-kingdom-charcoal mb-3">
            הממלכה בהכנות!
          </h2>
          <p className="text-kingdom-charcoal/60 max-w-md mx-auto">
            בקרוב מאוד הממלכה תיפתח עם הטרנדים הכי חמים.
            הצטרפו לוואטסאפ כדי לדעת ראשונים!
          </p>
        </section>
      )}
    </div>
  )
}
