'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Crown, Timer, Coins } from 'lucide-react'
import RoyalButton from '@/components/ui/RoyalButton'

const CELL = 28
const MAZE_W = 11
const MAZE_H = 11

// Simple maze: 0=path, 1=wall
const mazeData = [
  [1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,0,0,1],
  [1,0,1,0,1,0,1,1,1,0,1],
  [1,0,1,0,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,0,1,0,0,0,1],
  [1,1,1,0,1,0,1,1,1,0,1],
  [1,0,0,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1],
]

const coins = [
  { x: 3, y: 1 }, { x: 7, y: 2 }, { x: 5, y: 5 },
  { x: 1, y: 7 }, { x: 8, y: 9 },
]

const START = { x: 1, y: 1 }
const END = { x: 9, y: 9 }

export default function RoyalMaze() {
  const [player, setPlayer] = useState(START)
  const [collectedCoins, setCollectedCoins] = useState<Set<string>>(new Set())
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'won' | 'lost'>('ready')
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const move = useCallback((dx: number, dy: number) => {
    if (gameState !== 'playing') return
    setPlayer(prev => {
      const nx = prev.x + dx
      const ny = prev.y + dy
      if (nx < 0 || nx >= MAZE_W || ny < 0 || ny >= MAZE_H) return prev
      if (mazeData[ny][nx] === 1) return prev

      const coinKey = `${nx},${ny}`
      if (coins.some(c => c.x === nx && c.y === ny) && !collectedCoins.has(coinKey)) {
        setCollectedCoins(prev => new Set([...prev, coinKey]))
      }

      if (nx === END.x && ny === END.y) {
        setGameState('won')
      }

      return { x: nx, y: ny }
    })
  }, [gameState, collectedCoins])

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') move(0, -1)
      if (e.key === 'ArrowDown' || e.key === 's') move(0, 1)
      if (e.key === 'ArrowLeft' || e.key === 'a') move(1, 0) // RTL
      if (e.key === 'ArrowRight' || e.key === 'd') move(-1, 0)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [move])

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { setGameState('lost'); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [gameState])

  // Touch controls
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)

    if (Math.max(absDx, absDy) < 20) return

    if (absDx > absDy) {
      move(dx > 0 ? 1 : -1, 0)
    } else {
      move(0, dy > 0 ? 1 : -1)
    }
    touchStart.current = null
  }

  const startGame = () => {
    setPlayer(START)
    setCollectedCoins(new Set())
    setTimeLeft(60)
    setGameState('playing')
  }

  return (
    <div className="flex flex-col items-center">
      {/* HUD */}
      <div className="flex items-center gap-6 mb-4 font-fun">
        <div className="flex items-center gap-1.5 text-kingdom-gold">
          <Coins className="w-5 h-5" />
          <span className="font-bold">{collectedCoins.size}/{coins.length}</span>
        </div>
        <div className={`flex items-center gap-1.5 ${timeLeft <= 10 ? 'text-kingdom-red animate-pulse' : 'text-kingdom-charcoal'}`}>
          <Timer className="w-5 h-5" />
          <span className="font-bold">{timeLeft}s</span>
        </div>
      </div>

      {/* Maze */}
      <div
        className="relative bg-kingdom-charcoal rounded-2xl p-1 border-2 border-kingdom-gold shadow-xl touch-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ width: MAZE_W * CELL + 8, height: MAZE_H * CELL + 8 }}
      >
        {mazeData.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className="absolute"
              style={{ left: x * CELL + 4, top: y * CELL + 4, width: CELL, height: CELL }}
            >
              {cell === 1 ? (
                <div className="w-full h-full bg-kingdom-purple/80 rounded-sm" />
              ) : (
                <div className="w-full h-full bg-kingdom-charcoal/50 rounded-sm" />
              )}
            </div>
          ))
        )}

        {/* Coins */}
        {coins.map(coin => {
          const key = `${coin.x},${coin.y}`
          if (collectedCoins.has(key)) return null
          return (
            <div
              key={key}
              className="absolute animate-sparkle z-10"
              style={{ left: coin.x * CELL + 4 + CELL / 4, top: coin.y * CELL + 4 + CELL / 4, width: CELL / 2, height: CELL / 2 }}
            >
              <div className="w-full h-full rounded-full bg-kingdom-gold shadow-[0_0_8px_rgba(255,215,0,0.6)]" />
            </div>
          )
        })}

        {/* End point (palace door) */}
        <div
          className="absolute z-10 flex items-center justify-center animate-pulse-gold"
          style={{ left: END.x * CELL + 4, top: END.y * CELL + 4, width: CELL, height: CELL }}
        >
          <Crown className="w-5 h-5 text-kingdom-gold" />
        </div>

        {/* Player */}
        {gameState === 'playing' && (
          <div
            className="absolute z-20 transition-all duration-150 ease-out"
            style={{ left: player.x * CELL + 4 + 2, top: player.y * CELL + 4 + 2, width: CELL - 4, height: CELL - 4 }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-kingdom-pink to-kingdom-red shadow-[0_0_10px_rgba(224,17,95,0.5)] flex items-center justify-center text-xs">
              🧸
            </div>
          </div>
        )}

        {/* D-Pad for mobile */}
        {gameState === 'playing' && (
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 md:hidden">
            <div className="grid grid-cols-3 gap-1 w-32">
              <div />
              <button onTouchStart={() => move(0, -1)} className="w-10 h-10 bg-kingdom-gold/80 rounded-lg flex items-center justify-center text-xl active:bg-kingdom-gold">↑</button>
              <div />
              <button onTouchStart={() => move(1, 0)} className="w-10 h-10 bg-kingdom-gold/80 rounded-lg flex items-center justify-center text-xl active:bg-kingdom-gold">→</button>
              <button onTouchStart={() => move(0, 1)} className="w-10 h-10 bg-kingdom-gold/80 rounded-lg flex items-center justify-center text-xl active:bg-kingdom-gold">↓</button>
              <button onTouchStart={() => move(-1, 0)} className="w-10 h-10 bg-kingdom-gold/80 rounded-lg flex items-center justify-center text-xl active:bg-kingdom-gold">←</button>
            </div>
          </div>
        )}
      </div>

      {/* Game states */}
      {gameState === 'ready' && (
        <div className="mt-6 text-center">
          <p className="font-fun text-kingdom-charcoal/60 mb-4">
            נווטו את הסקווישי דרך המבוך, אספו מטבעות זהב והגיעו לכתר!
          </p>
          <RoyalButton variant="gold" size="xl" onClick={startGame} className="btn-magic">
            🏰 התחילו את המבוך!
          </RoyalButton>
        </div>
      )}

      {gameState === 'won' && (
        <div className="mt-6 text-center animate-bounce-in">
          <div className="bg-white rounded-2xl p-6 border-2 border-kingdom-gold shadow-xl">
            <span className="text-5xl block mb-2">🏆</span>
            <h3 className="font-bubble text-2xl text-kingdom-charcoal mb-1">הגעתם לארמון!</h3>
            <p className="font-fun text-kingdom-gold-dark">אספתם {collectedCoins.size} מטבעות זהב!</p>
            <RoyalButton variant="gold" size="md" onClick={startGame} className="mt-4">שחקו שוב</RoyalButton>
          </div>
        </div>
      )}

      {gameState === 'lost' && (
        <div className="mt-6 text-center animate-bounce-in">
          <div className="bg-white rounded-2xl p-6 border-2 border-kingdom-red/30 shadow-xl">
            <span className="text-5xl block mb-2">⏰</span>
            <h3 className="font-bubble text-2xl text-kingdom-charcoal mb-1">נגמר הזמן!</h3>
            <p className="font-fun text-kingdom-charcoal/50">נסו שוב — הממלכה מחכה!</p>
            <RoyalButton variant="primary" size="md" onClick={startGame} className="mt-4">נסו שוב</RoyalButton>
          </div>
        </div>
      )}
    </div>
  )
}
