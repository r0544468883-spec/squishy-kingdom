'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Sparkles } from 'lucide-react'

interface CastleGatesProps {
  onEnter: () => void
}

export default function CastleGates({ onEnter }: CastleGatesProps) {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'entered'>('closed')

  const handleEnter = () => {
    setPhase('opening')
    setTimeout(() => {
      setPhase('entered')
      onEnter()
    }, 2000)
  }

  if (phase === 'entered') return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] overflow-hidden"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Dark sky background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0015] via-[#1a0030] to-[#0a0015]" />

        {/* Animated stars */}
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-kingdom-gold rounded-full"
            style={{
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}

        {/* LEFT DOOR (RTL = right side visually) */}
        <motion.div
          className="absolute top-0 right-0 w-1/2 h-full"
          animate={phase === 'opening' ? { x: '100%' } : { x: 0 }}
          transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
        >
          {/* Door texture */}
          <div className="w-full h-full bg-gradient-to-l from-[#5a0a1e] via-[#8b0a30] to-[#6b0a25] relative">
            {/* Decorative panels */}
            <div className="absolute inset-8 border-2 border-kingdom-gold/20 rounded-lg" />
            <div className="absolute inset-16 border border-kingdom-gold/10 rounded-lg" />
            {/* Door ring */}
            <motion.div
              className="absolute top-1/2 left-6 -translate-y-1/2 w-14 h-14 rounded-full border-4 border-kingdom-gold/60"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            {/* Rivets */}
            {[20, 40, 60, 80].map(top => (
              <div key={top} className="absolute w-3 h-3 rounded-full bg-kingdom-gold/30" style={{ top: `${top}%`, right: 12 }} />
            ))}
            {/* Gold edge */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-kingdom-gold/40 via-kingdom-gold/20 to-kingdom-gold/40" />
          </div>
        </motion.div>

        {/* RIGHT DOOR */}
        <motion.div
          className="absolute top-0 left-0 w-1/2 h-full"
          animate={phase === 'opening' ? { x: '-100%' } : { x: 0 }}
          transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
        >
          <div className="w-full h-full bg-gradient-to-r from-[#5a0a1e] via-[#8b0a30] to-[#6b0a25] relative">
            <div className="absolute inset-8 border-2 border-kingdom-gold/20 rounded-lg" />
            <div className="absolute inset-16 border border-kingdom-gold/10 rounded-lg" />
            <motion.div
              className="absolute top-1/2 right-6 -translate-y-1/2 w-14 h-14 rounded-full border-4 border-kingdom-gold/60"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            {[20, 40, 60, 80].map(top => (
              <div key={top} className="absolute w-3 h-3 rounded-full bg-kingdom-gold/30" style={{ top: `${top}%`, left: 12 }} />
            ))}
            <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-kingdom-gold/40 via-kingdom-gold/20 to-kingdom-gold/40" />
          </div>
        </motion.div>

        {/* GATE ARCH — top crown */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
          animate={phase === 'opening' ? { opacity: 0, y: -50 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="pt-6"
          >
            <Crown className="w-14 h-14 md:w-20 md:h-20 text-kingdom-gold drop-shadow-[0_0_25px_rgba(255,215,0,0.6)]" />
          </motion.div>
        </motion.div>

        {/* Light beam when opening */}
        {phase === 'opening' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="w-8 h-full bg-kingdom-gold/20 blur-2xl" />
            <div className="absolute w-2 h-full bg-kingdom-gold/40 blur-lg" />
          </motion.div>
        )}

        {/* CENTER — Enter button */}
        {phase === 'closed' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
              className="text-center mb-10"
            >
              <h1 className="text-hero text-gold-shimmer mb-3">
                הממלכה של עדי
              </h1>
              <p className="font-heading text-white/50 text-lg md:text-xl">
                חנות הטרנדים הסודית
              </p>
            </motion.div>

            {/* Enter button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 260, damping: 12 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEnter}
              className="relative cursor-pointer group"
            >
              <div className="px-10 py-5 bg-gradient-to-l from-kingdom-gold to-kingdom-gold-light rounded-2xl border-2 border-kingdom-gold-dark shadow-[0_0_40px_rgba(255,215,0,0.25)] group-hover:shadow-[0_0_60px_rgba(255,215,0,0.45)] transition-shadow duration-500">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-kingdom-charcoal" />
                  <span className="font-bubble text-xl md:text-2xl text-kingdom-charcoal">
                    פתחו את השער!
                  </span>
                  <Sparkles className="w-6 h-6 text-kingdom-charcoal" />
                </div>
              </div>
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-2xl animate-pulse-gold" />
            </motion.button>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="text-white text-sm font-body mt-8"
            >
              ✦ סקווישים ✦ פידג&apos;טס ✦ נידו ✦ הפתעות ✦
            </motion.p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
