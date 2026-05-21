'use client'

import { useState } from 'react'
import { Dices, Compass, Search, Hand } from 'lucide-react'
import WheelOfFortune from '@/components/games/WheelOfFortune'
import RoyalMaze from '@/components/games/RoyalMaze'
import TreasureHunt from '@/components/games/TreasureHunt'
import VirtualSquish from '@/components/games/VirtualSquish'
import AdiGuide from '@/components/kingdom/AdiGuide'
import SectionTitle from '@/components/ui/SectionTitle'

type GameTab = 'wheel' | 'maze' | 'treasure' | 'squish'

const games = [
  { id: 'wheel' as GameTab, label: 'גלגל הקסמים', icon: Dices, emoji: '🎡' },
  { id: 'maze' as GameTab, label: 'מבוך הארמון', icon: Compass, emoji: '🏰' },
  { id: 'treasure' as GameTab, label: 'ציד אוצרות', icon: Search, emoji: '💎' },
  { id: 'squish' as GameTab, label: 'מעיכה!', icon: Hand, emoji: '🤗' },
]

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<GameTab>('wheel')

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title="זירת המשחקים"
        subtitle="שחקו וזכו בפרסים מהממלכה!"
      />

      <div className="mb-8">
        <AdiGuide
          message={
            activeGame === 'wheel' ? 'סובבו את הגלגל וזכו בפרסים! 🎡'
            : activeGame === 'maze' ? 'עזרו לסקווישי להגיע לארמון! 🏰'
            : activeGame === 'treasure' ? 'מצאו את הסקווישים המוסתרים! 💎'
            : 'מעכו את הסקוויש כמה שאפשר! 🤗'
          }
        />
      </div>

      {/* Game Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 -mx-4 px-4">
        {games.map(game => (
          <button
            key={game.id}
            onClick={() => setActiveGame(game.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-fun font-medium text-sm whitespace-nowrap cursor-pointer transition-all duration-300 ${
              activeGame === game.id
                ? 'bg-gradient-to-l from-kingdom-red to-kingdom-red-light text-white shadow-lg shadow-kingdom-red/20 scale-105'
                : 'bg-white border-2 border-kingdom-gold/20 text-kingdom-charcoal hover:border-kingdom-gold/50 hover:bg-kingdom-parchment'
            }`}
          >
            <span className="text-lg">{game.emoji}</span>
            {game.label}
          </button>
        ))}
      </div>

      {/* Game Content */}
      <div className="min-h-[400px]">
        {activeGame === 'wheel' && <WheelOfFortune />}
        {activeGame === 'maze' && <RoyalMaze />}
        {activeGame === 'treasure' && <TreasureHunt />}
        {activeGame === 'squish' && (
          <VirtualSquish
            imageUrl="https://i.imgur.com/JQxPZKt.jpg"
            name="סקוויש טוסט חתול"
          />
        )}
      </div>
    </div>
  )
}
