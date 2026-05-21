import { Crown } from 'lucide-react'
import RoyalButton from './RoyalButton'
import Link from 'next/link'

interface EmptyStateProps {
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
}

export default function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Crown className="w-16 h-16 text-kingdom-gold/30 mb-4" />
      <h3 className="font-bubble text-xl text-kingdom-charcoal mb-2">{title}</h3>
      {description && <p className="text-kingdom-charcoal/60 text-sm mb-6 max-w-md">{description}</p>}
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <RoyalButton variant="gold">{actionLabel}</RoyalButton>
        </Link>
      )}
    </div>
  )
}
