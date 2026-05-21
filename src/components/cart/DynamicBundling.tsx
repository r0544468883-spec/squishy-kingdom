'use client'

import { useCart } from '@/hooks/useCart'
import { Sparkles } from 'lucide-react'

export default function DynamicBundling() {
  const { items } = useCart()

  // Only show when there's exactly 1 item
  if (items.length !== 1) return null

  const item = items[0]

  return (
    <div className="bg-kingdom-pink/5 rounded-2xl p-3 border border-kingdom-pink/20">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-kingdom-pink flex-shrink-0" />
        <p className="font-fun text-xs text-kingdom-charcoal/70">
          ל<span className="font-bold">{item.product.name}</span> משעמם לבד בטירה!
          קחו לו חבר ב-<span className="text-kingdom-red font-bold">20% הנחה</span> 🏰
        </p>
      </div>
    </div>
  )
}
