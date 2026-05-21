import { ReactNode } from 'react'

interface BadgeProps {
  variant?: 'new' | 'sale' | 'soldout' | 'featured'
  children: ReactNode
  className?: string
}

const variants = {
  new: 'bg-kingdom-gold text-kingdom-charcoal',
  sale: 'bg-kingdom-red-light text-white',
  soldout: 'bg-gray-500 text-white',
  featured: 'bg-kingdom-purple text-white',
}

export default function Badge({ variant = 'new', children, className = '' }: BadgeProps) {
  return (
    <span className={`${variants[variant]} text-xs font-bold px-2.5 py-1 rounded-full ${className}`}>
      {children}
    </span>
  )
}
