'use client'

import { Crown, Truck, Gift, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const milestones = [
  { amount: 50, label: 'אביר', icon: Crown, reward: 'סטיקר מתנה' },
  { amount: 100, label: 'נסיך/ה', icon: Truck, reward: 'משלוח חינם' },
  { amount: 150, label: 'מלך/ה', icon: Gift, reward: 'הפתעה!' },
]

export default function CartProgressBar({ total }: { total: number }) {
  const maxAmount = milestones[milestones.length - 1].amount
  const percentage = Math.min((total / maxAmount) * 100, 100)

  const currentMilestone = milestones.findIndex(m => total < m.amount)
  const nextMilestone = currentMilestone >= 0 ? milestones[currentMilestone] : null
  const remaining = nextMilestone ? nextMilestone.amount - total : 0

  return (
    <div className="space-y-2">
      {/* Message */}
      <p className="text-xs text-muted-foreground text-center">
        {nextMilestone ? (
          <>
            עוד <span className="font-semibold text-kingdom-red">₪{remaining.toFixed(0)}</span> כדי להפוך ל
            <span className="font-semibold text-kingdom-gold-dark">{nextMilestone.label}</span> ולקבל {nextMilestone.reward}!
          </>
        ) : (
          <span className="text-kingdom-emerald font-semibold flex items-center justify-center gap-1">
            <Star className="w-3 h-3" /> מלך/ת הממלכה! כל ההטבות שלך
          </span>
        )}
      </p>

      {/* Bar */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700 ease-out',
            total >= maxAmount
              ? 'bg-gradient-to-l from-kingdom-emerald to-green-400'
              : 'bg-gradient-to-l from-kingdom-red to-kingdom-pink'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Milestone Dots */}
      <div className="relative flex justify-between px-1">
        {milestones.map((m, i) => {
          const reached = total >= m.amount
          const Icon = m.icon
          return (
            <div key={i} className="flex flex-col items-center">
              <div className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center transition-colors',
                reached ? 'bg-kingdom-emerald text-white' : 'bg-muted text-muted-foreground'
              )}>
                <Icon className="w-3 h-3" />
              </div>
              <span className={cn('text-[9px] mt-0.5', reached ? 'text-kingdom-emerald font-medium' : 'text-muted-foreground')}>
                ₪{m.amount}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
