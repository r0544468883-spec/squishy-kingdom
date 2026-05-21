'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Crown, Sparkles, TreePine, Castle, Mountain, Waves, Star } from 'lucide-react'
import { Category } from '@/types'
import AdiGuide from './AdiGuide'

interface KingdomMapProps {
  categories: Category[]
}

const zoneStyles = [
  {
    bg: 'from-pink-400/20 to-rose-300/20',
    border: 'border-pink-400/50',
    hoverBg: 'hover:from-pink-400/30 hover:to-rose-300/30',
    icon: Castle,
    emoji: '🏰',
    position: 'col-span-2 row-span-2',
    terrain: 'טירת הסקווישים',
  },
  {
    bg: 'from-emerald-400/20 to-green-300/20',
    border: 'border-emerald-400/50',
    hoverBg: 'hover:from-emerald-400/30 hover:to-green-300/30',
    icon: TreePine,
    emoji: '🌲',
    position: 'col-span-2',
    terrain: 'יער הנמתחים',
  },
  {
    bg: 'from-violet-400/20 to-purple-300/20',
    border: 'border-violet-400/50',
    hoverBg: 'hover:from-violet-400/30 hover:to-purple-300/30',
    icon: Mountain,
    emoji: '🎁',
    position: 'col-span-2',
    terrain: 'הר המארזים',
  },
  {
    bg: 'from-amber-400/20 to-yellow-300/20',
    border: 'border-amber-400/50',
    hoverBg: 'hover:from-amber-400/30 hover:to-yellow-300/30',
    icon: Star,
    emoji: '✨',
    position: 'col-span-2 row-span-2',
    terrain: 'מערת ההפתעות',
  },
]

export default function KingdomMap({ categories }: KingdomMapProps) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)

  return (
    <div className="relative">
      {/* Map Title */}
      <div className="text-center mb-8">
        <h2 className="font-bubble text-3xl md:text-5xl text-kingdom-charcoal mb-2">
          מפת הממלכה
        </h2>
        <p className="text-kingdom-charcoal/50 font-fun">לחצו על טריטוריה כדי לחקור אותה!</p>
      </div>

      {/* Adi Guide */}
      <AdiGuide
        message={hoveredZone
          ? `בואו נחקור את ${hoveredZone}! שם מחכים הטרנדים הכי שווים!`
          : 'שלום! אני עדי 👑 לחצו על אזור במפה כדי להתחיל את הסיור!'
        }
      />

      {/* Map Grid */}
      <div className="grid grid-cols-4 gap-3 md:gap-4 mt-6 max-w-3xl mx-auto">
        {categories.map((cat, i) => {
          const style = zoneStyles[i % zoneStyles.length]
          const Icon = style.icon

          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className={`
                ${style.position}
                relative group cursor-pointer
                bg-gradient-to-br ${style.bg} ${style.hoverBg}
                border-2 ${style.border}
                rounded-2xl md:rounded-3xl p-4 md:p-6
                transition-all duration-500
                hover:scale-[1.03] hover:shadow-xl hover:shadow-kingdom-gold/10
                hover:-translate-y-1
              `}
              onMouseEnter={() => setHoveredZone(style.terrain)}
              onMouseLeave={() => setHoveredZone(null)}
            >
              {/* Terrain decorations */}
              <div className="absolute top-2 left-2 opacity-20 group-hover:opacity-40 transition-opacity">
                <Icon className="w-6 h-6 md:w-8 md:h-8" />
              </div>

              {/* Zone content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[100px] md:min-h-[140px] text-center">
                <span className="text-3xl md:text-5xl mb-2 group-hover:animate-bounce-in transition-transform">
                  {style.emoji}
                </span>
                <h3 className="font-fun font-bold text-base md:text-xl text-kingdom-charcoal mb-1">
                  {cat.name}
                </h3>
                <p className="text-[10px] md:text-xs text-kingdom-charcoal/50 font-fun">
                  {style.terrain}
                </p>
              </div>

              {/* Sparkle on hover */}
              <Sparkles className="absolute bottom-2 right-2 w-4 h-4 text-kingdom-gold opacity-0 group-hover:opacity-100 group-hover:animate-sparkle transition-opacity" />

              {/* Connecting paths (decorative dots) */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1 opacity-30">
                <div className="w-1.5 h-1.5 rounded-full bg-kingdom-gold" />
                <div className="w-1.5 h-1.5 rounded-full bg-kingdom-gold" />
                <div className="w-1.5 h-1.5 rounded-full bg-kingdom-gold" />
              </div>
            </Link>
          )
        })}

        {/* Games Zone — Always visible */}
        <Link
          href="/games"
          className="col-span-4 relative group cursor-pointer bg-gradient-to-l from-kingdom-red/10 via-kingdom-gold/10 to-kingdom-purple/10 border-2 border-dashed border-kingdom-gold/50 rounded-2xl md:rounded-3xl p-4 md:p-5 transition-all duration-500 hover:scale-[1.02] hover:border-kingdom-gold hover:shadow-lg"
          onMouseEnter={() => setHoveredZone('זירת המשחקים')}
          onMouseLeave={() => setHoveredZone(null)}
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl md:text-3xl">🎮</span>
            <div className="text-center">
              <h3 className="font-bubble text-lg md:text-2xl text-kingdom-charcoal">זירת המשחקים</h3>
              <p className="text-xs text-kingdom-charcoal/50 font-fun">גלגל מזל, מבוך, ציד אוצרות ועוד!</p>
            </div>
            <span className="text-2xl md:text-3xl">🎡</span>
          </div>
        </Link>
      </div>
    </div>
  )
}
