interface SectionTitleProps {
  title: string
  subtitle?: string
  className?: string
}

export default function SectionTitle({ title, subtitle, className = '' }: SectionTitleProps) {
  return (
    <div className={`text-center mb-8 md:mb-12 ${className}`}>
      <h2 className="font-[Secular_One] text-2xl md:text-4xl text-kingdom-charcoal">
        {title}
      </h2>
      <div className="w-24 h-1 bg-kingdom-gold mx-auto mt-3 rounded-full" />
      {subtitle && (
        <p className="text-kingdom-charcoal/60 mt-3 text-sm md:text-base">{subtitle}</p>
      )}
    </div>
  )
}
