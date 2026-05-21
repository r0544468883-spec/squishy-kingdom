'use client'

import { motion, AnimatePresence, Variants } from 'framer-motion'
import { ReactNode } from 'react'

// ============================================
// SPRING CONFIGS
// ============================================
export const springBouncy = { type: 'spring' as const, stiffness: 400, damping: 17 }
export const springGentle = { type: 'spring' as const, stiffness: 300, damping: 24 }
export const springSnappy = { type: 'spring' as const, stiffness: 500, damping: 30 }
export const springPlayful = { type: 'spring' as const, stiffness: 260, damping: 12, mass: 0.8 }

// ============================================
// VARIANT PRESETS
// ============================================
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: springGentle },
}

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: springPlayful },
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

export const cardHover = {
  rest: { scale: 1, y: 0, borderColor: 'rgba(255,215,0,0.2)' },
  hover: {
    scale: 1.03,
    y: -8,
    borderColor: 'rgba(255,215,0,0.6)',
    boxShadow: '0 12px 40px rgba(255,215,0,0.15), 0 4px 12px rgba(224,17,95,0.08)',
    transition: springBouncy,
  },
  tap: { scale: 0.97, transition: { duration: 0.1 } },
}

export const buttonSquash = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: springBouncy },
  tap: { scale: 0.92, scaleX: 1.08, scaleY: 0.92, transition: { duration: 0.1 } },
}

export const wiggle: Variants = {
  hidden: { rotate: 0 },
  visible: {
    rotate: [0, -3, 3, -2, 2, 0],
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
}

// ============================================
// REUSABLE WRAPPERS
// ============================================

export function FadeIn({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ ...springGentle, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function ScaleIn({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ ...springPlayful, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerGrid({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeInUp} className={className}>
      {children}
    </motion.div>
  )
}

export function BouncyButton({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <motion.div
      variants={buttonSquash}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

export function FloatingElement({ children, className = '', y = 12, duration = 3 }: { children: ReactNode; className?: string; y?: number; duration?: number }) {
  return (
    <motion.div
      animate={{ y: [-y, y, -y] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export { motion, AnimatePresence }
export type { Variants }
