'use client'

import { useState, useRef } from 'react'
import { Crown, Sparkles } from 'lucide-react'
import RoyalButton from '@/components/ui/RoyalButton'

const prizes = [
  { label: 'משלוח חינם!', color: '#E0115F', emoji: '🚀', value: 'free_shipping' },
  { label: '10% הנחה', color: '#FFD700', emoji: '⭐', value: 'discount_10' },
  { label: 'מיני סקוויש!', color: '#7C3AED', emoji: '🎁', value: 'mini_squishy' },
  { label: 'נסו שוב', color: '#059669', emoji: '🔄', value: 'try_again' },
  { label: '15% הנחה', color: '#FF1D6C', emoji: '💎', value: 'discount_15' },
  { label: 'מפתח זהב!', color: '#DAA520', emoji: '🔑', value: 'golden_key' },
  { label: '5% הנחה', color: '#581C87', emoji: '✨', value: 'discount_5' },
  { label: 'הפתעה!', color: '#C70039', emoji: '🎉', value: 'surprise' },
]

export default function WheelOfFortune() {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<typeof prizes[0] | null>(null)
  const [rotation, setRotation] = useState(0)
  const [hasSpun, setHasSpun] = useState(false)
  const wheelRef = useRef<HTMLDivElement>(null)

  const spin = () => {
    if (spinning || hasSpun) return
    setSpinning(true)
    setResult(null)

    const winIndex = Math.floor(Math.random() * prizes.length)
    const segmentAngle = 360 / prizes.length
    const targetAngle = 360 * 5 + (360 - winIndex * segmentAngle - segmentAngle / 2)

    setRotation(targetAngle)

    setTimeout(() => {
      setSpinning(false)
      setResult(prizes[winIndex])
      setHasSpun(true)
    }, 4000)
  }

  return (
    <div className="flex flex-col items-center">
      {/* Wheel */}
      <div className="relative w-72 h-72 md:w-96 md:h-96">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
          <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[24px] border-l-transparent border-r-transparent border-t-kingdom-gold drop-shadow-lg" />
        </div>

        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-kingdom-gold shadow-[0_0_30px_rgba(255,215,0,0.3)] bg-kingdom-parchment" />

        {/* Wheel segments */}
        <div
          ref={wheelRef}
          className="absolute inset-2 rounded-full overflow-hidden transition-transform"
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: spinning ? '4s' : '0s',
            transitionTimingFunction: 'cubic-bezier(0.17, 0.67, 0.12, 0.99)',
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {prizes.map((prize, i) => {
              const angle = (360 / prizes.length) * i
              const nextAngle = (360 / prizes.length) * (i + 1)
              const midAngle = (angle + nextAngle) / 2
              const rad = (midAngle * Math.PI) / 180
              const textX = 100 + Math.cos(rad - Math.PI / 2) * 65
              const textY = 100 + Math.sin(rad - Math.PI / 2) * 65

              const startRad = (angle * Math.PI) / 180 - Math.PI / 2
              const endRad = (nextAngle * Math.PI) / 180 - Math.PI / 2

              const x1 = 100 + 98 * Math.cos(startRad)
              const y1 = 100 + 98 * Math.sin(startRad)
              const x2 = 100 + 98 * Math.cos(endRad)
              const y2 = 100 + 98 * Math.sin(endRad)

              return (
                <g key={i}>
                  <path
                    d={`M100,100 L${x1},${y1} A98,98 0 0,1 ${x2},${y2} Z`}
                    fill={prize.color}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="0.5"
                  />
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="6"
                    fontWeight="bold"
                    transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                  >
                    {prize.emoji}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Center button */}
        <button
          onClick={spin}
          disabled={spinning || hasSpun}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-kingdom-gold to-kingdom-gold-dark border-4 border-white shadow-lg flex items-center justify-center cursor-pointer disabled:cursor-not-allowed hover:scale-110 transition-transform"
        >
          <Crown className="w-6 h-6 md:w-8 md:h-8 text-kingdom-charcoal" />
        </button>
      </div>

      {/* Spin Button */}
      {!hasSpun && (
        <div className="mt-6">
          <RoyalButton
            variant="gold"
            size="xl"
            onClick={spin}
            disabled={spinning}
            className="btn-magic animate-pulse-gold"
          >
            <Sparkles className="w-6 h-6" />
            {spinning ? 'הגלגל מסתובב...' : 'סובבו את הגלגל!'}
          </RoyalButton>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-6 text-center animate-bounce-in">
          <div className="bg-white rounded-2xl p-6 border-2 border-kingdom-gold shadow-xl max-w-sm">
            <span className="text-5xl mb-3 block">{result.emoji}</span>
            <h3 className="font-bubble text-2xl text-kingdom-charcoal mb-2">
              {result.value === 'try_again' ? 'אוי!' : 'זכיתם!'}
            </h3>
            <p className="font-fun text-lg text-kingdom-red font-bold">{result.label}</p>
            {result.value !== 'try_again' && (
              <p className="text-sm text-kingdom-charcoal/50 mt-2 font-fun">
                הפרס מחכה לכם בעגלה!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
