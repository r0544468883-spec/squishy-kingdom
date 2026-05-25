import { cn } from '@/lib/utils'

export default function ContentContainer({
  children,
  className,
  as: Component = 'div',
}: {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
}) {
  return (
    <Component className={cn('max-w-[1440px] w-full mx-auto px-4 md:px-6', className)}>
      {children}
    </Component>
  )
}
