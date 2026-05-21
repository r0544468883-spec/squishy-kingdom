-- SquishyAdi Demo Data
-- Run this in Supabase SQL Editor

-- ============================================
-- Categories
-- ============================================
INSERT INTO categories (name, slug, description, sort_order) VALUES
('סקווישים', 'squishies', 'הסקווישים הכי רכים ומפנקים בממלכה', 1),
('נמתחים', 'stretchy', 'דמויות נמתחות שאפשר למתוח לכל הכיוונים', 2),
('מארזים', 'bundles', 'מארזים משתלמים עם כמה מוצרים ביחד', 3),
('מוצרי הפתעה', 'mystery', 'תיבות הפתעה מהממלכה — לא יודעים מה בפנים!', 4);

-- ============================================
-- Products
-- ============================================

-- 1. Cat Toast Squishy
INSERT INTO products (
  name, slug, description, price, compare_at_price,
  image_url, category_id, stock_quantity,
  is_active, is_featured, is_new, tags
) VALUES (
  'סקוויש טוסט חתול',
  'cat-toast-squishy',
  'סקוויש רך ומתוק בצורת טוסט עם פרצוף חתול חמוד! מושלם למעיכה, להרגעה ולמשחק. עשוי מחומר איכותי שחוזר לצורתו המקורית אחרי כל לחיצה.',
  25, 35,
  'https://i.imgur.com/JQxPZKt.jpg',
  (SELECT id FROM categories WHERE slug = 'squishies'),
  50,
  true, true, true,
  ARRAY['סקוויש', 'חתול', 'טוסט', 'חמוד', 'רך']
);

-- 2. Pineapple Squishy
INSERT INTO products (
  name, slug, description, price, compare_at_price,
  image_url, category_id, stock_quantity,
  is_active, is_featured, is_new, tags
) VALUES (
  'סקוויש אננס מחייך',
  'pineapple-squishy',
  'אננס צהוב וחמוד עם חיוך שמח! סקוויש רך במיוחד עם עלים ירוקים. מושלם כצעצוע אנטי-סטרס או כקישוט לחדר.',
  29, NULL,
  'https://i.imgur.com/8KqYvXO.jpg',
  (SELECT id FROM categories WHERE slug = 'squishies'),
  35,
  true, true, true,
  ARRAY['סקוויש', 'אננס', 'פרי', 'צהוב', 'חמוד']
);

-- 3. Glitter Axolotl Squishy
INSERT INTO products (
  name, slug, description, price, compare_at_price,
  image_url, category_id, stock_quantity,
  is_active, is_featured, is_new, tags
) VALUES (
  'סקוויש אקסולוטל נצנצים',
  'glitter-axolotl-squishy',
  'אקסולוטל קסום עם נצנצים בפנים! בכל לחיצה הנצנצים זזים ויוצרים אפקט מדהים. הסקוויש הכי פופולרי בממלכה!',
  35, 45,
  'https://i.imgur.com/vYqWZ7e.jpg',
  (SELECT id FROM categories WHERE slug = 'squishies'),
  20,
  true, true, true,
  ARRAY['סקוויש', 'אקסולוטל', 'נצנצים', 'גליטר', 'כחול']
);

-- 4. Bigfoot Stretchy
INSERT INTO products (
  name, slug, description, price, compare_at_price,
  image_url, category_id, stock_quantity,
  is_active, is_featured, is_new, tags
) VALUES (
  'ביגפוט נמתח',
  'bigfoot-stretchy',
  'דמות ביגפוט ענקית שאפשר למתוח לכל הכיוונים! עשויה מחומר גומי איכותי שחוזר לצורתו. אחד הטרנדים הכי חמים בטיקטוק!',
  39, 49,
  'https://i.imgur.com/YqZKj3t.jpg',
  (SELECT id FROM categories WHERE slug = 'stretchy'),
  15,
  true, true, false,
  ARRAY['נמתח', 'ביגפוט', 'גומי', 'טיקטוק', 'טרנד']
);

-- 5. Cute Buns Bundle (4-pack)
INSERT INTO products (
  name, slug, description, price, compare_at_price,
  image_url, category_id, stock_quantity,
  is_active, is_featured, is_new, tags
) VALUES (
  'מארז 4 לחמניות חמודות',
  'cute-buns-bundle',
  'מארז משתלם של 4 סקווישים בצורת לחמניות חמודות! כל אחת בצבע אחר עם פרצוף מתוק. מושלם למתנה או לאוסף.',
  59, 80,
  'https://i.imgur.com/Rj3QZXO.jpg',
  (SELECT id FROM categories WHERE slug = 'bundles'),
  25,
  true, true, true,
  ARRAY['מארז', 'לחמניות', 'חמוד', '4 יחידות', 'משתלם']
);

-- 6. Cat Hamburger Squishy
INSERT INTO products (
  name, slug, description, price, compare_at_price,
  image_url, category_id, stock_quantity,
  is_active, is_featured, is_new, tags
) VALUES (
  'סקוויש המבורגר חתול',
  'cat-hamburger-squishy',
  'המבורגר ענק עם פרצוף חתול! סקוויש גדול במיוחד (12 ס"מ), רך מאוד ואיטי בחזרה לצורה (Slow Rising). פשוט מדהים!',
  32, NULL,
  'https://i.imgur.com/wQ7FZXM.jpg',
  (SELECT id FROM categories WHERE slug = 'squishies'),
  40,
  true, true, false,
  ARRAY['סקוויש', 'חתול', 'המבורגר', 'גדול', 'slow rising']
);

-- 7. Mystery Box (no image yet — uses placeholder)
INSERT INTO products (
  name, slug, description, price, compare_at_price,
  image_url, category_id, stock_quantity,
  is_active, is_featured, is_new, is_mystery, tags
) VALUES (
  'תיבת האוצר המלכותית',
  'royal-mystery-box',
  'תיבת הפתעה מהממלכה! בפנים מחכה לכם סקוויש או צעצוע טרנדי אקראי בשווי של לפחות ₪40. לא יודעים מה תקבלו — זה החלק הכיף!',
  29, 40,
  'https://i.imgur.com/JQxPZKt.jpg',
  (SELECT id FROM categories WHERE slug = 'mystery'),
  100,
  true, true, true, true,
  ARRAY['הפתעה', 'מסתורי', 'מתנה', 'תיבת אוצר', 'מיסטרי']
);

-- ============================================
-- Coupons
-- ============================================
INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, max_uses, is_active) VALUES
('KINGDOM10', 'percentage', 10, 50, 100, true),
('WELCOME15', 'percentage', 15, 0, 50, true),
('GOLD20', 'fixed', 20, 100, 30, true),
('KNIGHT', 'percentage', 5, 30, NULL, true),
('FREESHIP', 'fixed', 30, 80, 50, true);

-- ============================================
-- Pop-up Locations (demo)
-- ============================================
INSERT INTO popup_locations (name, address, date, start_time, end_time, description) VALUES
('פופ-אפ גינת שרונה', 'שרונה מרקט, תל אביב', '2026-05-25', '16:00', '19:00', 'מכירה מיוחדת עם הנחות בלעדיות!'),
('פופ-אפ גינת מאיר', 'גינת מאיר, תל אביב', '2026-05-30', '15:00', '18:00', 'מכירת סוף שבוע עם תיבות הפתעה!'),
('פופ-אפ דיזנגוף', 'כיכר דיזנגוף, תל אביב', '2026-06-05', '16:00', '20:00', 'השקת קולקציית קיץ חדשה!');
