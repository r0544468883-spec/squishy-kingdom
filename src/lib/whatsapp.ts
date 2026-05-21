import { CartItem } from '@/types'

const STORE_PHONE = '972XXXXXXXXX' // TODO: replace with real number
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://squishy-kingdom.vercel.app'

export function generateBuyForMeLink(items: CartItem[], total: number): string {
  const itemLines = items.map(item =>
    `• ${item.product.name} (x${item.quantity}) — ₪${(item.product.price * item.quantity).toFixed(0)}`
  ).join('\n')

  const message = `היי! 👑 הזמנתי מהממלכה של עדי:\n\n${itemLines}\n\nסה"כ: ₪${total.toFixed(0)}\n\nלתשלום: ${SITE_URL}/checkout`

  return `https://wa.me/?text=${encodeURIComponent(message)}`
}

export function generateShareProductLink(productName: string, productSlug: string): string {
  const message = `תראו מה מצאתי בממלכה של עדי! 👑\n${productName}\n${SITE_URL}/products/${productSlug}`
  return `https://wa.me/?text=${encodeURIComponent(message)}`
}

export function generateOrderConfirmationLink(phone: string, orderNumber: number, total: number): string {
  const message = `👑 ההזמנה שלך מהממלכה של עדי התקבלה!\n\nמספר הזמנה: #${orderNumber}\nסה"כ: ₪${total.toFixed(0)}\n\nתודה שקניתם מהממלכה! 🎉`
  const cleanPhone = phone.replace(/[^0-9]/g, '').replace(/^0/, '972')
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}

export function generateStoreWhatsAppLink(): string {
  return `https://wa.me/${STORE_PHONE}`
}
