-- ==============================================================================
-- NANDANI BATIK - SUPABASE DATABASE SCHEMA & INITIAL DATA
-- ==============================================================================
-- Run this complete script in your Supabase SQL Editor (Dashboard > SQL Editor)
-- This will create the required tables, indexes, RLS policies, and seed data.
-- ==============================================================================

-- 1. SAREES TABLE
CREATE TABLE IF NOT EXISTS public.sarees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    sinhala_name TEXT,
    category TEXT NOT NULL DEFAULT 'silk-batik',
    category_label TEXT,
    fabric_type TEXT,
    design_type TEXT,
    colour_type TEXT,
    main_colour TEXT,
    fabric TEXT,
    primary_color TEXT,
    color_hex TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    original_price NUMERIC(10, 2),
    discount_percent NUMERIC(5, 2) DEFAULT 0,
    in_stock BOOLEAN DEFAULT TRUE,
    is_new BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    image TEXT NOT NULL,
    hover_image TEXT,
    additional_images TEXT[] DEFAULT ARRAY[]::TEXT[],
    description TEXT,
    pallu_details TEXT,
    blouse_piece TEXT,
    length TEXT,
    wash_care TEXT,
    craft_time TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_reference TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    address TEXT NOT NULL,
    district TEXT NOT NULL,
    city TEXT,
    notes TEXT,
    payment_method TEXT DEFAULT 'cod',
    payment_status TEXT DEFAULT 'pending',
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
    shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    grand_total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CUSTOMERS TABLE (පාරිභෝගික ලියාපදිංචි සහ පිවිසුම් දත්ත ගොනුව)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    whatsapp TEXT,
    email TEXT UNIQUE,
    password TEXT,
    address TEXT NOT NULL,
    district TEXT NOT NULL DEFAULT 'Colombo',
    city TEXT,
    postal_code TEXT,
    notes TEXT,
    orders_count INTEGER DEFAULT 0,
    total_spent NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);

-- 5. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.sarees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES FOR PUBLIC ACCESS
-- Sarees: Public can read all sarees, anon/authenticated can insert/update/delete from dashboard
DROP POLICY IF EXISTS "Public read sarees" ON public.sarees;
CREATE POLICY "Public read sarees" ON public.sarees FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow saree management" ON public.sarees;
CREATE POLICY "Allow saree management" ON public.sarees FOR ALL USING (true) WITH CHECK (true);

-- Orders: Public can create orders, dashboard can view and update
DROP POLICY IF EXISTS "Public insert orders" ON public.orders;
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow order management" ON public.orders;
CREATE POLICY "Allow order management" ON public.orders FOR ALL USING (true) WITH CHECK (true);

-- Customers: Public can register, login, and update, dashboard can view and manage
DROP POLICY IF EXISTS "Public manage customers" ON public.customers;
CREATE POLICY "Public manage customers" ON public.customers FOR ALL USING (true) WITH CHECK (true);

-- 6. STORAGE BUCKET FOR SAREE IMAGES
-- Run this or create a bucket named 'saree-images' from the Supabase Storage dashboard
INSERT INTO storage.buckets (id, name, public) 
VALUES ('saree-images', 'saree-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy to allow public viewing of saree images
DROP POLICY IF EXISTS "Public view saree images" ON storage.objects;
CREATE POLICY "Public view saree images" ON storage.objects
FOR SELECT USING (bucket_id = 'saree-images');

-- Policy to allow uploading saree images
DROP POLICY IF EXISTS "Public upload saree images" ON storage.objects;
CREATE POLICY "Public upload saree images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'saree-images');

-- 8. INITIAL SAREES SEED DATA
INSERT INTO public.sarees (
    id, name, sinhala_name, category, category_label, fabric, primary_color, color_hex,
    price, original_price, discount_percent, in_stock, is_new, is_bestseller, rating, reviews_count,
    image, hover_image, additional_images, description, pallu_details, blouse_piece, length, wash_care, craft_time, tags
) VALUES
(
    'nb-saree-01',
    'Nil Manel Royal Indigo Silk Batik Saree',
    'නිල් මානෙල් රාජකීය සිල්ක් බතික් සාරිය',
    'pure-silk',
    'Pure Silk',
    '100% Pure Mulberry Silk',
    'Dark Blue',
    '#0b1a30',
    28500,
    32000,
    11,
    true,
    true,
    true,
    4.9,
    38,
    '/sarees/saree 1.1.png',
    '/sarees/saree 1.2.png',
    ARRAY['/sarees/saree 1.1.png', '/sarees/saree 1.2.png'],
    'An iconic signature creation by Nandani Batik. Handcrafted on lustrous pure mulberry silk in the signature royal dark blue tone, embellished with intricate wax-drawn Sri Lankan blue water lily (Nil Manel) and paisley patterns across the body, leading into an opulent statement pallu.',
    'Intricately hand-waxed dual-tone floral chandelier with fine crackle effect',
    'Includes 1.0 Meter matching unstitched pure silk blouse piece with hand-batiked sleeve borders',
    '6.0 Meters (5.0m Saree body + 1.0m Blouse piece)',
    'Dry clean recommended to preserve pure silk luster and reactive batik dyes',
    '4 days of hand wax-drawing and dual-bath dyeing',
    ARRAY['Signature Color', 'Pure Silk', 'Best Seller', 'Handmade Wax Batik']
),
(
    'nb-saree-02',
    'Mayura Emerald & Gold Handloom Silk Saree',
    'මයුර එමරල්ඩ් සහ රන්වන් සිල්ක් සාරිය',
    'pure-silk',
    'Pure Silk',
    'Raw Silk & Handloom Blend',
    'Emerald Green',
    '#047857',
    26000,
    29500,
    12,
    true,
    true,
    true,
    4.8,
    29,
    '/sarees/saree 2.1.png',
    '/sarees/saree 2.2.png',
    ARRAY['/sarees/saree 2.1.png', '/sarees/saree 2.2.png'],
    'Rich bottle emerald green silk with fine crackle batik veins, adorned with stylized royal peacock (Mayura) feathers in golden ochre and turquoise accents.',
    'Full peacock plume artistic panel with traditional Lankan floral motifs',
    'Includes 1.0 Meter raw silk contrast blouse fabric in ochre gold',
    '6.0 Meters total drape length',
    'Dry Clean or Gentle Hand Wash in mild silk shampoo',
    '3 days of artisan wax resist work',
    ARRAY['Handloom Silk', 'Peacock Motifs', 'Festive Favorite']
),
(
    'nb-saree-03',
    'Crimson Araliya Bridal Silk Saree',
    'අරලිය මංගල සිල්ක් බතික් සාරිය',
    'bridal-kandyan',
    'Bridal & Kandyan',
    'Heavy Mulberry Tussar Silk',
    'Crimson Red',
    '#991b1b',
    45000,
    52000,
    13,
    true,
    false,
    true,
    5.0,
    52,
    '/sarees/saree 3.1.png',
    '/sarees/saree 3.2.png',
    ARRAY['/sarees/saree 3.1.png', '/sarees/saree 3.2.png'],
    'Designed exclusively for brides and grand traditional ceremonies. Deep bridal crimson red accented with handcrafted temple lotus wreaths and subtle gold wax highlights.',
    'Regal royal wedding pallu with heavy hand-drawn Sri Lankan flora and golden border',
    'Includes 1.2 Meters heavy silk blouse fabric with bridal sleeve and neckline borders',
    '6.2 Meters total drape length',
    'Strictly Professional Dry Clean Only',
    '6 days of multi-layer hot wax immersion dyeing',
    ARRAY['Bridal Collection', 'Pure Tussar Silk', 'Heirloom Piece']
),
(
    'nb-saree-04',
    'Amber Sunburst Handloom Cotton Batik Saree',
    'ඇම්බර් හිරු කිරණ හැන්ඩ්ලූම් කපු සාරිය',
    'handloom-cotton',
    'Handloom Cotton',
    '100% Handspun Ceylon Cotton',
    'Mustard Gold',
    '#b45309',
    16500,
    19000,
    13,
    true,
    true,
    false,
    4.7,
    21,
    '/sarees/saree 4.1.png',
    '/sarees/saree 4.2.png',
    ARRAY['/sarees/saree 4.1.png', '/sarees/saree 4.2.png'],
    'Bask in tropical warmth with our 100% handloom combed cotton saree. Features warm turmeric and amber hues accented with charcoal crackle batik geometric borders.',
    'Contemporary geometric blocks infused with abstract batik floral patterns',
    'Includes 1.0 Meter matching handloom cotton blouse fabric in charcoal contrast',
    '6.0 Meters (5.0m Saree body + 1.0m Blouse)',
    'Cold water gentle hand wash with mild detergent; dry in shade',
    '3 days of artisanal hand weaving & wax dyeing',
    ARRAY['100% Cotton', 'Handloom Weave', 'Office Friendly']
),
(
    'nb-saree-05',
    'Ocean Waves Turquoise & Navy Silk Saree',
    'සාගර රැළි ටර්කොයිස් සහ තද නිල් සිල්ක් සාරිය',
    'pure-silk',
    'Pure Silk',
    'Pure Georgette Silk',
    'Turquoise',
    '#0891b2',
    27500,
    31000,
    11,
    true,
    true,
    true,
    4.9,
    34,
    '/sarees/saree 5.1.png',
    '/sarees/saree 5.2.png',
    ARRAY['/sarees/saree 5.1.png', '/sarees/saree 5.2.png'],
    'Inspired by the vibrant Indian Ocean surrounding Sri Lanka. Graduating hues of crystal turquoise and Nandani signature dark navy blue, creating a mesmerizing wave flow.',
    'Cascade of cascading lotus blossoms against deep navy wax-crackled background',
    'Includes 1.0 Meter dark navy pure silk blouse fabric',
    '6.0 Meters total length',
    'Dry clean recommended',
    '4 days of ombre gradient wax batik',
    ARRAY['Ombre Gradient', 'Silk Georgette', 'Evening Glow']
),
(
    'nb-saree-06',
    'Midnight Star Obsidian & Silver Raw Silk Saree',
    'මැදියම් තාරකා කළු සහ රිදී සිල්ක් සාරිය',
    'party-wear',
    'Party & Evening',
    'Raw Matka Silk',
    'Midnight Black',
    '#18181b',
    29500,
    34000,
    13,
    true,
    false,
    true,
    4.8,
    41,
    'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=80',
    ARRAY['https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=80'],
    'For those who love sophisticated drama. Deep midnight charcoal and obsidian raw silk with fine silver and platinum-toned wax veining, finished with traditional Sinhala Liya Wela vine motifs.',
    'Geometric silver starburst panel with intricate vine borders',
    'Includes 1.0 Meter unstitched raw silk blouse piece in slate silver tone',
    '6.0 Meters',
    'Dry Clean Only',
    '4 days of fine line wax detailing',
    ARRAY['Raw Silk', 'Formal Evening', 'Artisan Handcraft']
)
ON CONFLICT (id) DO NOTHING;
