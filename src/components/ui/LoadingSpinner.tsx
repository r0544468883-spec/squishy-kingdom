import { Crown } from 'lucide-react'

export default function LoadingSpinner({ text = 'טוען...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <Crown className="w-10 h-10 text-kingdom-gold animate-spin" />
      <p className="text-kingdom-charcoal/60 text-sm">{text}</p>
    </div>
  )
}
