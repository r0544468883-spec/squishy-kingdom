'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Category } from '@/types'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => { loadCategories() }, [])

  async function loadCategories() {
    const supabase = createClient()
    const { data } = await supabase.from('categories').select('*').order('sort_order')
    setCategories((data || []) as Category[])
    setLoading(false)
  }

  function startEdit(cat: Category) {
    setEditId(cat.id)
    setName(cat.name)
    setSlug(cat.slug)
    setDescription(cat.description || '')
    setShowForm(true)
  }

  function resetForm() {
    setEditId(null)
    setName('')
    setSlug('')
    setDescription('')
    setShowForm(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()
    const data = {
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^\u0590-\u05FFa-z0-9-]/g, ''),
      description: description || null,
    }

    if (editId) {
      await supabase.from('categories').update(data).eq('id', editId)
    } else {
      await supabase.from('categories').insert(data)
    }

    resetForm()
    loadCategories()
  }

  async function deleteCategory(id: string) {
    if (!confirm('למחוק את הקטגוריה?')) return
    const supabase = createClient()
    await supabase.from('categories').delete().eq('id', id)
    loadCategories()
  }

  const inputClass = "w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-kingdom-red"

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">קטגוריות</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="flex items-center gap-2 bg-kingdom-red text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-kingdom-red-hover transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          קטגוריה חדשה
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
          <h2 className="font-bold text-gray-900">{editId ? 'עריכת קטגוריה' : 'קטגוריה חדשה'}</h2>
          <div>
            <label className="block text-sm text-gray-600 mb-1">שם *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Slug</label>
            <input type="text" value={slug} onChange={e => setSlug(e.target.value)} className={inputClass} dir="ltr" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">תיאור</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className={inputClass} rows={2} />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm cursor-pointer">
              ביטול
            </button>
            <button type="submit" className="bg-kingdom-red text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-kingdom-red-hover cursor-pointer">
              {editId ? 'עדכון' : 'יצירה'}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">טוען...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-400">אין קטגוריות</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">{cat.name}</p>
                  <p className="text-xs text-gray-400">{cat.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => startEdit(cat)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteCategory(cat.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
