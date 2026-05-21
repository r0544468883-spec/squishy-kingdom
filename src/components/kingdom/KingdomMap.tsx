'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Castle, TreePine, Mountain, Star, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Category } from '@/types'
import AdiGuide from './AdiGuide'
import { springPlayful } from '@/components/motion'

interface KingdomMapProps {
  categories: Category[]
}

const zoneConfigs = [
  {
    gradient: 'from-pink-200/60 to-rose-100/60',
    border: 'border-pink-300',
    icon: Castle,
    emoji: '🏰',
    terrain: 'טירת הסקווישים',
    span: 'col-span-2 row-span-2',
  },
  {
    gradient: 'from-emerald-200/60 to-green-100/60',
    border: 'border-emerald-300',
    icon: TreePine,
    emoji: '🌲',
    terrain: 'יער הנמתחים',
    span: 'col-span-2',
  },
  {
    gradient: 'from-violet-200/60 to-purple-100/60',
    border: 'border-violet-300',
    icon: Mountain,
    emoji: '🎁',
    terrain: 'הר המארזים',
    span: 'col-span-2',
  },
  {
    gradient: 'from-amber-200/60 to-yellow-100/60',
    border: 'border-amber-300',
    icon: Star,
    emoji: '✨',
    terrain: 'מערת ההפתעות',
    span: 'col-span-2 row-span-2',
  },
]

export default function KingdomMap({ categories }: KingdomMapProps) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)

  return (
    <div className="relative">
      <div className="text-center mb-8">
        <h2 className="text-section text-kingdom-charcoal">מפת הממלכה</h2>
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="w-10 h-0.5 bg-kingdom-red/20 rounded-full" />
          <div className="w-20 h-1 bg-gradient-to-l from-kingdom-gold to-kingdom-red rounded-full" />
          <div className="w-10 h-0.5 bg-kingdom-red/20 rounded-full" />
        </div>
        <p className="font-body text-kingdom-charcoal/40 mt-4">לחצו על טריטוריה כדי לחקור!</p>
      </div>

      <AdiGuide
        message={hoveredZone
          ? `בואו נחקור את ${hoveredZone}! שם מחכים הטרנדים הכי שווים!`
          : 'שלום! אני עדי 👑 לחצו על אזור במפה כדי להתחיל את הסיור!'
        }
      />

      {/* Map Grid */}
      <div className="grid grid-cols-4 gap-3 md:gap-4 mt-6 max-w-3xl mx-auto">
        {categories.map((cat, i) => {
          const config = zoneConfigs[i % zoneConfigs.length]
          const Icon = config.icon

          return (
            <motion.div
              key={cat.id}
              className={config.span}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ ...springPlayful, delay: i * 0.1 }}
            >
              <Link href={`/category/${cat.slug}`}>
                <motion.div
                  className={`
                    relative group cursor-pointer
                    bg-gradient-to-br ${config.gradient}
                    border-2 ${config.border}
                    rounded-2xl md:rounded-3xl p-4 md:p-6 h-full
                  `}
                  whileHover={{ scale: 1.04, y: -6 }}
                  whileTap={{ scale: 0.97 }}
                  transition={springPlayful}
                  onHoverStart={() => setHoveredZone(config.terrain)}
                  onHoverEnd={() => setHoveredZone(null)}
                >
                  <Icon className="absolute top-3 left-3 w-6 h-6 md:w-8 md:h-8 opacity-15 group-hover:opacity-30 transition-opacity" />

                  <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[100px] md:min-h-[140px] text-center">
                    <motion.span
                      className="text-3xl md:text-5xl mb-2"
                      whileHover={{ scale: 1.3, rotate: [0, -10, 10, 0] }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      {config.emoji}
                    </motion.span>
                    <h3 className="font-heading font-bold text-base md:text-xl text-kingdom-charcoal mb-1">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] md:text-xs text-kingdom-charcoal/40 font-body">
                      {config.terrain}
                    </p>
                  </div>

                  <Sparkles className="absolute bottom-2 right-2 w-4 h-4 text-kingdom-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </Link>
            </motion.div>
          )
        })}

        {/* Games Zone */}
        <motion.div
          className="col-span-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/games">
            <motion.div
              className="bg-gradient-to-l from-kingdom-red/8 via-kingdom-gold/8 to-kingdom-purple/8 border-2 border-dashed border-kingdom-gold/40 rounded-2xl md:rounded-3xl p-4 md:p-5 cursor-pointer"
              whileHover={{ scale: 1.02, borderColor: 'rgba(255,215,0,0.8)' }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setHoveredZone('זירת המשחקים')}
              onHoverEnd={() => setHoveredZone(null)}
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl md:text-3xl">🎮</span>
                <div className="text-center">
                  <h3 className="font-bubble text-lg md:text-2xl text-kingdom-charcoal">זירת המשחקים</h3>
                  <p className="text-xs text-kingdom-charcoal/40 font-body">גלגל מזל, מבוך, ציד אוצרות ועוד!</p>
                </div>
                <span className="text-2xl md:text-3xl">🎡</span>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
