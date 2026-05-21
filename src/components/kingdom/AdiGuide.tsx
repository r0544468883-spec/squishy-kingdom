'use client'

import { useState, useEffect } from 'react'
import { Crown } from 'lucide-react'

interface AdiGuideProps {
  message: string
  position?: 'left' | 'right' | 'center'
}

export default function AdiGuide({ message, position = 'center' }: AdiGuideProps) {
  const [visible, setVisible] = useState(false)
  const [displayedMessage, setDisplayedMessage] = useState('')

  useEffect(() => {
    setVisible(true)
  }, [])

  // Typewriter effect
  useEffect(() => {
    setDisplayedMessage('')
    let i = 0
    const interval = setInterval(() => {
      if (i < message.length) {
        setDisplayedMessage(message.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
      }
    }, 30)
    return () => clearInterval(interval)
  }, [message])

  const positionClass = {
    left: 'items-start',
    right: 'items-end',
    center: 'items-center',
  }[position]

  return (
    <div className={`flex flex-col ${positionClass} transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Speech Bubble */}
      <div className="relative bg-white rounded-2xl px-5 py-3 shadow-lg border-2 border-kingdom-gold/30 max-w-sm">
        <p className="font-fun text-sm md:text-base text-kingdom-charcoal leading-relaxed">
          {displayedMessage}
          <span className="animate-pulse">|</span>
        </p>
        {/* Triangle pointer */}
        <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r-2 border-b-2 border-kingdom-gold/30 transform rotate-45" />
      </div>

      {/* Adi Avatar */}
      <div className="mt-3 flex items-center gap-2">
        <div className="relative">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-kingdom-pink to-kingdom-red flex items-center justify-center border-3 border-kingdom-gold shadow-lg shadow-kingdom-gold/20 animate-float-slow">
            <span className="text-2xl md:text-3xl">👧</span>
          </div>
          <Crown className="absolute -top-2 -right-1 w-5 h-5 text-kingdom-gold animate-crown-bounce drop-shadow-[0_0_4px_rgba(255,215,0,0.5)]" />
        </div>
        <span className="font-bubble text-sm text-kingdom-red">עדי</span>
      </div>
    </div>
  )
}
