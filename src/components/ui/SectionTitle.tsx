import { Sparkles } from 'lucide-react'

interface SectionTitleProps {
  title: string
  subtitle?: string
  className?: string
}

export default function SectionTitle({ title, subtitle, className = '' }: SectionTitleProps) {
  return (
    <div className={`text-center mb-10 md:mb-14 ${className}`}>
      <div className="flex items-center justify-center gap-3 mb-2">
        <Sparkles className="w-5 h-5 text-kingdom-gold animate-sparkle" />
        <Sparkles className="w-3 h-3 text-kingdom-pink animate-sparkle" style={{ animationDelay: '0.5s' }} />
      </div>
      <h2 className="font-bubble text-2xl md:text-4xl lg:text-5xl text-kingdom-charcoal">
        {title}
      </h2>
      <div className="flex items-center justify-center gap-2 mt-4">
        <div className="w-8 h-0.5 bg-kingdom-red/30 rounded-full" />
        <div className="w-16 h-1 bg-gradient-to-l from-kingdom-gold to-kingdom-red rounded-full" />
        <div className="w-8 h-0.5 bg-kingdom-red/30 rounded-full" />
      </div>
      {subtitle && (
        <p className="text-kingdom-charcoal/50 mt-4 text-sm md:text-lg max-w-lg mx-auto">{subtitle}</p>
      )}
    </div>
  )
}
