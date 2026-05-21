'use client'

import { useState, useEffect } from 'react'
import { Timer } from 'lucide-react'

interface FomoTimerProps {
  minutes?: number
}

export default function FomoTimer({ minutes = 15 }: FomoTimerProps) {
  const [timeLeft, setTimeLeft] = useState(minutes * 60)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  if (timeLeft <= 0) return null

  return (
    <div className="flex items-center gap-2 bg-kingdom-red/10 border border-kingdom-red/20 rounded-xl px-3 py-2">
      <Timer className={`w-4 h-4 text-kingdom-red ${timeLeft <= 120 ? 'animate-pulse' : ''}`} />
      <span className="font-fun text-sm text-kingdom-red font-bold">
        שערי הממלכה נסגרים בעוד {mins}:{secs.toString().padStart(2, '0')}!
      </span>
    </div>
  )
}
