'use client'

import { Crown, Shield, Sparkles } from 'lucide-react'

const milestones = [
  { amount: 50, label: 'אביר', icon: Shield, reward: 'מדבקה במתנה!' },
  { amount: 100, label: 'נסיך/ה', icon: Crown, reward: 'משלוח חינם!' },
  { amount: 150, label: 'מלך/ה', icon: Sparkles, reward: 'מתנת הפתעה!' },
]

export default function CartProgressBar({ total }: { total: number }) {
  const maxAmount = milestones[milestones.length - 1].amount
  const progress = Math.min((total / maxAmount) * 100, 100)

  const nextMilestone = milestones.find(m => total < m.amount)
  const remaining = nextMilestone ? nextMilestone.amount - total : 0

  return (
    <div className="bg-white rounded-xl p-3 border border-kingdom-gold/20">
      {/* Progress Text */}
      {nextMilestone ? (
        <p className="text-xs text-kingdom-charcoal/70 mb-2 text-center">
          עוד <span className="font-bold text-kingdom-red">₪{remaining.toFixed(0)}</span> כדי להפוך ל
          <span className="font-bold text-kingdom-gold-dark">{nextMilestone.label}</span> ולקבל {nextMilestone.reward}
        </p>
      ) : (
        <p className="text-xs text-kingdom-gold-dark font-bold mb-2 text-center">
          👑 הגעת לדרגת מלך/ה! מתנת הפתעה בדרך אליך!
        </p>
      )}

      {/* Bar */}
      <div className="relative h-3 bg-kingdom-parchment rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-l from-kingdom-gold to-kingdom-gold-dark rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />

        {/* Milestone markers */}
        {milestones.map(milestone => {
          const position = (milestone.amount / maxAmount) * 100
          const reached = total >= milestone.amount
          const Icon = milestone.icon
          return (
            <div
              key={milestone.amount}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ right: `${position}%`, transform: `translate(50%, -50%)` }}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                reached
                  ? 'bg-kingdom-gold text-kingdom-charcoal'
                  : 'bg-white border-2 border-kingdom-gold/40 text-kingdom-gold/40'
              }`}>
                <Icon className="w-3 h-3" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
