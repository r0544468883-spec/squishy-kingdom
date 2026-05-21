import Image from 'next/image'
import Link from 'next/link'
import { Category } from '@/types'

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="kingdom-card p-4 flex flex-col items-center text-center group min-w-[140px] md:min-w-0"
    >
      {category.image_url ? (
        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-kingdom-gold mb-3 group-hover:border-kingdom-gold-dark transition-colors">
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-kingdom-parchment border-2 border-kingdom-gold mb-3 flex items-center justify-center">
          <span className="text-3xl">👑</span>
        </div>
      )}
      <h3 className="font-heading text-sm md:text-base text-kingdom-charcoal group-hover:text-kingdom-red transition-colors">
        {category.name}
      </h3>
    </Link>
  )
}
