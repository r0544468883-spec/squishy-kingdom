import { createClient } from '@/lib/supabase/client'
import { CartItem } from '@/types'

const supabase = createClient()

interface CreateOrderData {
  customer_name: string
  customer_phone: string
  customer_email: string
  shipping_method: 'delivery' | 'pickup'
  shipping_address?: {
    city?: string
    street?: string
    zip?: string
    notes?: string
  }
  items: CartItem[]
  coupon_code?: string
  discount_amount?: number
  notes?: string
}

export async function createOrder(data: CreateOrderData) {
  const subtotal = data.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = data.shipping_method === 'delivery' ? 30 : 0
  const discount = data.discount_amount || 0
  const total = subtotal - discount + shipping

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      customer_email: data.customer_email,
      shipping_method: data.shipping_method,
      shipping_address: data.shipping_address || null,
      subtotal,
      discount_amount: discount,
      shipping_amount: shipping,
      total,
      coupon_code: data.coupon_code || null,
      notes: data.notes || null,
      status: 'pending',
      payment_status: 'pending',
    })
    .select()
    .single()

  if (orderError) throw orderError

  // Create order items
  const orderItems = data.items.map(item => ({
    order_id: order.id,
    product_id: item.product.id,
    product_name: item.product.name,
    product_image: item.product.image_url,
    quantity: item.quantity,
    unit_price: item.product.price,
    total_price: item.product.price * item.quantity,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) throw itemsError

  return order
}

export async function getOrderById(orderId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', orderId)
    .single()

  if (error) throw error
  return data
}
