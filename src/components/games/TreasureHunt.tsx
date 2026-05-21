'use client'

import { useState, useEffect } from 'react'
import { Search, Sparkles, Eye } from 'lucide-react'
import RoyalButton from '@/components/ui/RoyalButton'

const HIDDEN_SPOTS = [
  { id: 1, emoji: '🧸', hint: 'מסתתר ליד משהו ורוד...', row: 1, col: 2 },
  { id: 2, emoji: '🦑', hint: 'חפשו ליד הכוכב הזהוב!', row: 2, col: 0 },
  { id: 3, emoji: '🐱', hint: 'מתחבא בפינה הכי רחוקה!', row: 0, col: 3 },
]

const GRID_ITEMS = [
  '🌸', '⭐', '🍄', '🦋',
  '🌺', '🧸', '🌈', '💎',
  '🦑', '🎀', '🌻', '🍬',
]

export default function TreasureHunt() {
  const [found, setFound] = useState<Set<number>>(new Set())
  const [attempts, setAttempts] = useState(0)
  const [currentHint, setCurrentHint] = useState(0)
  const [showWrongFeedback, setShowWrongFeedback] = useState<number | null>(null)
  const [gameComplete, setGameComplete] = useState(false)

  const hiddenPositions = new Set(HIDDEN_SPOTS.map(s => s.row * 4 + s.col))

  useEffect(() => {
    if (found.size === HIDDEN_SPOTS.length) {
      setGameComplete(true)
    }
  }, [found])

  const handleCellClick = (index: number) => {
    if (gameComplete) return
    setAttempts(prev => prev + 1)

    const spot = HIDDEN_SPOTS.find(s => s.row * 4 + s.col === index)
    if (spot && !found.has(spot.id)) {
      setFound(prev => new Set([...prev, spot.id]))
    } else {
      setShowWrongFeedback(index)
      setTimeout(() => setShowWrongFeedback(null), 600)
    }
  }

  const nextHint = () => {
    const unfound = HIDDEN_SPOTS.filter(s => !found.has(s.id))
    if (unfound.length > 0) {
      setCurrentHint(prev => (prev + 1) % unfound.length)
    }
  }

  const unfoundSpots = HIDDEN_SPOTS.filter(s => !found.has(s.id))

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto">
      {/* Status */}
      <div className="flex items-center gap-6 mb-6 font-fun">
        <div className="flex items-center gap-1.5 text-kingdom-gold">
          <Search className="w-5 h-5" />
          <span className="font-bold">{found.size}/{HIDDEN_SPOTS.length} נמצאו</span>
        </div>
        <div className="flex items-center gap-1.5 text-kingdom-charcoal/60">
          <Eye className="w-5 h-5" />
          <span>{attempts} ניסיונות</span>
        </div>
      </div>

      {/* Hint */}
      {!gameComplete && unfoundSpots.length > 0 && (
        <button
          onClick={nextHint}
          className="mb-4 bg-kingdom-gold/10 border border-kingdom-gold/30 rounded-xl px-4 py-2 font-fun text-sm text-kingdom-charcoal cursor-pointer hover:bg-kingdom-gold/20 transition-colors"
        >
          💡 רמז: {unfoundSpots[currentHint % unfoundSpots.length]?.hint}
        </button>
      )}

      {/* Grid */}
      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {GRID_ITEMS.map((item, index) => {
          const spot = HIDDEN_SPOTS.find(s => s.row * 4 + s.col === index)
          const isFound = spot && found.has(spot.id)
          const isWrong = showWrongFeedback === index

          return (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              className={`
                w-16 h-16 md:w-20 md:h-20 rounded-2xl text-2xl md:text-3xl
                flex items-center justify-center cursor-pointer
                transition-all duration-300 font-fun
                ${isFound
                  ? 'bg-kingdom-gold/20 border-2 border-kingdom-gold scale-110 shadow-lg shadow-kingdom-gold/20'
                  : isWrong
                    ? 'bg-red-100 border-2 border-red-300 animate-[shake_0.3s_ease-in-out]'
                    : 'bg-white border-2 border-kingdom-gold/20 hover:border-kingdom-gold/50 hover:bg-kingdom-parchment hover:scale-105 active:scale-95'
                }
              `}
            >
              {isFound ? (
                <span className="animate-bounce-in">{spot.emoji}</span>
              ) : (
                <span>{item}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Win state */}
      {gameComplete && (
        <div className="mt-8 text-center animate-bounce-in">
          <div className="bg-white rounded-2xl p-6 border-2 border-kingdom-gold shadow-xl">
            <Sparkles className="w-12 h-12 text-kingdom-gold mx-auto mb-2 animate-sparkle" />
            <h3 className="font-bubble text-2xl text-kingdom-charcoal mb-2">מצאתם את כולם!</h3>
            <p className="font-fun text-kingdom-charcoal/50 mb-1">
              ב-{attempts} ניסיונות בלבד!
            </p>
            <p className="font-fun text-kingdom-gold-dark font-bold">
              קיבלתם מפתח זהב להנחה של 10%!
            </p>
            <p className="text-xs text-kingdom-charcoal/40 mt-2 font-fun">קוד: TREASURE10</p>
          </div>
        </div>
      )}
    </div>
  )
}
