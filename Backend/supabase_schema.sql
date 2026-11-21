-- ==============================================================================
-- NANDANI BATIK - SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Run this complete script in your Supabase SQL Editor (Dashboard > SQL Editor)
-- This will create the required tables, indexes, and RLS policies.
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

-- Ensure taxonomy columns exist if the table was previously created
ALTER TABLE public.sarees ADD COLUMN IF NOT EXISTS fabric_type TEXT;
ALTER TABLE public.sarees ADD COLUMN IF NOT EXISTS design_type TEXT;
ALTER TABLE public.sarees ADD COLUMN IF NOT EXISTS colour_type TEXT;
ALTER TABLE public.sarees ADD COLUMN IF NOT EXISTS main_colour TEXT;

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

-- 3. CUSTOMERS TABLE
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

-- 4. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.sarees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- 5. RLS POLICIES FOR PUBLIC ACCESS
-- Sarees: Public can read all sarees, dashboard can manage
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
