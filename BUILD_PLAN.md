# SquishyAdi — Complete Build Plan
# Page-by-page, component-by-component

---

## Build Order (31 Steps)

### Phase A: Foundation (Steps 1-5)
Shared components that every page needs.

### Phase B: Storefront (Steps 6-15)
Customer-facing pages — what kids and parents see.

### Phase C: Cart & Checkout (Steps 16-22)
Purchase flow — the money machine.

### Phase D: Admin Panel (Steps 23-31)
Backoffice for Yuval to manage products and orders.

---

## PHASE A: FOUNDATION

### Step 1: Design Tokens & Base Styles
**File:** `src/app/globals.css` (already created)
- Kingdom color palette (red, gold, cream, parchment)
- Hebrew fonts (Heebo body, Secular One headings)
- RTL direction
- Custom animations (revealGlow, float, sparkle, shimmer)
- `.kingdom-card`, `.squishi-shadow` utility classes

### Step 2: Layout Shell
**Files:**
- `src/components/layout/KingdomHeader.tsx`
  - Logo (text-based for now: "הממלכה של עדי")
  - Navigation links: ראשי | חנות | קטגוריות
  - Cart icon with item count badge (gold circle)
  - Mobile: hamburger menu
  - Sticky top, kingdom-red background with gold accents
  - Height: 64px mobile, 72px desktop

- `src/components/layout/MobileBottomNav.tsx`
  - 4 tabs: בית | חנות | משחקים | עגלה
  - Fixed bottom, visible only on mobile (md:hidden)
  - Active tab: gold icon, inactive: cream/white
  - Height: 64px with safe area padding

- `src/components/layout/KingdomFooter.tsx`
  - Contact info, WhatsApp link
  - Social links (TikTok, Instagram)
  - Copyright
  - Simple, cream background with red accents

- `src/app/(shop)/layout.tsx`
  - Wraps Header + children + Footer + MobileBottomNav
  - Handles cart state (React Context)

### Step 3: Shared UI Components
**Files in `src/components/ui/`:**
- `RoyalButton.tsx` — Primary CTA button
  - Variant: primary (kingdom-red bg, gold border), secondary (outlined), gold (gold bg)
  - Sizes: sm, md, lg, xl (xl = 56px height for kids)
  - Hover: scale-[1.02] + glow shadow
  - Touch target: min 48px

- `GoldenBorder.tsx` — Decorative wrapper with gold border + corner ornaments
- `SectionTitle.tsx` — Hebrew heading with gold underline decoration
- `LoadingSpinner.tsx` — Crown-shaped spinner animation
- `EmptyState.tsx` — Illustration + message + CTA
- `Badge.tsx` — "חדש!", "מבצע!", "אזל!" badges

### Step 4: Cart Context & State
**Files:**
- `src/context/CartContext.tsx`
  - Cart items state (product, quantity, price)
  - addToCart, removeFromCart, updateQuantity, clearCart
  - Cart count, subtotal, total
  - Persists to localStorage + syncs to Supabase carts table
  - Session ID for anonymous users (UUID)

- `src/hooks/useCart.ts` — Hook wrapper for CartContext

### Step 5: Supabase Data Helpers
**Files in `src/lib/`:**
- `products.ts` — getProducts, getProductBySlug, getProductsByCategory, getFeaturedProducts
- `categories.ts` — getCategories, getCategoryBySlug
- `orders.ts` — createOrder, getOrderById, getOrdersByCustomer
- `coupons.ts` — validateCoupon, applyCoupon
- `whatsapp.ts` — generateBuyForMeLink, generateShareLink, trackShare

---

## PHASE B: STOREFRONT

### Step 6: Homepage — "Kingdom Gates"
**File:** `src/app/(shop)/page.tsx`

**Sections (top to bottom):**

1. **Hero Section** (full viewport height on mobile)
   - Background: deep red gradient with subtle gold particles
   - Heading: "ברוכים הבאים לממלכה של עדי" (Secular One font, gold color)
   - Subheading: "הטרנדים הכי חמים — ישר מהארמון"
   - CTA: "כניסה לממלכה" (large gold button)
   - Adi's avatar/photo placeholder area

2. **Featured Products — "THE SQUISHI Reveal"**
   - Grid: 2 cols mobile, 4 cols desktop
   - Each card shows ONLY shadow silhouette
   - Title: "מה מסתתר בממלכה?" (Secular One)
   - Uses `ProductShadowCard` component

3. **Categories — "חדרי הממלכה"**
   - Horizontal scroll on mobile, grid on desktop
   - Each category = decorated card with name + icon
   - Uses `CategoryCard` component

4. **New Arrivals — "הגיעו לארמון"**
   - Standard product grid (revealed, not shadows)
   - Uses `ProductCard` component
   - "לכל המוצרים" link

5. **WhatsApp CTA Banner**
   - Full-width banner, gold background
   - "הצטרפו לקבוצת הממלכה בוואטסאפ!"
   - WhatsApp icon + join link button

6. **Pop-up Map Teaser** (if active pop-ups exist)
   - "הממלכה יוצאת לשטח!"
   - Next pop-up date + location
   - Link to full map

### Step 7: ProductShadowCard Component
**File:** `src/components/products/ProductShadowCard.tsx`
- The CORE mechanic of the store
- Shows: shadow silhouette image (CSS filter: brightness(0))
- On hover: golden glow around shadow
- On click: opens `SquishiRevealModal`
- Card size: ~200px mobile, ~280px desktop
- Gold border, parchment background
- Small "?" icon in corner to tease

### Step 8: SquishiRevealModal Component
**File:** `src/components/products/SquishiRevealModal.tsx`
- Full-screen modal overlay (dark with gold particles)
- Animation sequence:
  1. Shadow appears centered (0.3s)
  2. Golden glow expands (revealGlow animation, 0.6s)
  3. Shadow fades, real image appears (crossfade 0.4s)
  4. Product name + price slide in from bottom
- Content after reveal:
  - Full product image (large)
  - Product name (Secular One, gold)
  - Price (large, bold)
  - Short description
  - "הוסיפו לעגלה!" button (XL, kingdom-red)
  - "עוד פרטים" link -> product detail page
- Close: X button or tap outside
- Mobile: takes full screen with swipe-down to close

### Step 9: ProductCard Component (Regular)
**File:** `src/components/products/ProductCard.tsx`
- For non-shadow contexts (new arrivals, category pages, search)
- Product image (aspect-4/3)
- Product name
- Price (+ compare_at_price with strikethrough if exists)
- "חדש" / "מבצע" badge
- "הוסיפו לעגלה" quick-add button
- Hover: lift + gold border glow
- Mobile: 2 columns, desktop: 3-4 columns

### Step 10: CategoryCard Component
**File:** `src/components/products/CategoryCard.tsx`
- Decorative card for category navigation
- Category image/icon
- Category name (Secular One)
- Product count
- Gold border, hover effect
- Links to category page

### Step 11: Category Page — "Kingdom Rooms"
**File:** `src/app/(shop)/category/[slug]/page.tsx`
- Header: Category name + description + image
- Filter bar: sort by (price, newest, popular), price range
- Product grid: `ProductCard` components
- Toggle: shadow mode (THE SQUISHI) vs. revealed mode
- Pagination or infinite scroll
- Empty state if no products
- Breadcrumb: ראשי > חנות > [קטגוריה]

### Step 12: All Products Page
**File:** `src/app/(shop)/products/page.tsx`
- Same as category page but shows ALL products
- Category filter sidebar/dropdown
- Search bar
- Grid of `ProductCard` or `ProductShadowCard`

### Step 13: Product Detail Page
**File:** `src/app/(shop)/products/[slug]/page.tsx`
- Hero: Large product image (with gallery)
  - Image gallery: main image + thumbnails
  - Swipe on mobile
- Product info:
  - Name (Secular One, large)
  - Price (+ compare price if exists)
  - Description (Heebo, regular)
  - Stock status ("במלאי" / "אזל מהמלאי")
  - Tags/badges
- Actions:
  - Quantity selector (+/- buttons, large for kids)
  - "הוסיפו לעגלה!" (XL button, kingdom-red)
  - "שלחו להורים בוואטסאפ" (green WhatsApp button)
- Video player (if video_url exists) — autoplay loop, muted
- Related products section ("עוד מהממלכה")
- Structured data (JSON-LD for SEO)

### Step 14: WhatsApp "Buy For Me" Flow
**File:** `src/components/whatsapp/BuyForMeButton.tsx`
- Green WhatsApp-styled button
- On click:
  1. Generate cart summary text in Hebrew
  2. Create wa.me link with pre-filled message:
     "היי! 👑 הזמנתי מהממלכה של עדי:\n• [product1] - ₪XX\n• [product2] - ₪XX\nסה\"כ: ₪XX\nלתשלום: [checkout_link]"
  3. Open WhatsApp
  4. Track share in whatsapp_shares table
- Works from: cart, product detail page, dream collection

### Step 15: Search Functionality
**File:** `src/components/search/SearchBar.tsx`
- Search icon in header
- Expanding search input on click
- Real-time search results dropdown
- Search by product name, tags, description
- Supabase full-text search or ilike query
- Recent searches in localStorage

---

## PHASE C: CART & CHECKOUT

### Step 16: Slide-Over Cart
**File:** `src/components/cart/SlideOverCart.tsx`
- Slides in from left (RTL) on cart icon click
- Design: royal scroll / parchment background
- Header: "העגלה המלכותית" + item count + close X
- Cart items list: `CartItem` components
- Gamified progress bar: `CartProgressBar`
- Coupon input: `CouponInput`
- Summary: subtotal, discount, shipping, total
- CTA buttons:
  - "לתשלום" (kingdom-red, full width)
  - "שלחו להורים" (WhatsApp green, full width)
- Empty cart state: "העגלה ריקה! הממלכה מחכה לך"
- Overlay: dark semi-transparent background

### Step 17: CartItem Component
**File:** `src/components/cart/CartItem.tsx`
- Product thumbnail (small)
- Product name
- Unit price
- Quantity controls: - [qty] + (large buttons for kids)
- Line total
- Remove button (trash icon)

### Step 18: CartProgressBar Component
**File:** `src/components/cart/CartProgressBar.tsx`
- Visual progress bar with kingdom milestones:
  - ₪0-49: "שומר" (Guard) — base level
  - ₪50: "אביר" (Knight) — free sticker
  - ₪100: "נסיך/נסיכה" (Prince/Princess) — free shipping
  - ₪150: "מלך/מלכה" (King/Queen) — mystery gift
- Gold progress fill animation
- Crown/badge icons at milestones
- Text: "עוד ₪XX כדי להפוך לאביר!"
- Celebrates when milestone reached (sparkle animation)

### Step 19: CouponInput Component
**File:** `src/components/cart/CouponInput.tsx`
- Input field + "החל" button
- Validates against Supabase coupons table
- Success: green checkmark + discount amount shown
- Error: "קוד לא תקין" message
- Applied coupon: shows code + discount + remove option

### Step 20: Checkout Page
**File:** `src/app/(shop)/checkout/page.tsx`
- Step indicator: 1. פרטים → 2. משלוח → 3. תשלום
- **Step 1: Customer Details**
  - Full name (required)
  - Phone (required, Israeli format validation)
  - Email (required)
  - Notes (optional)
  - Large input fields, clear labels in Hebrew

- **Step 2: Shipping**
  - Radio selection:
    - "משלוח עד הבית" — show address fields (city, street, zip)
    - "איסוף עצמי — מרכז תל אביב" — show pickup info
  - Shipping cost displayed

- **Step 3: Payment**
  - Order summary (items, totals)
  - Tranzila payment integration
  - "לתשלום מאובטח" button
  - Security badges (SSL, secure payment icons)

- Mobile: each step on separate screen
- Desktop: all steps visible, current highlighted

### Step 21: Tranzila Payment Integration
**Files:**
- `src/app/api/tranzila/create-payment/route.ts`
  - Creates payment session with Tranzila API
  - Sends: amount, order ID, customer details
  - Returns: payment page URL or iframe token

- `src/app/api/tranzila/webhook/route.ts`
  - Receives payment confirmation from Tranzila
  - Updates order status to 'paid'
  - Triggers WhatsApp confirmation (wa.me link)

- `src/lib/tranzila.ts`
  - Tranzila API wrapper
  - Create transaction, verify transaction, refund

### Step 22: Order Success Page
**File:** `src/app/(shop)/checkout/success/page.tsx`
- Celebration animation (confetti / gold coins falling)
- "ההזמנה התקבלה!" heading
- Order number
- Order summary
- Estimated delivery/pickup info
- CTA: "חזרו לממלכה" button
- WhatsApp share: "ספרו לחברים על הממלכה!"
- UGC prompt: "תייגו אותנו בטיקטוק!"

---

## PHASE D: ADMIN PANEL

### Step 23: Admin Layout
**Files:**
- `src/app/(admin)/admin/layout.tsx`
  - Clean, functional design (NOT kingdom themed)
  - Sidebar navigation
  - White/gray color scheme
  - Hebrew RTL

- `src/components/admin/AdminSidebar.tsx`
  - Logo: "SquishyAdi Admin"
  - Nav items: דשבורד | מוצרים | קטגוריות | הזמנות | קופונים | פופ-אפ
  - Active state highlight
  - Collapse on mobile

- `src/middleware.ts`
  - Protect /admin routes
  - Check if user exists in admin_users table
  - Redirect to login if not authenticated

### Step 24: Admin Login
**File:** `src/app/(admin)/admin/login/page.tsx`
- Email + password login
- Supabase Auth
- Redirect to dashboard on success
- Simple, clean form

### Step 25: Admin Dashboard
**File:** `src/app/(admin)/admin/page.tsx`
- **Stats cards:**
  - Total orders today / this week / this month
  - Revenue today / this week / this month
  - Total products (active)
  - Total customers
- **Recent orders table** (last 10)
  - Order number, customer, total, status, date
  - Click to view order
- **Low stock alerts** (products with stock < 5)
- **Chart:** orders per day (last 30 days) — optional

### Step 26: Products List Page
**File:** `src/app/(admin)/admin/products/page.tsx`
- Table: image thumbnail, name, category, price, stock, status, actions
- Search bar
- Filter: by category, by status (active/inactive)
- Sort: by name, price, date, stock
- Actions: edit, toggle active, delete
- "מוצר חדש" button -> new product page
- Pagination

### Step 27: Product Form (Add/Edit)
**Files:**
- `src/app/(admin)/admin/products/new/page.tsx`
- `src/app/(admin)/admin/products/[id]/edit/page.tsx`
- `src/components/admin/ProductForm.tsx`

**Form fields:**
- Name (text, required)
- Slug (auto-generated from name, editable)
- Category (dropdown)
- Description (textarea)
- Price (number, required)
- Compare at price (number, optional)
- Stock quantity (number)
- Product image (upload to Supabase Storage, required)
- Shadow image (upload, optional — auto-generate from product image?)
- Video URL (text, optional)
- Gallery images (multi-upload)
- Toggles: is_active, is_featured, is_new, is_mystery
- Tags (multi-input)
- Sort order (number)

**Image upload:**
- Drag & drop zone
- Preview after upload
- Upload to Supabase Storage `products` bucket
- Progress indicator

### Step 28: Categories Management
**File:** `src/app/(admin)/admin/categories/page.tsx`
- Table: image, name, slug, product count, sort order, actions
- Inline edit (name, sort order)
- Add new category modal
- Delete (with confirmation — only if no products)
- Drag-to-reorder

### Step 29: Orders Management
**Files:**
- `src/app/(admin)/admin/orders/page.tsx`
  - Table: order #, customer name, phone, total, status, payment, date
  - Filter: by status (pending, paid, shipped, delivered, cancelled)
  - Search: by order number, customer name, phone
  - Sort: by date, total
  - Pagination

- `src/app/(admin)/admin/orders/[id]/page.tsx`
  - Order details: customer info, items, totals, payment info
  - Status update dropdown (pending -> paid -> shipped -> delivered)
  - Send WhatsApp notification button (opens wa.me with status update)
  - Notes field
  - Timeline: order created -> paid -> shipped -> delivered

### Step 30: Coupons Management
**File:** `src/app/(admin)/admin/coupons/page.tsx`
- Table: code, type, value, min order, uses, expiry, status, actions
- Add new coupon modal:
  - Code (text or auto-generate)
  - Type: percentage / fixed
  - Value
  - Min order amount
  - Max uses
  - Expiry date
  - Active toggle
- Edit / delete actions

### Step 31: Pop-up Locations Management
**File:** `src/app/(admin)/admin/popups/page.tsx`
- Table: name, address, date, time, status
- Add/edit form:
  - Name, description
  - Address
  - Date, start time, end time
  - Active toggle
- Generate QR code button (for physical signage)
- Map preview (optional — Google Maps embed)

---

## Component Dependency Tree

```
RootLayout
├── (shop)/layout.tsx
│   ├── KingdomHeader
│   │   ├── Logo
│   │   ├── NavLinks
│   │   ├── SearchBar
│   │   └── CartIcon (badge count)
│   ├── [page content]
│   ├── SlideOverCart
│   │   ├── CartItem[]
│   │   ├── CartProgressBar
│   │   ├── CouponInput
│   │   └── BuyForMeButton
│   ├── KingdomFooter
│   └── MobileBottomNav
│
├── Homepage
│   ├── HeroSection
│   ├── ProductShadowCard[] → SquishiRevealModal
│   ├── CategoryCard[]
│   ├── ProductCard[]
│   └── WhatsAppBanner
│
├── Category/[slug]
│   ├── CategoryHeader
│   ├── FilterBar
│   └── ProductCard[] or ProductShadowCard[]
│
├── Product/[slug]
│   ├── ProductGallery
│   ├── ProductInfo
│   ├── QuantitySelector
│   ├── AddToCartButton
│   ├── BuyForMeButton
│   ├── VideoPlayer
│   └── RelatedProducts → ProductCard[]
│
├── Checkout
│   ├── CheckoutSteps
│   ├── CustomerForm
│   ├── ShippingSelector
│   └── TranzilaPayment
│
└── (admin)/layout.tsx
    ├── AdminSidebar
    └── [admin pages]
        ├── Dashboard (stats + charts)
        ├── ProductForm (add/edit)
        ├── OrderDetail (view + update)
        └── CouponForm (add/edit)
```

---

## Build Priority & Estimated Effort

| Step | Component | Priority | Effort |
|------|-----------|----------|--------|
| 1-5 | Foundation | MUST | Day 1-2 |
| 6,7,8 | Homepage + SQUISHI | MUST | Day 3-4 |
| 9,10 | ProductCard + CategoryCard | MUST | Day 4 |
| 11,12 | Category + Products pages | MUST | Day 5 |
| 13 | Product detail page | MUST | Day 5-6 |
| 14 | WhatsApp "Buy for me" | MUST | Day 6 |
| 16-19 | Cart (slide-over + progress) | MUST | Day 7 |
| 20 | Checkout page | MUST | Day 8 |
| 21 | Tranzila integration | MUST | Day 8-9 |
| 22 | Order success | MUST | Day 9 |
| 23-25 | Admin layout + dashboard | MUST | Day 9-10 |
| 26-27 | Product management | MUST | Day 10-11 |
| 28 | Category management | MUST | Day 11 |
| 29 | Order management | MUST | Day 11-12 |
| 30 | Coupon management | SHOULD | Day 12 |
| 31 | Pop-up management | NICE | Day 12 |
| 15 | Search | SHOULD | Day 13 |
| — | Mobile polish + testing | MUST | Day 13-14 |
| — | SEO + meta tags | MUST | Day 14 |
| — | Deploy + QR codes | MUST | Day 14 |
