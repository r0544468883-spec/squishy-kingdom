-- SquishyAdi Kingdom - Database Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. Categories (rooms of the kingdom)
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- ============================================
-- 2. Products
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  image_url TEXT NOT NULL,
  shadow_image_url TEXT,
  video_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  stock_quantity INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_mystery BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- ============================================
-- 3. Customers
-- ============================================
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  address_city TEXT,
  address_street TEXT,
  address_zip TEXT,
  is_child BOOLEAN DEFAULT false,
  parent_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can view own data" ON customers FOR SELECT USING (auth_id = auth.uid());
CREATE POLICY "Customers can update own data" ON customers FOR UPDATE USING (auth_id = auth.uid());
CREATE POLICY "Anyone can create customer" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view all customers" ON customers FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- ============================================
-- 4. Orders
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number BIGINT GENERATED ALWAYS AS IDENTITY,
  customer_id UUID REFERENCES customers(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  tranzila_transaction_id TEXT,
  shipping_method TEXT CHECK (shipping_method IN ('delivery', 'pickup')),
  shipping_address JSONB,
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  notes TEXT,
  coupon_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can view own orders" ON orders FOR SELECT USING (
  customer_id IN (SELECT id FROM customers WHERE auth_id = auth.uid())
);
CREATE POLICY "Anyone can create order" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage orders" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- ============================================
-- 5. Order Items
-- ============================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  product_image TEXT,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can view own order items" ON order_items FOR SELECT USING (
  order_id IN (SELECT id FROM orders WHERE customer_id IN (SELECT id FROM customers WHERE auth_id = auth.uid()))
);
CREATE POLICY "Anyone can create order items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage order items" ON order_items FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- ============================================
-- 6. Carts (server-side persistent)
-- ============================================
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  customer_id UUID REFERENCES customers(id),
  items JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can manage own cart" ON carts FOR ALL USING (true);

-- ============================================
-- 7. Coupons
-- ============================================
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  max_uses INT,
  current_uses INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can validate coupons" ON coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage coupons" ON coupons FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- ============================================
-- 8. Game Rewards (gamification tracking)
-- ============================================
CREATE TABLE game_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  customer_id UUID REFERENCES customers(id),
  game_type TEXT NOT NULL CHECK (game_type IN ('wheel', 'treasure_hunt', 'maze', 'mystery_box')),
  reward_type TEXT CHECK (reward_type IN ('coupon', 'free_shipping', 'mystery_item', 'discount', 'none')),
  reward_value TEXT,
  is_redeemed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE game_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can manage own rewards" ON game_rewards FOR ALL USING (true);

-- ============================================
-- 9. WhatsApp Share Tracking
-- ============================================
CREATE TABLE whatsapp_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID REFERENCES carts(id),
  share_type TEXT CHECK (share_type IN ('buy_for_me', 'share_product', 'share_collection')),
  recipient_phone TEXT,
  wa_link TEXT,
  was_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE whatsapp_shares ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can track shares" ON whatsapp_shares FOR ALL USING (true);

-- ============================================
-- 10. Pop-up Locations (micro-retail)
-- ============================================
CREATE TABLE popup_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  address TEXT,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE popup_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active popups" ON popup_locations FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage popups" ON popup_locations FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- ============================================
-- 11. Admin Users
-- ============================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can view admin list" ON admin_users FOR SELECT USING (
  user_id = auth.uid()
);

-- ============================================
-- 12. Storage Buckets
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('categories', 'categories', true);

CREATE POLICY "Anyone can view product images" ON storage.objects FOR SELECT USING (bucket_id IN ('products', 'categories'));
CREATE POLICY "Admin can upload product images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id IN ('products', 'categories') AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "Admin can delete product images" ON storage.objects FOR DELETE USING (
  bucket_id IN ('products', 'categories') AND
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_carts_session ON carts(session_id);
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_popup_locations_date ON popup_locations(date);

-- ============================================
-- Updated_at trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER carts_updated_at BEFORE UPDATE ON carts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
