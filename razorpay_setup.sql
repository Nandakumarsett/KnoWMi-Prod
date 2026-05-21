-- razorpay_setup.sql
-- Run this in your Supabase SQL Editor to create the tables for Razorpay orders

-- Create the payment_orders table
CREATE TABLE IF NOT EXISTS public.payment_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Nullable for guest checkouts
    razorpay_order_id TEXT UNIQUE NOT NULL,
    razorpay_payment_id TEXT UNIQUE,
    razorpay_signature TEXT,
    amount_paise INTEGER NOT NULL, -- Price in paise (e.g. 99900 for ₹999)
    currency TEXT DEFAULT 'INR' NOT NULL,
    status TEXT DEFAULT 'created' CHECK (status IN ('created', 'paid', 'failed')),
    items JSONB, -- E.g. [{"plan_id": "creator", "quantity": 1}]
    customer_details JSONB, -- To store shipping info, phone, email, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on RLS
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own orders
CREATE POLICY "Users can view their own payment orders"
    ON public.payment_orders FOR SELECT
    USING (auth.uid() = user_id);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_payment_orders_updated_at ON public.payment_orders;
CREATE TRIGGER set_payment_orders_updated_at
    BEFORE UPDATE ON public.payment_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Note: The insertion and updates of this table will be done by the Edge Function
-- which uses the Service Role Key, bypassing RLS. This prevents malicious users
-- from manually inserting a row with a fake razorpay_order_id.
