'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface OrderRow {
  id: string
  order_number: number
  customer_name: string | null
  customer_phone: string | null
  total: number
  status: string
  payment_status: string
  shipping_method: string | null
  created_at: string
}

const statusLabels: Record<string, string> = {
  pending: 'ממתין', paid: 'שולם', processing: 'בטיפול',
  shipped: 'נשלח', delivered: 'הגיע', cancelled: 'בוטל',
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800', paid: 'bg-green-100 text-green-800',
  processing: 'bg-blue-100 text-blue-800', shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-gray-100 text-gray-800', cancelled: 'bg-red-100 text-red-800',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadOrders() }, [])

  async function loadOrders() {
    const supabase = createClient()
    const { data } = await supabase
      .from('orders')
      .select('id, order_number, customer_name, customer_phone, total, status, payment_status, shipping_method, created_at')
      .order('created_at', { ascending: false })
    setOrders((data || []) as OrderRow[])
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    const supabase = createClient()
    await supabase.from('orders').update({ status }).eq('id', id)
    loadOrders()
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">הזמנות</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['all', 'pending', 'paid', 'processing', 'shipped', 'delivered'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
              filter === s ? 'bg-kingdom-red text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {s === 'all' ? 'הכל' : statusLabels[s]}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">טוען...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">#</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">לקוח</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500 hidden md:table-cell">טלפון</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">סכום</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">סטטוס</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500 hidden md:table-cell">תאריך</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">עדכון</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{order.order_number}</td>
                    <td className="px-4 py-3">{order.customer_name || '—'}</td>
                    <td className="px-4 py-3 hidden md:table-cell" dir="ltr">{order.customer_phone || '—'}</td>
                    <td className="px-4 py-3 font-medium">₪{order.total?.toFixed(0)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || ''}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                      {new Date(order.created_at).toLocaleDateString('he-IL')}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none cursor-pointer"
                      >
                        {Object.entries(statusLabels).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
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
