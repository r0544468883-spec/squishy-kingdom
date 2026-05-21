'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ShoppingCart, Package, Users, DollarSign } from 'lucide-react'
import Link from 'next/link'

interface Stats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  totalCustomers: number
  recentOrders: Array<{
    id: string
    order_number: number
    customer_name: string
    total: number
    status: string
    created_at: string
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      const supabase = createClient()

      const [orders, products, customers] = await Promise.all([
        supabase.from('orders').select('id, order_number, customer_name, total, status, created_at').order('created_at', { ascending: false }),
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('customers').select('id', { count: 'exact' }),
      ])

      const allOrders = (orders.data || []) as Stats['recentOrders']
      const revenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0)

      setStats({
        totalOrders: allOrders.length,
        totalRevenue: revenue,
        totalProducts: products.count || 0,
        totalCustomers: customers.count || 0,
        recentOrders: allOrders.slice(0, 10),
      })
      setLoading(false)
    }
    loadStats()
  }, [])

  const statCards = [
    { label: 'הזמנות', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-blue-50 text-blue-600' },
    { label: 'הכנסות', value: `₪${stats.totalRevenue.toFixed(0)}`, icon: DollarSign, color: 'bg-green-50 text-green-600' },
    { label: 'מוצרים', value: stats.totalProducts, icon: Package, color: 'bg-purple-50 text-purple-600' },
    { label: 'לקוחות', value: stats.totalCustomers, icon: Users, color: 'bg-amber-50 text-amber-600' },
  ]

  const statusLabels: Record<string, string> = {
    pending: 'ממתין',
    paid: 'שולם',
    processing: 'בטיפול',
    shipped: 'נשלח',
    delivered: 'הגיע',
    cancelled: 'בוטל',
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500">טוען...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">דשבורד</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map(card => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          )
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-900">הזמנות אחרונות</h2>
          <Link href="/admin/orders" className="text-sm text-kingdom-red hover:underline">
            כל ההזמנות
          </Link>
        </div>

        {stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">#</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">לקוח</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">סכום</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">סטטוס</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">תאריך</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{order.order_number}</td>
                    <td className="px-4 py-3">{order.customer_name || '—'}</td>
                    <td className="px-4 py-3 font-medium">₪{order.total?.toFixed(0)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || ''}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('he-IL')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">
            עדיין אין הזמנות
          </div>
        )}
      </div>
    </div>
  )
}
