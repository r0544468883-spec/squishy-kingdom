'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { CreditCard, Truck, MapPin, ShieldCheck } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { createOrder } from '@/lib/orders'
import RoyalButton from '@/components/ui/RoyalButton'
import EmptyState from '@/components/ui/EmptyState'

type Step = 1 | 2 | 3

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const [step, setStep] = useState<Step>(1)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [shippingMethod, setShippingMethod] = useState<'delivery' | 'pickup'>('delivery')
  const [city, setCity] = useState('')
  const [street, setStreet] = useState('')
  const [zip, setZip] = useState('')
  const [notes, setNotes] = useState('')

  if (items.length === 0) {
    return (
      <EmptyState
        title="העגלה ריקה"
        description="הוסיפו מוצרים לפני המעבר לתשלום"
        actionLabel="לחנות"
        actionHref="/products"
      />
    )
  }

  const shipping = shippingMethod === 'delivery' && subtotal < 100 ? 30 : 0
  const total = subtotal + shipping

  const handleSubmitOrder = async () => {
    setSubmitting(true)
    try {
      const order = await createOrder({
        customer_name: name,
        customer_phone: phone,
        customer_email: email,
        shipping_method: shippingMethod,
        shipping_address: shippingMethod === 'delivery' ? { city, street, zip } : undefined,
        items,
        notes,
      })
      clearCart()
      router.push(`/checkout/success?order=${order.id}`)
    } catch (err) {
      console.error('Order failed:', err)
      alert('שגיאה ביצירת ההזמנה. נסו שוב.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = "w-full bg-white border-2 border-kingdom-gold/30 rounded-xl px-4 py-3 text-kingdom-charcoal focus:border-kingdom-gold outline-none text-right"

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <h1 className="font-bubble text-2xl md:text-3xl text-kingdom-charcoal text-center mb-8">
        תשלום מאובטח
      </h1>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= s ? 'bg-kingdom-gold text-kingdom-charcoal' : 'bg-kingdom-parchment text-kingdom-charcoal/40'
            }`}>
              {s}
            </div>
            <span className={`text-sm hidden sm:inline ${step >= s ? 'text-kingdom-charcoal' : 'text-kingdom-charcoal/40'}`}>
              {s === 1 ? 'פרטים' : s === 2 ? 'משלוח' : 'תשלום'}
            </span>
            {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-kingdom-gold' : 'bg-kingdom-parchment'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Customer Details */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="font-bubble text-xl text-kingdom-charcoal mb-4">פרטי הלקוח</h2>
          <div>
            <label className="block text-sm text-kingdom-charcoal/70 mb-1">שם מלא *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="הכניסו שם מלא" />
          </div>
          <div>
            <label className="block text-sm text-kingdom-charcoal/70 mb-1">טלפון *</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} placeholder="050-0000000" dir="ltr" />
          </div>
          <div>
            <label className="block text-sm text-kingdom-charcoal/70 mb-1">אימייל *</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} placeholder="email@example.com" dir="ltr" />
          </div>
          <div>
            <label className="block text-sm text-kingdom-charcoal/70 mb-1">הערות (אופציונלי)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} className={inputClass} rows={2} placeholder="הערות להזמנה..." />
          </div>
          <RoyalButton
            variant="gold"
            size="lg"
            fullWidth
            onClick={() => setStep(2)}
            disabled={!name || !phone || !email}
          >
            המשך למשלוח
          </RoyalButton>
        </div>
      )}

      {/* Step 2: Shipping */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="font-bubble text-xl text-kingdom-charcoal mb-4">אופן משלוח</h2>

          <div className="space-y-3">
            <button
              onClick={() => setShippingMethod('delivery')}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors text-right ${
                shippingMethod === 'delivery' ? 'border-kingdom-gold bg-kingdom-gold/5' : 'border-kingdom-gold/20 bg-white'
              }`}
            >
              <Truck className="w-6 h-6 text-kingdom-gold flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-kingdom-charcoal">משלוח עד הבית</p>
                <p className="text-sm text-kingdom-charcoal/60">
                  {subtotal >= 100 ? 'חינם! (הזמנה מעל ₪100)' : '₪30'}
                </p>
              </div>
            </button>

            <button
              onClick={() => setShippingMethod('pickup')}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors text-right ${
                shippingMethod === 'pickup' ? 'border-kingdom-gold bg-kingdom-gold/5' : 'border-kingdom-gold/20 bg-white'
              }`}
            >
              <MapPin className="w-6 h-6 text-kingdom-gold flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-kingdom-charcoal">איסוף עצמי — מרכז תל אביב</p>
                <p className="text-sm text-kingdom-charcoal/60">חינם</p>
              </div>
            </button>
          </div>

          {shippingMethod === 'delivery' && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-sm text-kingdom-charcoal/70 mb-1">עיר *</label>
                <input type="text" value={city} onChange={e => setCity(e.target.value)} className={inputClass} placeholder="תל אביב" />
              </div>
              <div>
                <label className="block text-sm text-kingdom-charcoal/70 mb-1">רחוב ומספר *</label>
                <input type="text" value={street} onChange={e => setStreet(e.target.value)} className={inputClass} placeholder="רחוב הרצל 1" />
              </div>
              <div>
                <label className="block text-sm text-kingdom-charcoal/70 mb-1">מיקוד</label>
                <input type="text" value={zip} onChange={e => setZip(e.target.value)} className={inputClass} placeholder="6100000" dir="ltr" />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <RoyalButton variant="secondary" size="md" onClick={() => setStep(1)}>חזרה</RoyalButton>
            <RoyalButton
              variant="gold"
              size="lg"
              fullWidth
              onClick={() => setStep(3)}
              disabled={shippingMethod === 'delivery' && (!city || !street)}
            >
              המשך לתשלום
            </RoyalButton>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="font-bubble text-xl text-kingdom-charcoal mb-4">סיכום ותשלום</h2>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl border-2 border-kingdom-gold/20 p-4 space-y-3">
            {items.map(item => (
              <div key={item.product.id} className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-kingdom-parchment flex-shrink-0">
                  <Image src={item.product.image_url} alt={item.product.name} fill className="object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-kingdom-charcoal line-clamp-1">{item.product.name}</p>
                  <p className="text-xs text-kingdom-charcoal/50">x{item.quantity}</p>
                </div>
                <span className="text-sm font-bold text-kingdom-charcoal">₪{(item.product.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}

            <div className="border-t border-kingdom-gold/20 pt-3 space-y-1">
              <div className="flex justify-between text-sm text-kingdom-charcoal/70">
                <span>סה&quot;כ מוצרים</span><span>₪{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm text-kingdom-charcoal/70">
                <span>משלוח</span><span>{shipping === 0 ? 'חינם' : `₪${shipping}`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-kingdom-charcoal pt-1">
                <span>סה&quot;כ לתשלום</span><span className="text-kingdom-red">₪{total.toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* Customer Info Summary */}
          <div className="bg-white rounded-2xl border-2 border-kingdom-gold/20 p-4 text-sm space-y-1">
            <p><span className="text-kingdom-charcoal/50">שם:</span> {name}</p>
            <p><span className="text-kingdom-charcoal/50">טלפון:</span> {phone}</p>
            <p><span className="text-kingdom-charcoal/50">משלוח:</span> {shippingMethod === 'delivery' ? `${street}, ${city}` : 'איסוף עצמי'}</p>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-kingdom-charcoal/50 text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>תשלום מאובטח באמצעות Tranzila</span>
          </div>

          <div className="flex gap-3">
            <RoyalButton variant="secondary" size="md" onClick={() => setStep(2)}>חזרה</RoyalButton>
            <RoyalButton
              variant="gold"
              size="xl"
              fullWidth
              onClick={handleSubmitOrder}
              disabled={submitting}
            >
              <CreditCard className="w-5 h-5" />
              {submitting ? 'מעבד...' : `שלמו ₪${total.toFixed(0)}`}
            </RoyalButton>
          </div>
        </div>
      )}
    </div>
  )
}
