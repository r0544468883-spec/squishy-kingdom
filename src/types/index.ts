export interface Product {
  id: string
  category_id: string | null
  name: string
  slug: string
  description: string | null
  price: number
  compare_at_price: number | null
  image_url: string
  shadow_image_url: string | null
  video_url: string | null
  gallery_urls: string[]
  stock_quantity: number
  is_active: boolean
  is_featured: boolean
  is_new: boolean
  is_mystery: boolean
  tags: string[]
  sort_order: number
  created_at: string
  updated_at: string
  category?: Category
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  order_number: number
  customer_id: string | null
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  subtotal: number
  discount_amount: number
  shipping_amount: number
  total: number
  payment_method: string | null
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  tranzila_transaction_id: string | null
  shipping_method: 'delivery' | 'pickup' | null
  shipping_address: {
    city?: string
    street?: string
    zip?: string
    notes?: string
  } | null
  customer_name: string | null
  customer_phone: string | null
  customer_email: string | null
  notes: string | null
  coupon_code: string | null
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_image: string | null
  quantity: number
  unit_price: number
  total_price: number
}

export interface Coupon {
  id: string
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_order_amount: number
  max_uses: number | null
  current_uses: number
  is_active: boolean
  expires_at: string | null
  created_at: string
}

export interface Customer {
  id: string
  auth_id: string | null
  full_name: string | null
  phone: string | null
  email: string | null
  address_city: string | null
  address_street: string | null
  address_zip: string | null
  is_child: boolean
  parent_phone: string | null
  created_at: string
  updated_at: string
}

export interface PopupLocation {
  id: string
  name: string
  description: string | null
  latitude: number | null
  longitude: number | null
  address: string | null
  date: string
  start_time: string | null
  end_time: string | null
  is_active: boolean
  created_at: string
}

export interface GameReward {
  id: string
  session_id: string | null
  customer_id: string | null
  game_type: 'wheel' | 'treasure_hunt' | 'maze' | 'mystery_box'
  reward_type: 'coupon' | 'free_shipping' | 'mystery_item' | 'discount' | 'none' | null
  reward_value: string | null
  is_redeemed: boolean
  created_at: string
}
