'use client'

import { useState } from 'react'
import { Gift, Sparkles } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { Product } from '@/types'

const MYSTERY_BOX_PRODUCT: Product = {
  id: 'mystery-box-upsell',
  category_id: null,
  name: 'תיבת האוצר המלכותית',
  slug: 'royal-mystery-box',
  description: 'הפתעה מהממלכה! סקוויש או צעצוע טרנדי בשווי לפחות ₪40',
  price: 19,
  compare_at_price: 40,
  image_url: 'https://i.imgur.com/JQxPZKt.jpg',
  shadow_image_url: null,
  video_url: null,
  gallery_urls: [],
  stock_quantity: 100,
  is_active: true,
  is_featured: false,
  is_new: false,
  is_mystery: true,
  tags: [],
  sort_order: 0,
  created_at: '',
  updated_at: '',
}

export default function MysteryBoxUpsell() {
  const { addToCart, items } = useCart()
  const [added, setAdded] = useState(false)

  // Don't show if already in cart
  if (items.some(i => i.product.slug === 'royal-mystery-box') || added) return null

  const handleAdd = () => {
    addToCart(MYSTERY_BOX_PRODUCT)
    setAdded(true)
  }

  return (
    <div className="bg-gradient-to-l from-kingdom-gold/10 to-kingdom-purple/10 rounded-2xl p-4 border border-kingdom-gold/30 animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-xl bg-kingdom-gold/20 flex items-center justify-center flex-shrink-0 animate-float-slow">
          <Gift className="w-7 h-7 text-kingdom-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-fun font-bold text-sm text-kingdom-charcoal flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-kingdom-gold" />
            תיבת אוצר מהממלכה!
          </h4>
          <p className="text-xs text-kingdom-charcoal/50 font-fun">
            הפתעה בשווי ₪40 — רק ₪19!
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-kingdom-gold text-kingdom-charcoal px-4 py-2 rounded-xl text-sm font-fun font-bold hover:bg-kingdom-gold-dark transition-colors cursor-pointer whitespace-nowrap"
        >
          +₪19
        </button>
      </div>
    </div>
  )
}
