'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, FolderTree, ShoppingCart, Ticket, MapPin, Menu, X, LogOut } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'דשבורד', icon: LayoutDashboard },
  { href: '/admin/products', label: 'מוצרים', icon: Package },
  { href: '/admin/categories', label: 'קטגוריות', icon: FolderTree },
  { href: '/admin/orders', label: 'הזמנות', icon: ShoppingCart },
  { href: '/admin/coupons', label: 'קופונים', icon: Ticket },
  { href: '/admin/popups', label: 'פופ-אפ', icon: MapPin },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 right-0 z-50 w-64 bg-white border-l border-gray-200 transform transition-transform md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className="font-bold text-lg text-gray-900">SquishyAdi Admin</h1>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map(item => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-kingdom-red text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors">
            <LogOut className="w-5 h-5" />
            חזרה לחנות
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <h1 className="font-bold text-gray-900">Admin</h1>
          <button onClick={() => setSidebarOpen(true)} className="cursor-pointer">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
