'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Crown, MessageCircle, ArrowLeft, Sparkles } from 'lucide-react'
import { Product, Category } from '@/types'
import { getFeaturedProducts, getNewProducts } from '@/lib/products'
import { getCategories } from '@/lib/categories'
import ProductShadowCard from '@/components/products/ProductShadowCard'
import ProductCard from '@/components/products/ProductCard'
import RoyalButton from '@/components/ui/RoyalButton'
import CastleGates from '@/components/effects/CastleGates'
import KingdomMap from '@/components/kingdom/KingdomMap'
import AdiGuide from '@/components/kingdom/AdiGuide'
import { motion } from 'framer-motion'
import { FadeIn, StaggerGrid, StaggerItem, FloatingElement } from '@/components/motion'

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [newProducts, setNewProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [gatesOpen, setGatesOpen] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      try {
        const [f, n, c] = await Promise.all([
          getFeaturedProducts(), getNewProducts(), getCategories(),
        ])
        console.log('[Homepage] Loaded:', { featured: f.length, new: n.length, categories: c.length })
        setFeatured(f)
        setNewProducts(n)
        setCategories(c)
      } catch (err) {
        console.error('[Homepage] Failed to load:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleGatesOpen = () => {
    setGatesOpen(true)
    setShowWelcome(true)
    // Auto-scroll to map after welcome
    setTimeout(() => {
      setShowWelcome(false)
      mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 3500)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
          <Crown className="w-12 h-12 text-kingdom-gold" />
        </motion.div>
        <p className="font-heading text-kingdom-charcoal/50">הממלכה נפתחת...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Castle Gates — Entry Experience */}
      {!gatesOpen && <CastleGates onEnter={handleGatesOpen} />}

      {/* Welcome Animation — brief, after gates open */}
      {showWelcome && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-kingdom-cream"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.3 }}
            >
              <Crown className="w-16 h-16 text-kingdom-gold mx-auto mb-4 drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]" />
            </motion.div>
            <AdiGuide message="ברוכים הבאים לממלכה! בואו נתחיל את הסיור..." position="center" />
          </div>
        </motion.div>
      )}

      {/* ============================================
          KINGDOM MAP — The Main Experience
          ============================================ */}
      <section ref={mapRef} className="relative py-16 md:py-24 pattern-dots">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn>
            {categories.length > 0 ? (
              <KingdomMap categories={categories} />
            ) : (
              <div className="text-center py-12">
                <Crown className="w-16 h-16 text-kingdom-gold/30 mx-auto mb-4" />
                <h2 className="text-section text-kingdom-charcoal mb-2">מפת הממלכה</h2>
                <p className="font-body text-kingdom-charcoal/40">
                  הטריטוריות נטענות... רפרשו את הדף אם זה לוקח זמן
                </p>
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      {/* ============================================
          FEATURED — THE SQUISHI Reveal
          ============================================ */}
      {featured.length > 0 && (
        <section className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <FadeIn>
            <div className="text-center mb-12 md:mb-16">
              <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Sparkles className="w-6 h-6 text-kingdom-gold mx-auto mb-3" />
              </motion.div>
              <h2 className="text-section text-kingdom-charcoal">מה מסתתר בממלכה?</h2>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="w-10 h-0.5 bg-kingdom-red/20 rounded-full" />
                <div className="w-20 h-1 bg-gradient-to-l from-kingdom-gold to-kingdom-red rounded-full" />
                <div className="w-10 h-0.5 bg-kingdom-red/20 rounded-full" />
              </div>
              <p className="font-body text-kingdom-charcoal/40 mt-4">לחצו על הצללית כדי לגלות את הטרנד!</p>
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
          NEW ARRIVALS
          ============================================ */}
      {newProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-section text-kingdom-charcoal">חדש בממלכה!</h2>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="w-10 h-0.5 bg-kingdom-red/20 rounded-full" />
                <div className="w-20 h-1 bg-gradient-to-l from-kingdom-gold to-kingdom-red rounded-full" />
                <div className="w-10 h-0.5 bg-kingdom-red/20 rounded-full" />
              </div>
              <p className="font-body text-kingdom-charcoal/40 mt-4">הגיעו ישר מהארמון</p>
            </div>
          </FadeIn>

          {/* Mobile: horizontal scroll */}
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

          {/* Desktop: grid */}
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
              <h2 className="text-section text-kingdom-red-deep mb-3">הצטרפו למשפחת הממלכה!</h2>
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
    </div>
  )
}
