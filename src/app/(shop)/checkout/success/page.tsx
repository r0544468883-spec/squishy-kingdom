'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Crown, PartyPopper, MessageCircle } from 'lucide-react'
import RoyalButton from '@/components/ui/RoyalButton'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')

  return (
    <div className="max-w-lg mx-auto px-4 py-16 md:py-24 text-center">
      {/* Celebration */}
      <div className="relative mb-8">
        <Crown className="w-20 h-20 text-kingdom-gold mx-auto animate-float" />
        <PartyPopper className="w-8 h-8 text-kingdom-red-light absolute top-0 right-1/4 animate-sparkle" />
        <PartyPopper className="w-8 h-8 text-kingdom-red-light absolute top-0 left-1/4 animate-sparkle" style={{ animationDelay: '0.5s' }} />
      </div>

      <h1 className="font-heading text-3xl md:text-4xl text-kingdom-charcoal mb-3">
        ההזמנה התקבלה!
      </h1>

      <p className="text-kingdom-charcoal/60 text-lg mb-2">
        תודה שקניתם מהממלכה של עדי
      </p>

      {orderId && (
        <p className="text-kingdom-charcoal/40 text-sm mb-8">
          מספר הזמנה: <span className="font-mono">{orderId.slice(0, 8)}</span>
        </p>
      )}

      <div className="bg-white rounded-2xl border-2 border-kingdom-gold/20 p-6 mb-8 text-right space-y-3">
        <p className="text-sm text-kingdom-charcoal/70">
          נשלח אליכם אישור בוואטסאפ עם פרטי המשלוח.
        </p>
        <p className="text-sm text-kingdom-charcoal/70">
          יש שאלות? שלחו לנו הודעה בוואטסאפ ונחזור אליכם בהקדם!
        </p>
      </div>

      <div className="space-y-3">
        <Link href="/">
          <RoyalButton variant="gold" size="lg" fullWidth>
            <Crown className="w-5 h-5" />
            חזרו לממלכה
          </RoyalButton>
        </Link>

        <a href="https://wa.me/972XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="block">
          <RoyalButton variant="whatsapp" size="md" fullWidth>
            <MessageCircle className="w-5 h-5" />
            צרו קשר בוואטסאפ
          </RoyalButton>
        </a>
      </div>

      {/* UGC Prompt */}
      <div className="mt-12 bg-kingdom-gold/10 rounded-2xl p-6">
        <p className="font-heading text-lg text-kingdom-charcoal mb-2">
          תייגו אותנו בטיקטוק!
        </p>
        <p className="text-sm text-kingdom-charcoal/60">
          צלמו סרטון פתיחת חבילה, תייגו את @squishyadi
          וקבלו מפתח זהב (קופון הנחה) להזמנה הבאה!
        </p>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-kingdom-charcoal/50">טוען...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
