'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Upload } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Product, Category } from '@/types'

interface ProductFormProps {
  product?: Product
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const isEdit = !!product
  const [submitting, setSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  const [name, setName] = useState(product?.name || '')
  const [slug, setSlug] = useState(product?.slug || '')
  const [description, setDescription] = useState(product?.description || '')
  const [categoryId, setCategoryId] = useState(product?.category_id || '')
  const [price, setPrice] = useState(product?.price?.toString() || '')
  const [comparePrice, setComparePrice] = useState(product?.compare_at_price?.toString() || '')
  const [stock, setStock] = useState(product?.stock_quantity?.toString() || '0')
  const [imageUrl, setImageUrl] = useState(product?.image_url || '')
  const [shadowUrl, setShadowUrl] = useState(product?.shadow_image_url || '')
  const [videoUrl, setVideoUrl] = useState(product?.video_url || '')
  const [isActive, setIsActive] = useState(product?.is_active ?? true)
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false)
  const [isNew, setIsNew] = useState(product?.is_new ?? true)
  const [isMystery, setIsMystery] = useState(product?.is_mystery ?? false)
  const [tags, setTags] = useState(product?.tags?.join(', ') || '')

  useEffect(() => {
    async function loadCategories() {
      const supabase = createClient()
      const { data } = await supabase.from('categories').select('*').order('sort_order')
      setCategories((data || []) as Category[])
    }
    loadCategories()
  }, [])

  // Auto-generate slug from name
  useEffect(() => {
    if (!isEdit && name) {
      const s = name
        .trim()
        .toLowerCase()
        .replace(/[^\u0590-\u05FFa-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
      setSlug(s || `product-${Date.now()}`)
    }
  }, [name, isEdit])

  async function uploadImage(file: File, folder: string): Promise<string> {
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('products').upload(fileName, file)
    if (error) throw error
    const { data } = supabase.storage.from('products').getPublicUrl(fileName)
    return data.publicUrl
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const url = await uploadImage(file, 'images')
      setter(url)
    } catch (err) {
      console.error('Upload failed:', err)
      alert('שגיאה בהעלאת תמונה')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    const supabase = createClient()
    const data = {
      name,
      slug: slug || `product-${Date.now()}`,
      description: description || null,
      category_id: categoryId || null,
      price: parseFloat(price),
      compare_at_price: comparePrice ? parseFloat(comparePrice) : null,
      stock_quantity: parseInt(stock),
      image_url: imageUrl,
      shadow_image_url: shadowUrl || null,
      video_url: videoUrl || null,
      is_active: isActive,
      is_featured: isFeatured,
      is_new: isNew,
      is_mystery: isMystery,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    }

    try {
      if (isEdit) {
        await supabase.from('products').update(data).eq('id', product!.id)
      } else {
        await supabase.from('products').insert(data)
      }
      router.push('/admin/products')
    } catch (err) {
      console.error(err)
      alert('שגיאה בשמירת המוצר')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = "w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-kingdom-red"

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-bold text-gray-900">פרטים בסיסיים</h2>

        <div>
          <label className="block text-sm text-gray-600 mb-1">שם המוצר *</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} required />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Slug</label>
          <input type="text" value={slug} onChange={e => setSlug(e.target.value)} className={inputClass} dir="ltr" />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">קטגוריה</label>
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className={inputClass}>
            <option value="">ללא קטגוריה</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">תיאור</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className={inputClass} rows={3} />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">תגיות (מופרדות בפסיק)</label>
          <input type="text" value={tags} onChange={e => setTags(e.target.value)} className={inputClass} placeholder="סקוויש, טרנד, חדש" />
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-bold text-gray-900">תמחור ומלאי</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">מחיר (₪) *</label>
            <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className={inputClass} required dir="ltr" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">מחיר לפני הנחה (₪)</label>
            <input type="number" step="0.01" value={comparePrice} onChange={e => setComparePrice(e.target.value)} className={inputClass} dir="ltr" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">כמות במלאי</label>
          <input type="number" value={stock} onChange={e => setStock(e.target.value)} className={inputClass} dir="ltr" />
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-bold text-gray-900">תמונות</h2>

        <div>
          <label className="block text-sm text-gray-600 mb-1">תמונת מוצר *</label>
          {imageUrl && (
            <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100 mb-2">
              <img src={imageUrl} alt="preview" className="w-full h-full object-contain" />
            </div>
          )}
          <label className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-lg text-sm cursor-pointer w-fit transition-colors">
            <Upload className="w-4 h-4" />
            העלאת תמונה
            <input type="file" accept="image/*" onChange={e => handleImageUpload(e, setImageUrl)} className="hidden" />
          </label>
          <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className={`${inputClass} mt-2`} placeholder="או הדביקו URL" dir="ltr" />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">תמונת צללית (Shadow)</label>
          <label className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-lg text-sm cursor-pointer w-fit transition-colors">
            <Upload className="w-4 h-4" />
            העלאת צללית
            <input type="file" accept="image/*" onChange={e => handleImageUpload(e, setShadowUrl)} className="hidden" />
          </label>
          <input type="url" value={shadowUrl} onChange={e => setShadowUrl(e.target.value)} className={`${inputClass} mt-2`} placeholder="URL צללית" dir="ltr" />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">URL סרטון</label>
          <input type="url" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className={inputClass} placeholder="https://..." dir="ltr" />
        </div>
      </div>

      {/* Toggles */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
        <h2 className="font-bold text-gray-900">הגדרות</h2>
        {[
          { label: 'פעיל (מוצג בחנות)', value: isActive, setter: setIsActive },
          { label: 'מומלץ (מוצג בדף הראשי)', value: isFeatured, setter: setIsFeatured },
          { label: 'חדש (תג "חדש!")', value: isNew, setter: setIsNew },
          { label: 'מוצר מסתורי (Mystery Box)', value: isMystery, setter: setIsMystery },
        ].map(toggle => (
          <label key={toggle.label} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={toggle.value}
              onChange={e => toggle.setter(e.target.checked)}
              className="w-4 h-4 accent-kingdom-red"
            />
            <span className="text-sm text-gray-700">{toggle.label}</span>
          </label>
        ))}
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="px-6 py-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium cursor-pointer"
        >
          ביטול
        </button>
        <button
          type="submit"
          disabled={submitting || !name || !price || !imageUrl}
          className="flex-1 bg-kingdom-red text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-kingdom-red-hover disabled:opacity-50 cursor-pointer"
        >
          {submitting ? 'שומר...' : isEdit ? 'עדכון מוצר' : 'יצירת מוצר'}
        </button>
      </div>
    </form>
  )
}
