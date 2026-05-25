'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Crown, PartyPopper, MessageCircle, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ContentContainer from '@/modules/common/components/content-container'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')

  return (
    <ContentContainer className="max-w-lg py-16 md:py-24 text-center">
      {/* Celebration */}
      <div className="relative mb-8">
        <Crown className="w-20 h-20 text-kingdom-gold mx-auto animate-float" />
        <PartyPopper className="w-8 h-8 text-kingdom-red absolute top-0 right-1/4 animate-sparkle" />
        <PartyPopper className="w-8 h-8 text-kingdom-red absolute top-0 left-1/4 animate-sparkle" style={{ animationDelay: '0.5s' }} />
      </div>

      <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-3">ההזמנה התקבלה!</h1>
      <p className="text-muted-foreground text-lg mb-2">תודה שקניתם מהממלכה של עדי</p>

      {orderId && (
        <p className="text-muted-foreground text-sm mb-8">
          מספר הזמנה: <span className="font-mono text-foreground">{orderId.slice(0, 8)}</span>
        </p>
      )}

      <div className="bg-muted/50 rounded-xl border border-border p-6 mb-8 text-right space-y-2">
        <p className="text-sm text-muted-foreground">נשלח אליכם אישור בוואטסאפ עם פרטי המשלוח.</p>
        <p className="text-sm text-muted-foreground">יש שאלות? שלחו לנו הודעה בוואטסאפ ונחזור אליכם בהקדם!</p>
      </div>

      <div className="space-y-3">
        <Button asChild className="w-full h-12 bg-kingdom-red hover:bg-kingdom-red-hover text-white text-base gap-2">
          <Link href="/"><ShoppingBag className="w-5 h-5" />חזרו לממלכה</Link>
        </Button>
        <Button asChild variant="outline" className="w-full h-11 border-green-500 text-green-600 hover:bg-green-50 gap-2">
          <a href="https://wa.me/972XXXXXXXXX" target="_blank" rel="noopener noreferrer"><MessageCircle className="w-4 h-4" />צרו קשר בוואטסאפ</a>
        </Button>
      </div>

      {/* UGC Prompt */}
      <div className="mt-12 bg-kingdom-gold/10 rounded-xl p-6 border border-kingdom-gold/20">
        <p className="font-heading text-lg text-foreground mb-2">תייגו אותנו בטיקטוק!</p>
        <p className="text-sm text-muted-foreground">צלמו סרטון פתיחת חבילה, תייגו את @squishyadi וקבלו מפתח זהב (קופון הנחה) להזמנה הבאה!</p>
      </div>
    </ContentContainer>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-muted-foreground">טוען...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
