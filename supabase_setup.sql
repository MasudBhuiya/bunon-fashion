-- =====================================================================
-- Supabase Table Schema Setup for Bunon Threads & Trends
-- Copy and paste this script into your Supabase SQL Editor
-- (https://supabase.com -> Project -> SQL Editor -> New Query)
-- =====================================================================

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    "banglaName" TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    "imageUrl" TEXT,
    category TEXT NOT NULL,
    "categoryBangla" TEXT NOT NULL,
    rating NUMERIC NOT NULL DEFAULT 5.0,
    "reviewsCount" INTEGER NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    "productName" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    "commentBangla" TEXT,
    date TEXT NOT NULL,
    "isVerifiedPurchase" BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Updates Table
CREATE TABLE IF NOT EXISTS public.updates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    "categoryBangla" TEXT NOT NULL,
    date TEXT NOT NULL,
    "imageUrl" TEXT,
    badge TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    items JSONB NOT NULL,
    "totalPrice" NUMERIC NOT NULL,
    "shippingInfo" JSONB NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    date TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Profiles Table (User Registry for passwordless login)
CREATE TABLE IF NOT EXISTS public.profiles (
    phone TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    "avatarUrl" TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) CONTROL & PUBLIC BYPASS POLICIES
-- =====================================================================

-- Enable RLS on all tables so we can define permissive policy rules matching Supabase
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid errors on reapplying
DROP POLICY IF EXISTS "Public Select Products" ON public.products;
DROP POLICY IF EXISTS "Public Insert Products" ON public.products;
DROP POLICY IF EXISTS "Public Update Products" ON public.products;
DROP POLICY IF EXISTS "Public Delete Products" ON public.products;

DROP POLICY IF EXISTS "Public Select Reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public Insert Reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public Update Reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public Delete Reviews" ON public.reviews;

DROP POLICY IF EXISTS "Public Select Updates" ON public.updates;
DROP POLICY IF EXISTS "Public Insert Updates" ON public.updates;
DROP POLICY IF EXISTS "Public Update Updates" ON public.updates;
DROP POLICY IF EXISTS "Public Delete Updates" ON public.updates;

DROP POLICY IF EXISTS "Public Select Orders" ON public.orders;
DROP POLICY IF EXISTS "Public Insert Orders" ON public.orders;
DROP POLICY IF EXISTS "Public Update Orders" ON public.orders;
DROP POLICY IF EXISTS "Public Delete Orders" ON public.orders;

DROP POLICY IF EXISTS "Public Select Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public Insert Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public Update Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public Delete Profiles" ON public.profiles;

-- Create Open Permissive policies for Products
CREATE POLICY "Public Select Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Insert Products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Public Delete Products" ON public.products FOR DELETE USING (true);

-- Create Open Permissive policies for Reviews
CREATE POLICY "Public Select Reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public Insert Reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Reviews" ON public.reviews FOR UPDATE USING (true);
CREATE POLICY "Public Delete Reviews" ON public.reviews FOR DELETE USING (true);

-- Create Open Permissive policies for Updates
CREATE POLICY "Public Select Updates" ON public.updates FOR SELECT USING (true);
CREATE POLICY "Public Insert Updates" ON public.updates FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Updates" ON public.updates FOR UPDATE USING (true);
CREATE POLICY "Public Delete Updates" ON public.updates FOR DELETE USING (true);

-- Create Open Permissive policies for Orders
CREATE POLICY "Public Select Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Public Delete Orders" ON public.orders FOR DELETE USING (true);

-- Create Open Permissive policies for Profiles
CREATE POLICY "Public Select Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Insert Profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Profiles" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Public Delete Profiles" ON public.profiles FOR DELETE USING (true);

-- Disable Row Level Security (RLS) for simple public client-side access (as a double-layer backup if permitted)
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.updates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Grant permissions openly for public client access
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.reviews TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.updates TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.orders TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.profiles TO anon, authenticated, service_role;
