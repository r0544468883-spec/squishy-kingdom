'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Coupon } from '@/types'

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const [code, setCode] = useState('')
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage')
  const [discountValue, setDiscountValue] = useState('')
  const [minOrder, setMinOrder] = useState('')
  const [maxUses, setMaxUses] = useState('')
  const [expiresAt, setExpiresAt] = useState('')

  useEffect(() => { loadCoupons() }, [])

  async function loadCoupons() {
    const supabase = createClient()
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false })
    setCoupons((data || []) as Coupon[])
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()
    await supabase.from('coupons').insert({
      code: code.toUpperCase(),
      discount_type: discountType,
      discount_value: parseFloat(discountValue),
      min_order_amount: minOrder ? parseFloat(minOrder) : 0,
      max_uses: maxUses ? parseInt(maxUses) : null,
      expires_at: expiresAt || null,
    })
    setShowForm(false)
    setCode(''); setDiscountValue(''); setMinOrder(''); setMaxUses(''); setExpiresAt('')
    loadCoupons()
  }

  async function deleteCoupon(id: string) {
    if (!confirm('למחוק את הקופון?')) return
    const supabase = createClient()
    await supabase.from('coupons').delete().eq('id', id)
    loadCoupons()
  }

  const inputClass = "w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-kingdom-red"

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">קופונים</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-kingdom-red text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-kingdom-red-hover transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          קופון חדש
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">קוד *</label>
              <input type="text" value={code} onChange={e => setCode(e.target.value)} className={inputClass} placeholder="KINGDOM10" dir="ltr" required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">סוג הנחה</label>
              <select value={discountType} onChange={e => setDiscountType(e.target.value as 'percentage' | 'fixed')} className={inputClass}>
                <option value="percentage">אחוז (%)</option>
                <option value="fixed">סכום קבוע (₪)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">ערך הנחה *</label>
              <input type="number" value={discountValue} onChange={e => setDiscountValue(e.target.value)} className={inputClass} dir="ltr" required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">הזמנה מינימלית (₪)</label>
              <input type="number" value={minOrder} onChange={e => setMinOrder(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">שימושים מקס</label>
              <input type="number" value={maxUses} onChange={e => setMaxUses(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">תוקף עד</label>
              <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className={inputClass} dir="ltr" />
            </div>
          </div>
          <button type="submit" className="bg-kingdom-red text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-kingdom-red-hover cursor-pointer">
            יצירת קופון
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">טוען...</div>
        ) : coupons.length === 0 ? (
          <div className="p-8 text-center text-gray-400">אין קופונים</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">קוד</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">הנחה</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500 hidden md:table-cell">מינימום</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500 hidden md:table-cell">שימושים</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500 hidden md:table-cell">תוקף</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {coupons.map(coupon => (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-bold">{coupon.code}</td>
                    <td className="px-4 py-3">
                      {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₪${coupon.discount_value}`}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">₪{coupon.min_order_amount}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {coupon.current_uses}/{coupon.max_uses || '∞'}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-500">
                      {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString('he-IL') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteCoupon(coupon.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
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
