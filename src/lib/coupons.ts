import { createClient } from '@/lib/supabase/client'
import { Coupon } from '@/types'

const supabase = createClient()

export async function validateCoupon(code: string, orderTotal: number): Promise<{ valid: boolean; coupon?: Coupon; error?: string }> {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single()

  if (error || !data) {
    return { valid: false, error: 'קוד קופון לא תקין' }
  }

  const coupon = data as Coupon

  // Check expiry
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { valid: false, error: 'הקופון פג תוקף' }
  }

  // Check max uses
  if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
    return { valid: false, error: 'הקופון כבר מומש' }
  }

  // Check min order
  if (orderTotal < coupon.min_order_amount) {
    return { valid: false, error: `הזמנה מינימלית ₪${coupon.min_order_amount}` }
  }

  return { valid: true, coupon }
}

export function calculateDiscount(coupon: Coupon, orderTotal: number): number {
  if (coupon.discount_type === 'percentage') {
    return Math.round((orderTotal * coupon.discount_value / 100) * 100) / 100
  }
  return Math.min(coupon.discount_value, orderTotal)
}
