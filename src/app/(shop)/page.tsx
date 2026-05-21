'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Crown, MessageCircle, ArrowLeft, Sparkles, Star, Heart } from 'lucide-react'
import { Product, Category } from '@/types'
import { getFeaturedProducts, getNewProducts } from '@/lib/products'
import { getCategories } from '@/lib/categories'
import ProductShadowCard from '@/components/products/ProductShadowCard'
import ProductCard from '@/components/products/ProductCard'
import RoyalButton from '@/components/ui/RoyalButton'
import MagicParticles from '@/components/effects/MagicParticles'
import CastleGates from '@/components/effects/CastleGates'
import KingdomMap from '@/components/kingdom/KingdomMap'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FadeIn, ScaleIn, StaggerGrid, StaggerItem, FloatingElement } from '@/components/motion'

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [newProducts, setNewProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [gatesOpen, setGatesOpen] = useState(false)

  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])

  useEffect(() => {
    async function load() {
      try {
        const [f, n, c] = await Promise.all([
          getFeaturedProducts(), getNewProducts(), getCategories(),
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Crown className="w-12 h-12 text-kingdom-gold" />
        </motion.div>
        <p className="font-heading text-kingdom-charcoal/50">הממלכה נפתחת...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Castle Gates */}
      {!gatesOpen && <CastleGates onEnter={() => setGatesOpen(true)} />}

      {/* ============================================
          HERO — Parallax, premium typography
          ============================================ */}
      <section className="relative hero-gradient overflow-hidden min-h-[90vh] md:min-h-[95vh] flex items-center justify-center noise-overlay">
        <MagicParticles />
        <div className="absolute inset-0 pattern-hearts opacity-20" />

        {/* Floating decorations with parallax */}
        <FloatingElement className="absolute top-[15%] right-[8%]" y={15} duration={4}>
          <Star className="w-6 h-6 text-kingdom-gold/30" />
        </FloatingElement>
        <FloatingElement className="absolute top-[25%] left-[12%]" y={10} duration={5}>
          <Heart className="w-5 h-5 text-kingdom-pink/25" />
        </FloatingElement>
        <FloatingElement className="absolute bottom-[30%] right-[18%]" y={12} duration={3.5}>
          <Sparkles className="w-5 h-5 text-kingdom-gold/25" />
        </FloatingElement>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-7xl mx-auto px-4 py-16 text-center relative z-20"
        >
          {/* Crown */}
          <ScaleIn>
            <FloatingElement y={10} duration={4}>
              <Crown className="w-20 h-20 md:w-28 md:h-28 text-kingdom-gold mx-auto drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]" />
            </FloatingElement>
          </ScaleIn>

          {/* Title — word by word cascade */}
          <FadeIn delay={0.2} className="mt-6">
            <h1 className="text-hero text-gold-shimmer leading-tight">
              הממלכה של עדי
            </h1>
          </FadeIn>

          <FadeIn delay={0.35}>
            <p className="font-heading text-white/80 text-xl md:text-2xl mt-4">
              חנות הטרנדים הסודית
            </p>
          </FadeIn>

          <FadeIn delay={0.5}>
            <p className="font-body text-white/50 text-base md:text-lg mt-3 max-w-lg mx-auto">
              סקווישים, פידג&apos;טס, נידו ועוד — ישר מהארמון אליכם הביתה!
            </p>
          </FadeIn>

          <FadeIn delay={0.65}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link href="/products">
                <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
                  <RoyalButton variant="gold" size="xl" className="btn-magic animate-pulse-gold text-lg shadow-xl">
                    <Sparkles className="w-6 h-6" />
                    כניסה לממלכה
                  </RoyalButton>
                </motion.div>
              </Link>
            </div>
          </FadeIn>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
              <motion.div
                className="w-1.5 h-3 bg-white/40 rounded-full"
                animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================
          FEATURED — THE SQUISHI
          ============================================ */}
      {featured.length > 0 && (
        <section className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
          <FadeIn>
            <div className="text-center mb-12 md:mb-16">
              <div className="flex items-center justify-center gap-3 mb-3">
                <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Sparkles className="w-5 h-5 text-kingdom-gold" />
                </motion.div>
              </div>
              <h2 className="text-section text-kingdom-charcoal">מה מסתתר בממלכה?</h2>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="w-10 h-0.5 bg-kingdom-red/20 rounded-full" />
                <div className="w-20 h-1 bg-gradient-to-l from-kingdom-gold to-kingdom-red rounded-full" />
                <div className="w-10 h-0.5 bg-kingdom-red/20 rounded-full" />
              </div>
              <p className="font-body text-kingdom-charcoal/40 mt-4 text-base md:text-lg">
                לחצו על הצללית כדי לגלות את הטרנד הבא!
              </p>
            </div>
          </FadeIn>

          <StaggerGrid className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map(product => (
              <StaggerItem key={product.id}>
                <ProductShadowCard product={product} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </section>
      )}

      {/* ============================================
          KINGDOM MAP — Pokemon territory exploration
          ============================================ */}
      {categories.length > 0 && (
        <section className="relative py-20 md:py-28 pattern-dots">
          <div className="max-w-7xl mx-auto px-4">
            <FadeIn>
              <KingdomMap categories={categories} />
            </FadeIn>
          </div>
        </section>
      )}

      {/* ============================================
          NEW ARRIVALS — Horizontal scroll on mobile
          ============================================ */}
      {newProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-20 md:py-28">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-section text-kingdom-charcoal">חדש בממלכה!</h2>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="w-10 h-0.5 bg-kingdom-red/20 rounded-full" />
                <div className="w-20 h-1 bg-gradient-to-l from-kingdom-gold to-kingdom-red rounded-full" />
                <div className="w-10 h-0.5 bg-kingdom-red/20 rounded-full" />
              </div>
              <p className="font-body text-kingdom-charcoal/40 mt-4">
                הגיעו ישר מהארמון
              </p>
            </div>
          </FadeIn>

          {/* Mobile: horizontal scroll / Desktop: grid */}
          <div className="md:hidden">
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory">
              {newProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  className="min-w-[70vw] snap-center"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 24 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <StaggerGrid className="grid grid-cols-4 gap-6">
              {newProducts.map(product => (
                <StaggerItem key={product.id}>
                  <ProductCard product={product} />
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>

          <FadeIn className="text-center mt-10">
            <Link href="/products">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <RoyalButton variant="secondary" size="lg" className="btn-magic">
                  <ArrowLeft className="w-5 h-5" />
                  לכל המוצרים בממלכה
                </RoyalButton>
              </motion.div>
            </Link>
          </FadeIn>
        </section>
      )}

      {/* ============================================
          WHATSAPP CTA
          ============================================ */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-l from-kingdom-gold via-kingdom-gold-light to-kingdom-gold">
          <div className="absolute inset-0 pattern-hearts opacity-15" />
          <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 text-center relative z-10">
            <FadeIn>
              <FloatingElement y={8}>
                <Crown className="w-10 h-10 text-kingdom-red mx-auto mb-5" />
              </FloatingElement>
              <h2 className="text-section text-kingdom-red-deep mb-3">
                הצטרפו למשפחת הממלכה!
              </h2>
              <p className="font-body text-kingdom-red-deep/60 mb-8 text-lg max-w-md mx-auto">
                קבלו עדכונים על טרנדים חדשים, מבצעים סודיים והפתעות ישר לוואטסאפ
              </p>
              <a href="https://wa.me/972XXXXXXXXX" target="_blank" rel="noopener noreferrer">
                <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
                  <RoyalButton variant="whatsapp" size="xl" className="btn-magic shadow-xl shadow-green-500/20">
                    <MessageCircle className="w-6 h-6" />
                    הצטרפו עכשיו בוואטסאפ
                  </RoyalButton>
                </motion.div>
              </a>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ============================================
          EMPTY STATE
          ============================================ */}
      {featured.length === 0 && newProducts.length === 0 && (
        <section className="max-w-7xl mx-auto px-4 py-28 text-center">
          <ScaleIn>
            <FloatingElement y={15}>
              <Crown className="w-24 h-24 text-kingdom-gold/30 mx-auto mb-6" />
            </FloatingElement>
            <h2 className="text-section text-kingdom-charcoal mb-4">הממלכה בהכנות!</h2>
            <p className="font-body text-kingdom-charcoal/50 max-w-md mx-auto text-lg mb-8">
              בקרוב מאוד הממלכה תיפתח עם הטרנדים הכי חמים.
            </p>
            <a href="https://wa.me/972XXXXXXXXX" target="_blank" rel="noopener noreferrer">
              <RoyalButton variant="whatsapp" size="xl" className="btn-magic">
                <MessageCircle className="w-6 h-6" />
                עדכנו אותי כשנפתח!
              </RoyalButton>
            </a>
          </ScaleIn>
        </section>
      )}
    </div>
  )
}
