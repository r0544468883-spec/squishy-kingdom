'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Crown, MessageCircle, ArrowLeft, Sparkles, Star, Heart } from 'lucide-react'
import { Product, Category } from '@/types'
import { getFeaturedProducts, getNewProducts } from '@/lib/products'
import { getCategories } from '@/lib/categories'
import ProductShadowCard from '@/components/products/ProductShadowCard'
import ProductCard from '@/components/products/ProductCard'
import CategoryCard from '@/components/products/CategoryCard'
import SectionTitle from '@/components/ui/SectionTitle'
import RoyalButton from '@/components/ui/RoyalButton'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import MagicParticles from '@/components/effects/MagicParticles'
import CastleGates from '@/components/effects/CastleGates'
import KingdomMap from '@/components/kingdom/KingdomMap'

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [newProducts, setNewProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [gatesOpen, setGatesOpen] = useState(false)

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
      {/* Castle Gates — First Visit Experience */}
      {!gatesOpen && <CastleGates onEnter={() => setGatesOpen(true)} />}
      {/* ============================================
          HERO — Immersive Kingdom Gates
          ============================================ */}
      <section className="relative hero-gradient overflow-hidden min-h-[85vh] md:min-h-[90vh] flex items-center justify-center">
        {/* Magic Particles */}
        <MagicParticles />

        {/* Decorative elements */}
        <div className="absolute inset-0 pattern-hearts opacity-30" />

        {/* Floating decorations */}
        <Star className="absolute top-[15%] right-[10%] w-6 h-6 text-kingdom-gold/40 animate-sparkle" />
        <Star className="absolute top-[25%] left-[15%] w-4 h-4 text-kingdom-gold/30 animate-sparkle" style={{ animationDelay: '0.7s' }} />
        <Heart className="absolute bottom-[30%] right-[20%] w-5 h-5 text-kingdom-pink/30 animate-float-slow" />
        <Star className="absolute bottom-[20%] left-[10%] w-5 h-5 text-kingdom-gold/30 animate-sparkle" style={{ animationDelay: '1.4s' }} />
        <Crown className="absolute top-[10%] left-[30%] w-8 h-8 text-kingdom-gold/20 animate-float-slow" style={{ animationDelay: '0.5s' }} />

        <div className="max-w-7xl mx-auto px-4 py-16 text-center relative z-20">
          {/* Crown animation */}
          <div className="mb-8 animate-bounce-in">
            <Crown className="w-20 h-20 md:w-28 md:h-28 text-kingdom-gold mx-auto animate-crown-bounce drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]" />
          </div>

          {/* Title */}
          <h1 className="font-bubble text-4xl md:text-7xl lg:text-8xl mb-4 leading-tight animate-slide-up text-gold-shimmer">
            הממלכה של עדי
          </h1>

          <p className="text-white/90 text-lg md:text-2xl mb-4 max-w-2xl mx-auto animate-slide-up font-light" style={{ animationDelay: '0.15s' }}>
            חנות הטרנדים הסודית
          </p>

          <p className="text-white/60 text-base md:text-lg mb-10 max-w-xl mx-auto animate-slide-up" style={{ animationDelay: '0.25s' }}>
            סקווישים, פידג&apos;טס, נידו ועוד — ישר מהארמון אליכם הביתה!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.35s' }}>
            <Link href="/products">
              <RoyalButton variant="gold" size="xl" className="btn-magic animate-pulse-gold text-lg">
                <Sparkles className="w-6 h-6" />
                כניסה לממלכה
              </RoyalButton>
            </Link>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-white/50 rounded-full animate-slide-up" />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          FEATURED — THE SQUISHI Reveal
          ============================================ */}
      {featured.length > 0 && (
        <section className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 sparkle-bg">
          <SectionTitle
            title="מה מסתתר בממלכה?"
            subtitle="לחצו על הצללית כדי לגלות את הטרנד הבא!"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 stagger-children">
            {featured.map(product => (
              <ProductShadowCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ============================================
          CATEGORIES — Kingdom Rooms
          ============================================ */}
      {categories.length > 0 && (
        <section className="relative py-16 md:py-24 pattern-dots">
          <div className="max-w-7xl mx-auto px-4">
            <SectionTitle
              title="חדרי הממלכה"
              subtitle="בחרו חדר ותגלו את האוצרות שבפנים"
            />
            <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-6 overflow-x-auto pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 stagger-children">
              {categories.map(cat => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================
          KINGDOM MAP — Pokemon-style territory exploration
          ============================================ */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <KingdomMap categories={categories} />
        </section>
      )}

      {/* ============================================
          NEW ARRIVALS
          ============================================ */}
      {newProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <SectionTitle
            title="חדש בממלכה!"
            subtitle="המוצרים החדשים ביותר — הגיעו ישר מהארמון"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 stagger-children">
            {newProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/products">
              <RoyalButton variant="secondary" size="lg" className="btn-magic">
                <ArrowLeft className="w-5 h-5" />
                לכל המוצרים בממלכה
              </RoyalButton>
            </Link>
          </div>
        </section>
      )}

      {/* ============================================
          WHATSAPP CTA — Golden banner
          ============================================ */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-l from-kingdom-gold via-kingdom-gold-light to-kingdom-gold">
          <div className="absolute inset-0 pattern-hearts opacity-20" />
          <div className="max-w-7xl mx-auto px-4 py-14 md:py-20 text-center relative z-10">
            <Crown className="w-10 h-10 text-kingdom-red mx-auto mb-4 animate-float" />
            <h2 className="font-bubble text-2xl md:text-4xl text-kingdom-red-deep mb-3">
              הצטרפו למשפחת הממלכה!
            </h2>
            <p className="text-kingdom-red-deep/70 mb-8 text-lg max-w-md mx-auto">
              קבלו עדכונים על טרנדים חדשים, מבצעים סודיים והפתעות ישר לוואטסאפ
            </p>
            <a href="https://wa.me/972XXXXXXXXX" target="_blank" rel="noopener noreferrer">
              <RoyalButton variant="whatsapp" size="xl" className="btn-magic shadow-xl shadow-green-500/20">
                <MessageCircle className="w-6 h-6" />
                הצטרפו עכשיו בוואטסאפ
              </RoyalButton>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================
          EMPTY STATE — if no products yet
          ============================================ */}
      {featured.length === 0 && newProducts.length === 0 && (
        <section className="max-w-7xl mx-auto px-4 py-24 text-center">
          <Crown className="w-24 h-24 text-kingdom-gold/30 mx-auto mb-6 animate-crown-bounce" />
          <h2 className="font-bubble text-3xl text-kingdom-charcoal mb-4">
            הממלכה בהכנות!
          </h2>
          <p className="text-kingdom-charcoal/60 max-w-md mx-auto text-lg mb-8">
            בקרוב מאוד הממלכה תיפתח עם הטרנדים הכי חמים.
            הצטרפו לוואטסאפ כדי לדעת ראשונים!
          </p>
          <a href="https://wa.me/972XXXXXXXXX" target="_blank" rel="noopener noreferrer">
            <RoyalButton variant="whatsapp" size="xl" className="btn-magic">
              <MessageCircle className="w-6 h-6" />
              עדכנו אותי כשנפתח!
            </RoyalButton>
          </a>
        </section>
      )}
    </div>
  )
}
