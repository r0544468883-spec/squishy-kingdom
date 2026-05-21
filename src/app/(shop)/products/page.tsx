'use client'

import { useEffect, useState } from 'react'
import { Product, Category } from '@/types'
import { getProducts } from '@/lib/products'
import { getCategories } from '@/lib/categories'
import ProductCard from '@/components/products/ProductCard'
import SectionTitle from '@/components/ui/SectionTitle'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('default')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [p, c] = await Promise.all([getProducts(), getCategories()])
        setProducts(p)
        setCategories(c)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = products
    .filter(p => selectedCategory === 'all' || p.category_id === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      return a.sort_order - b.sort_order
    })

  if (loading) return <LoadingSpinner text="טוען את הממלכה..." />

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <SectionTitle title="החנות המלכותית" subtitle="כל הטרנדים במקום אחד" />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="bg-white border-2 border-kingdom-gold/30 rounded-xl px-4 py-2.5 text-sm text-kingdom-charcoal focus:border-kingdom-gold outline-none cursor-pointer"
        >
          <option value="all">כל הקטגוריות</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="bg-white border-2 border-kingdom-gold/30 rounded-xl px-4 py-2.5 text-sm text-kingdom-charcoal focus:border-kingdom-gold outline-none cursor-pointer"
        >
          <option value="default">מיון: ברירת מחדל</option>
          <option value="price-asc">מחיר: נמוך לגבוה</option>
          <option value="price-desc">מחיר: גבוה לנמוך</option>
          <option value="newest">חדשים ביותר</option>
        </select>
      </div>

      {/* Products Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="אין מוצרים"
          description="עדיין לא הוספו מוצרים לקטגוריה הזו"
          actionLabel="חזרה לראשי"
          actionHref="/"
        />
      )}
    </div>
  )
}
