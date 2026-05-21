'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface VirtualSquishProps {
  imageUrl: string
  name: string
}

export default function VirtualSquish({ imageUrl, name }: VirtualSquishProps) {
  const [squishing, setSquishing] = useState(false)
  const [squishCount, setSquishCount] = useState(0)
  const squishRef = useRef<HTMLDivElement>(null)

  const handleSquish = () => {
    setSquishing(true)
    setSquishCount(prev => prev + 1)

    // Haptic feedback on mobile
    if (navigator.vibrate) navigator.vibrate(50)

    setTimeout(() => setSquishing(false), 300)
  }

  return (
    <div className="flex flex-col items-center">
      <p className="font-fun text-sm text-kingdom-charcoal/50 mb-3">
        לחצו על הסקוויש כדי למעוך! 🤗
      </p>

      <div
        ref={squishRef}
        onClick={handleSquish}
        className="relative cursor-pointer select-none"
        style={{ touchAction: 'manipulation' }}
      >
        <div
          className="relative w-48 h-48 md:w-64 md:h-64 transition-transform"
          style={{
            transform: squishing
              ? 'scaleX(1.2) scaleY(0.8)'
              : 'scaleX(1) scaleY(1)',
            transitionDuration: squishing ? '0.1s' : '0.3s',
            transitionTimingFunction: squishing ? 'ease-in' : 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-contain drop-shadow-xl pointer-events-none"
          />
        </div>

        {/* Squish particles */}
        {squishing && (
          <>
            <span className="absolute top-0 right-0 text-lg animate-[fadeOut_0.5s_forwards]">✨</span>
            <span className="absolute top-0 left-0 text-lg animate-[fadeOut_0.5s_forwards]" style={{ animationDelay: '0.1s' }}>💫</span>
            <span className="absolute bottom-0 right-1/4 text-lg animate-[fadeOut_0.5s_forwards]" style={{ animationDelay: '0.05s' }}>⭐</span>
          </>
        )}
      </div>

      {/* Counter */}
      <div className="mt-4 font-fun text-center">
        <span className="text-kingdom-gold font-bold text-lg">{squishCount}</span>
        <span className="text-kingdom-charcoal/40 text-sm mr-1"> מעיכות!</span>
        {squishCount >= 10 && squishCount < 50 && (
          <p className="text-xs text-kingdom-pink animate-bounce-in">מעיכן/ית מתחיל/ה! 🌟</p>
        )}
        {squishCount >= 50 && squishCount < 100 && (
          <p className="text-xs text-kingdom-purple-light animate-bounce-in">מעיכן/ית מקצועי/ת! 💪</p>
        )}
        {squishCount >= 100 && (
          <p className="text-xs text-kingdom-red animate-bounce-in">מלך/ת המעיכות! 👑</p>
        )}
      </div>
    </div>
  )
}
