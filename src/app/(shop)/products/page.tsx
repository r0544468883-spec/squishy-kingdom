'use client'

import { useEffect, useState } from 'react'
import { Product, Category } from '@/types'
import { getProducts } from '@/lib/products'
import { getCategories } from '@/lib/categories'
import ProductCard from '@/modules/products/components/product-card'
import ProductGridSkeleton from '@/modules/skeletons/product-grid-skeleton'
import ContentContainer from '@/modules/common/components/content-container'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('default')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [p, c] = await Promise.all([getProducts(), getCategories()])
      setProducts(p)
      setCategories(c)
      setLoading(false)
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

  return (
    <div className="py-8 md:py-12">
      <ContentContainer>
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-section text-foreground mb-2">החנות</h1>
          <p className="text-muted-foreground">כל הטרנדים הכי שווים במקום אחד</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className={cn(selectedCategory === 'all' && 'bg-kingdom-red hover:bg-kingdom-red-hover text-white')}
            >
              הכל
            </Button>
            {categories.map(cat => (
              <Button
                key={cat.id}
                size="sm"
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(selectedCategory === cat.id && 'bg-kingdom-red hover:bg-kingdom-red-hover text-white')}
              >
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Sort */}
          <div className="mr-auto">
            <Select value={sortBy} onValueChange={(v) => v && setSortBy(v)}>
              <SelectTrigger className="w-[160px] h-9 text-sm">
                <SelectValue placeholder="מיון" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">ברירת מחדל</SelectItem>
                <SelectItem value="price-asc">מחיר: נמוך לגבוה</SelectItem>
                <SelectItem value="price-desc">מחיר: גבוה לנמוך</SelectItem>
                <SelectItem value="newest">חדשים ביותר</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">אין מוצרים בקטגוריה הזו</p>
            <Button onClick={() => setSelectedCategory('all')} variant="outline">הצגת כל המוצרים</Button>
          </div>
        )}
      </ContentContainer>
    </div>
  )
}
