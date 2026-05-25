'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { CreditCard, Truck, MapPin, ShieldCheck, Check, ChevronLeft } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { createOrder } from '@/lib/orders'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import ContentContainer from '@/modules/common/components/content-container'
import { cn } from '@/lib/utils'

type Step = 1 | 2 | 3

const steps = [
  { num: 1, label: 'פרטים' },
  { num: 2, label: 'משלוח' },
  { num: 3, label: 'תשלום' },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const [step, setStep] = useState<Step>(1)
  const [submitting, setSubmitting] = useState(false)

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
      <ContentContainer className="py-20 text-center">
        <h2 className="text-xl font-heading mb-2">העגלה ריקה</h2>
        <p className="text-muted-foreground mb-6">הוסיפו מוצרים לפני המעבר לתשלום</p>
        <Button asChild><Link href="/products">לחנות</Link></Button>
      </ContentContainer>
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

  return (
    <div className="py-6 md:py-12">
      <ContentContainer className="max-w-4xl">
        {/* Back */}
        <button onClick={() => step > 1 ? setStep((step - 1) as Step) : router.push('/products')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 cursor-pointer">
          <ChevronLeft className="w-4 h-4 rotate-180" />
          {step > 1 ? 'חזרה' : 'חזרה לחנות'}
        </button>

        <h1 className="text-section text-foreground text-center mb-8">תשלום מאובטח</h1>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-3">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                step > s.num ? 'bg-kingdom-emerald text-white' : step === s.num ? 'bg-kingdom-red text-white' : 'bg-muted text-muted-foreground'
              )}>
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className={cn('text-sm hidden sm:inline', step >= s.num ? 'text-foreground font-medium' : 'text-muted-foreground')}>{s.label}</span>
              {i < 2 && <div className={cn('w-10 h-0.5 rounded', step > s.num ? 'bg-kingdom-emerald' : 'bg-muted')} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* Main Form */}
          <div>
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-heading text-xl mb-4">פרטי הלקוח</h2>
                <div>
                  <Label>שם מלא *</Label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="הכניסו שם מלא" className="mt-1" />
                </div>
                <div>
                  <Label>טלפון *</Label>
                  <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="050-0000000" dir="ltr" className="mt-1" />
                </div>
                <div>
                  <Label>אימייל *</Label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" dir="ltr" className="mt-1" />
                </div>
                <div>
                  <Label>הערות (אופציונלי)</Label>
                  <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="הערות להזמנה..." className="mt-1" />
                </div>
                <Button onClick={() => setStep(2)} disabled={!name || !phone || !email} className="w-full h-12 bg-kingdom-red hover:bg-kingdom-red-hover text-white text-base">
                  המשך למשלוח
                </Button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-heading text-xl mb-4">אופן משלוח</h2>
                <div className="space-y-3">
                  {[
                    { value: 'delivery' as const, icon: Truck, title: 'משלוח עד הבית', desc: subtotal >= 100 ? 'חינם! (הזמנה מעל ₪100)' : '₪30' },
                    { value: 'pickup' as const, icon: MapPin, title: 'איסוף עצמי — מרכז תל אביב', desc: 'חינם' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setShippingMethod(opt.value)}
                      className={cn(
                        'w-full flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all text-right',
                        shippingMethod === opt.value ? 'border-kingdom-red bg-kingdom-red/5' : 'border-border hover:border-muted-foreground'
                      )}
                    >
                      <opt.icon className={cn('w-5 h-5 flex-shrink-0', shippingMethod === opt.value ? 'text-kingdom-red' : 'text-muted-foreground')} />
                      <div className="flex-1">
                        <p className="font-medium">{opt.title}</p>
                        <p className="text-sm text-muted-foreground">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {shippingMethod === 'delivery' && (
                  <div className="space-y-3 pt-2">
                    <div><Label>עיר *</Label><Input value={city} onChange={e => setCity(e.target.value)} placeholder="תל אביב" className="mt-1" /></div>
                    <div><Label>רחוב ומספר *</Label><Input value={street} onChange={e => setStreet(e.target.value)} placeholder="רחוב הרצל 1" className="mt-1" /></div>
                    <div><Label>מיקוד</Label><Input value={zip} onChange={e => setZip(e.target.value)} placeholder="6100000" dir="ltr" className="mt-1" /></div>
                  </div>
                )}

                <Button
                  onClick={() => setStep(3)}
                  disabled={shippingMethod === 'delivery' && (!city || !street)}
                  className="w-full h-12 bg-kingdom-red hover:bg-kingdom-red-hover text-white text-base"
                >
                  המשך לתשלום
                </Button>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="font-heading text-xl mb-4">סיכום ותשלום</h2>

                <div className="bg-muted/50 rounded-xl p-4 text-sm space-y-1.5">
                  <p><span className="text-muted-foreground">שם:</span> {name}</p>
                  <p><span className="text-muted-foreground">טלפון:</span> {phone}</p>
                  <p><span className="text-muted-foreground">אימייל:</span> {email}</p>
                  <p><span className="text-muted-foreground">משלוח:</span> {shippingMethod === 'delivery' ? `${street}, ${city}` : 'איסוף עצמי — תל אביב'}</p>
                </div>

                <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>תשלום מאובטח באמצעות Tranzila</span>
                </div>

                <Button
                  onClick={handleSubmitOrder}
                  disabled={submitting}
                  className="w-full h-13 bg-kingdom-red hover:bg-kingdom-red-hover text-white text-base gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  {submitting ? 'מעבד...' : `שלמו ₪${total.toFixed(0)}`}
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary (sticky sidebar) */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-muted/30 rounded-xl border border-border p-5 space-y-4">
              <h3 className="font-heading text-base font-semibold">סיכום הזמנה</h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {items.map(item => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image src={item.product.image_url} alt={item.product.name} fill className="object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium">₪{(item.product.price * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground"><span>סה&quot;כ מוצרים</span><span>₪{subtotal.toFixed(0)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>משלוח</span><span>{shipping === 0 ? 'חינם' : `₪${shipping}`}</span></div>
                <Separator />
                <div className="flex justify-between text-base font-bold pt-1"><span>סה&quot;כ</span><span className="text-kingdom-red">₪{total.toFixed(0)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </ContentContainer>
    </div>
  )
}
