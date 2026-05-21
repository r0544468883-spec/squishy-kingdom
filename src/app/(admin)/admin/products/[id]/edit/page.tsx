'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types'
import ProductForm from '@/components/admin/ProductForm'

export default function EditProductPage() {
  const params = useParams()
  const id = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from('products').select('*').eq('id', id).single()
      setProduct(data as Product)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="text-center py-12 text-gray-400">טוען...</div>
  if (!product) return <div className="text-center py-12 text-gray-400">מוצר לא נמצא</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">עריכת מוצר: {product.name}</h1>
      <ProductForm product={product} />
    </div>
  )
}
