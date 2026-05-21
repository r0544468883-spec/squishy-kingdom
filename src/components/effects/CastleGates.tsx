'use client'

import { useState } from 'react'
import { Crown, Sparkles } from 'lucide-react'

interface CastleGatesProps {
  onEnter: () => void
}

export default function CastleGates({ onEnter }: CastleGatesProps) {
  const [opening, setOpening] = useState(false)
  const [opened, setOpened] = useState(false)

  const handleEnter = () => {
    setOpening(true)
    setTimeout(() => {
      setOpened(true)
      setTimeout(() => onEnter(), 600)
    }, 1500)
  }

  if (opened) return null

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-kingdom-charcoal" />

      {/* Stars background */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-kingdom-gold rounded-full animate-sparkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: 0.3 + Math.random() * 0.7,
            }}
          />
        ))}
      </div>

      {/* Left Gate Door */}
      <div
        className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-kingdom-red-deep to-kingdom-red transition-transform duration-[1500ms] ease-in-out ${
          opening ? 'translate-x-full' : 'translate-x-0'
        }`}
        style={{ transformOrigin: 'right center' }}
      >
        {/* Door decorations */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Door panels */}
            <div className="absolute inset-0 border-4 border-kingdom-gold/30 rounded-lg m-8" />
            <div className="absolute inset-0 border-2 border-kingdom-gold/15 rounded-lg m-16" />
            {/* Door ring */}
            <div className="w-12 h-12 rounded-full border-4 border-kingdom-gold absolute top-1/2 left-4 -translate-y-1/2" />
          </div>
        </div>
        {/* Vertical gold stripes */}
        <div className="absolute top-0 left-0 w-1 h-full bg-kingdom-gold/20" />
        <div className="absolute top-0 right-8 w-0.5 h-full bg-kingdom-gold/10" />
      </div>

      {/* Right Gate Door */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-kingdom-red-deep to-kingdom-red transition-transform duration-[1500ms] ease-in-out ${
          opening ? '-translate-x-full' : 'translate-x-0'
        }`}
        style={{ transformOrigin: 'left center' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 border-4 border-kingdom-gold/30 rounded-lg m-8" />
            <div className="absolute inset-0 border-2 border-kingdom-gold/15 rounded-lg m-16" />
            <div className="w-12 h-12 rounded-full border-4 border-kingdom-gold absolute top-1/2 right-4 -translate-y-1/2" />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1 h-full bg-kingdom-gold/20" />
        <div className="absolute top-0 left-8 w-0.5 h-full bg-kingdom-gold/10" />
      </div>

      {/* Gate arch (top) */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-40 md:w-60 transition-opacity duration-500 ${opening ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex flex-col items-center pt-8">
          <Crown className="w-12 h-12 md:w-16 md:h-16 text-kingdom-gold animate-crown-bounce drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]" />
        </div>
      </div>

      {/* Center content — Enter button */}
      {!opening && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="text-center mb-8 animate-slide-up">
            <h1 className="font-bubble text-4xl md:text-6xl text-gold-shimmer mb-3">
              הממלכה של עדי
            </h1>
            <p className="font-fun text-white/60 text-lg md:text-xl">
              חנות הטרנדים הסודית
            </p>
          </div>

          <button
            onClick={handleEnter}
            className="group relative animate-slide-up cursor-pointer"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="relative px-10 py-5 bg-gradient-to-l from-kingdom-gold to-kingdom-gold-light rounded-2xl border-2 border-kingdom-gold-dark shadow-[0_0_40px_rgba(255,215,0,0.3)] hover:shadow-[0_0_60px_rgba(255,215,0,0.5)] transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-kingdom-charcoal animate-sparkle" />
                <span className="font-bubble text-xl md:text-2xl text-kingdom-charcoal">
                  פתחו את השער!
                </span>
                <Sparkles className="w-6 h-6 text-kingdom-charcoal animate-sparkle" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>
            {/* Glow pulse */}
            <div className="absolute inset-0 rounded-2xl animate-pulse-gold" />
          </button>

          <p className="text-white/30 text-sm font-fun mt-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            ✦ סקווישים ✦ פידג&apos;טס ✦ נידו ✦ הפתעות ✦
          </p>
        </div>
      )}

      {/* Light burst when opening */}
      {opening && (
        <div className="absolute inset-0 flex items-center justify-center z-5 pointer-events-none">
          <div className="w-4 h-full bg-kingdom-gold/30 blur-xl animate-fade-in" />
        </div>
      )}
    </div>
  )
}
