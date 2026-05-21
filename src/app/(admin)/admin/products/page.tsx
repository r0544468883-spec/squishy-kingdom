'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select('*, category:categories(name)')
      .order('created_at', { ascending: false })
    setProducts((data || []) as unknown as Product[])
    setLoading(false)
  }

  async function toggleActive(id: string, isActive: boolean) {
    const supabase = createClient()
    await supabase.from('products').update({ is_active: !isActive }).eq('id', id)
    loadProducts()
  }

  async function deleteProduct(id: string) {
    if (!confirm('למחוק את המוצר?')) return
    const supabase = createClient()
    await supabase.from('products').delete().eq('id', id)
    loadProducts()
  }

  const filtered = products.filter(p =>
    p.name.includes(search) || p.slug.includes(search)
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">מוצרים</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-kingdom-red text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-kingdom-red-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          מוצר חדש
        </Link>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="חיפוש מוצר..."
        className="w-full md:w-80 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-4 outline-none focus:border-kingdom-red"
      />

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">טוען...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">תמונה</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">שם</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500 hidden md:table-cell">קטגוריה</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">מחיר</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500 hidden md:table-cell">מלאי</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">סטטוס</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                        <Image src={product.image_url} alt="" fill className="object-contain" />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                      {(product.category as unknown as { name: string })?.name || '—'}
                    </td>
                    <td className="px-4 py-3">₪{product.price}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={product.stock_quantity <= 5 ? 'text-red-600 font-bold' : ''}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(product.id, product.is_active)}
                        className="cursor-pointer"
                        title={product.is_active ? 'פעיל' : 'מוסתר'}
                      >
                        {product.is_active
                          ? <Eye className="w-4 h-4 text-green-600" />
                          : <EyeOff className="w-4 h-4 text-gray-400" />
                        }
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
