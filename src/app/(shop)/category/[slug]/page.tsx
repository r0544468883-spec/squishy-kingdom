'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Product, Category } from '@/types'
import { getProducts } from '@/lib/products'
import { getCategoryBySlug } from '@/lib/categories'
import ProductCard from '@/modules/products/components/product-card'
import ProductGridSkeleton from '@/modules/skeletons/product-grid-skeleton'
import ContentContainer from '@/modules/common/components/content-container'
import { Button } from '@/components/ui/button'

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string

  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const cat = await getCategoryBySlug(slug)
      setCategory(cat)
      if (cat) {
        const prods = await getProducts()
        setProducts(prods.filter(p => p.category_id === cat.id))
      }
      setLoading(false)
    }
    load()
  }, [slug])

  if (!loading && !category) {
    return (
      <ContentContainer className="py-20 text-center">
        <h2 className="text-xl font-heading mb-2">הקטגוריה לא נמצאה</h2>
        <p className="text-muted-foreground mb-6">נראה שתעיתם מהדרך בממלכה...</p>
        <Button asChild><Link href="/products">חזרה לחנות</Link></Button>
      </ContentContainer>
    )
  }

  return (
    <div className="py-8 md:py-12">
      <ContentContainer>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">ראשי</Link>
          <ChevronLeft className="w-3 h-3" />
          <Link href="/products" className="hover:text-foreground transition-colors">חנות</Link>
          <ChevronLeft className="w-3 h-3" />
          <span className="text-foreground">{category?.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-section text-foreground mb-2">{category?.name}</h1>
          {category?.description && <p className="text-muted-foreground">{category.description}</p>}
        </div>

        {/* Grid */}
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">בקרוב יגיעו מוצרים חדשים!</p>
            <Button asChild variant="outline"><Link href="/products">לכל המוצרים</Link></Button>
          </div>
        )}
      </ContentContainer>
    </div>
  )
}
