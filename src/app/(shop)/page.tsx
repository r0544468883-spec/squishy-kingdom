'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Crown, Sparkles, ShoppingBag, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ContentContainer from '@/modules/common/components/content-container'
import ProductCard from '@/modules/products/components/product-card'
import ProductGridSkeleton from '@/modules/skeletons/product-grid-skeleton'
import { createClient } from '@/lib/supabase/client'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compare_at_price: number | null
  image_url: string
  is_new: boolean
  is_featured: boolean
  stock_quantity: number
  category_id: string
}

interface Category {
  id: string
  name: string
  slug: string
  description: string
  image_url: string | null
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [newProducts, setNewProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      const [featuredRes, newRes, catRes] = await Promise.all([
        supabase.from('products').select('*').eq('is_featured', true).eq('is_active', true).limit(4),
        supabase.from('products').select('*').eq('is_new', true).eq('is_active', true).order('created_at', { ascending: false }).limit(8),
        supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
      ])

      if (featuredRes.data) setFeatured(featuredRes.data)
      if (newRes.data) setNewProducts(newRes.data)
      if (catRes.data) setCategories(catRes.data)
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-kingdom-red via-kingdom-red-deep to-kingdom-purple min-h-[70vh] md:min-h-[80vh] flex items-center">
        <div className="absolute inset-0 pattern-hearts opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        <ContentContainer className="relative z-10">
          <div className="max-w-2xl py-16 md:py-24">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
              <motion.div variants={fadeUp}>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs px-3 py-1 mb-4">
                  <Sparkles className="w-3 h-3 ml-1" />
                  הטרנדים הכי חמים
                </Badge>
              </motion.div>

              <motion.h1 variants={fadeUp} className="font-bubble text-4xl md:text-6xl lg:text-7xl text-white leading-tight">
                הממלכה של עדי
              </motion.h1>

              <motion.p variants={fadeUp} className="text-white/80 text-lg md:text-xl max-w-lg leading-relaxed">
                סקווישים, פידג'טס, נידו ועוד — כל הטרנדים הכי שווים ישר מהממלכה אליכם!
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
                <Button asChild size="lg" className="bg-white text-kingdom-red hover:bg-white/90 h-12 px-8 text-base font-medium shadow-xl">
                  <Link href="/products">
                    <ShoppingBag className="w-5 h-5 ml-2" />
                    כניסה לחנות
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-white/40 text-white hover:bg-white/10 h-12 px-8 text-base bg-transparent">
                  <Link href="/games">
                    <Star className="w-5 h-5 ml-2" />
                    משחקים
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </ContentContainer>

        <div className="hidden md:block absolute left-10 top-1/4 w-20 h-20 bg-kingdom-gold/20 rounded-full blur-2xl animate-float" />
        <div className="hidden md:block absolute left-1/4 bottom-1/4 w-32 h-32 bg-kingdom-pink/20 rounded-full blur-3xl animate-float-slow" />
      </section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className="py-16 md:py-24">
          <ContentContainer>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={staggerContainer}>
              <motion.div variants={fadeUp} className="text-center mb-10 md:mb-14">
                <h2 className="text-section text-foreground mb-3">חדרי הממלכה</h2>
                <p className="text-muted-foreground max-w-md mx-auto">כל חדר מלא בהפתעות — בחרו קטגוריה והתחילו לגלות</p>
              </motion.div>

              <motion.div variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {categories.map((cat) => (
                  <motion.div key={cat.id} variants={fadeUp}>
                    <Link
                      href={`/category/${cat.slug}`}
                      className="group block relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-kingdom-red/5 to-kingdom-purple/5 border border-border hover:border-kingdom-red/30 transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                        <Crown className="w-8 h-8 text-kingdom-red mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="font-heading text-sm md:text-base font-semibold text-foreground">{cat.name}</h3>
                        {cat.description && (
                          <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{cat.description}</p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </ContentContainer>
        </section>
      )}

      {/* FEATURED */}
      <section className="py-16 md:py-24 bg-muted/50">
        <ContentContainer>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={staggerContainer}>
            <motion.div variants={fadeUp} className="flex items-center justify-between mb-10 md:mb-14">
              <div>
                <h2 className="text-section text-foreground mb-2">הנבחרים של הממלכה</h2>
                <p className="text-muted-foreground text-sm">המוצרים הכי פופולריים אצלנו</p>
              </div>
              <Button asChild variant="ghost" className="text-kingdom-red hover:text-kingdom-red-hover gap-1">
                <Link href="/products">הכל<ArrowLeft className="w-4 h-4" /></Link>
              </Button>
            </motion.div>

            {loading ? (
              <ProductGridSkeleton count={4} />
            ) : (
              <motion.div variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {featured.map((product) => (
                  <motion.div key={product.id} variants={fadeUp}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </ContentContainer>
      </section>

      {/* NEW ARRIVALS */}
      <section className="py-16 md:py-24">
        <ContentContainer>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={staggerContainer}>
            <motion.div variants={fadeUp} className="flex items-center justify-between mb-10 md:mb-14">
              <div>
                <h2 className="text-section text-foreground mb-2">הגיעו לממלכה</h2>
                <p className="text-muted-foreground text-sm">מוצרים חדשים שהגיעו השבוע</p>
              </div>
              <Button asChild variant="ghost" className="text-kingdom-red hover:text-kingdom-red-hover gap-1">
                <Link href="/products">הכל<ArrowLeft className="w-4 h-4" /></Link>
              </Button>
            </motion.div>

            {loading ? (
              <ProductGridSkeleton count={8} />
            ) : (
              <motion.div variants={staggerContainer} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {newProducts.map((product) => (
                  <motion.div key={product.id} variants={fadeUp}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </ContentContainer>
      </section>

      {/* WHATSAPP CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-l from-green-500 to-green-600">
        <ContentContainer>
          <div className="text-center text-white space-y-4">
            <h2 className="font-heading text-2xl md:text-3xl font-bold">הצטרפו לקהילת הממלכה</h2>
            <p className="text-white/80 max-w-md mx-auto">קבלו עדכונים על מוצרים חדשים, מבצעים והפתעות ישירות לוואטסאפ</p>
            <Button asChild size="lg" className="bg-white text-green-600 hover:bg-white/90 h-12 px-8 text-base font-medium mt-4">
              <a href="https://wa.me/972XXXXXXXXX" target="_blank" rel="noopener noreferrer">הצטרפו עכשיו</a>
            </Button>
          </div>
        </ContentContainer>
      </section>
    </div>
  )
}
