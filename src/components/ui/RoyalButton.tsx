import { ButtonHTMLAttributes, ReactNode } from 'react'

interface RoyalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'whatsapp'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: ReactNode
  fullWidth?: boolean
}

const variants = {
  primary: 'bg-gradient-to-l from-kingdom-red to-kingdom-red-light text-white border-2 border-kingdom-gold/30 hover:from-kingdom-red-hover hover:to-kingdom-red shadow-lg shadow-kingdom-red/25',
  secondary: 'bg-transparent text-kingdom-red border-2 border-kingdom-red hover:bg-kingdom-red hover:text-white',
  gold: 'bg-gradient-to-l from-kingdom-gold to-kingdom-gold-light text-kingdom-charcoal border-2 border-kingdom-gold-dark hover:from-kingdom-gold-dark hover:to-kingdom-gold font-bold shadow-lg shadow-kingdom-gold/25',
  whatsapp: 'bg-gradient-to-l from-[#25D366] to-[#2ECC71] text-white border-2 border-[#128C7E] hover:from-[#128C7E] hover:to-[#25D366] shadow-lg shadow-green-500/20',
}

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-3.5 text-lg rounded-2xl',
  xl: 'px-10 py-4 text-xl rounded-2xl min-h-[56px]',
}

export default function RoyalButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  ...props
}: RoyalButtonProps) {
  return (
    <button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        font-medium transition-all duration-300 cursor-pointer
        active:scale-[0.96] disabled:opacity-50 disabled:cursor-not-allowed
        hover:scale-[1.02] hover:-translate-y-0.5
        flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
