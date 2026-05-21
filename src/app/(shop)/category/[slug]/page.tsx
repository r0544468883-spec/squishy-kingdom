'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Product, Category } from '@/types'
import { getProducts } from '@/lib/products'
import { getCategoryBySlug } from '@/lib/categories'
import ProductCard from '@/components/products/ProductCard'
import SectionTitle from '@/components/ui/SectionTitle'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import Link from 'next/link'

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string

  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const cat = await getCategoryBySlug(slug)
        setCategory(cat)
        if (cat) {
          const prods = await getProducts()
          setProducts(prods.filter(p => p.category_id === cat.id))
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  if (loading) return <LoadingSpinner />

  if (!category) {
    return (
      <EmptyState
        title="החדר לא נמצא"
        description="נראה שתעיתם מהדרך בממלכה..."
        actionLabel="חזרה לממלכה"
        actionHref="/"
      />
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-kingdom-charcoal/50 mb-6">
        <Link href="/" className="hover:text-kingdom-red transition-colors">ראשי</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-kingdom-red transition-colors">חנות</Link>
        <span>/</span>
        <span className="text-kingdom-charcoal">{category.name}</span>
      </div>

      <SectionTitle
        title={category.name}
        subtitle={category.description || undefined}
      />

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="החדר ריק"
          description="בקרוב יגיעו מוצרים חדשים לחדר הזה!"
          actionLabel="לחדרים אחרים"
          actionHref="/products"
        />
      )}
    </div>
  )
}
