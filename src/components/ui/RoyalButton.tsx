import { ButtonHTMLAttributes, ReactNode } from 'react'

interface RoyalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'whatsapp'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: ReactNode
  fullWidth?: boolean
}

const variants = {
  primary: 'bg-kingdom-red text-white border-2 border-kingdom-gold hover:bg-kingdom-red-hover shadow-lg shadow-kingdom-red/20',
  secondary: 'bg-transparent text-kingdom-red border-2 border-kingdom-red hover:bg-kingdom-red hover:text-white',
  gold: 'bg-kingdom-gold text-kingdom-charcoal border-2 border-kingdom-gold-dark hover:bg-kingdom-gold-dark font-bold',
  whatsapp: 'bg-[#25D366] text-white border-2 border-[#128C7E] hover:bg-[#128C7E]',
}

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-3.5 text-lg rounded-xl',
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
        font-medium transition-all duration-200 cursor-pointer
        active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
