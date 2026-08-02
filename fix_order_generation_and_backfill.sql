-- ================================================
-- Fix Order Generation & Backfill for Paid Account "testing" (Amount: ₹799)
-- Run this script in your Supabase SQL Editor
-- ================================================

-- 1. Ensure RLS policies allow inserting and viewing orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated users to insert orders" ON public.orders;
CREATE POLICY "Allow authenticated users to insert orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow users to view own orders" ON public.orders;
CREATE POLICY "Allow users to view own orders" 
ON public.orders 
FOR SELECT 
USING (
  auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = profile_id)
  OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'owner')
);

-- 2. Backfill/Create Order and Update Status for user "testing"
DO $$
DECLARE
  v_profile_id UUID;
  v_order_num TEXT;
BEGIN
  -- Get testing user profile
  SELECT id INTO v_profile_id 
  FROM public.profiles 
  WHERE LOWER(first_name) = 'testing' OR secure_slug = 'testing'
  LIMIT 1;

  IF v_profile_id IS NOT NULL THEN
    -- Generate unique order number
    v_order_num := 'KWM-' || FLOOR(1000 + RANDOM() * 8999)::TEXT;

    -- Update profile status to paid and amount_paid to 799
    UPDATE public.profiles 
    SET status = 'paid',
        is_purchased = true,
        purchased_at = COALESCE(purchased_at, now()),
        amount_paid = 799
    WHERE id = v_profile_id;

    -- Update public_profiles
    UPDATE public.public_profiles 
    SET status = 'paid'
    WHERE id = v_profile_id;

    -- Delete any dummy 999 orders if present for testing profile
    DELETE FROM public.orders WHERE profile_id = v_profile_id AND amount = 999;

    -- Create active paid order for ₹799 if no order exists
    IF NOT EXISTS (SELECT 1 FROM public.orders WHERE profile_id = v_profile_id) THEN
      INSERT INTO public.orders (
        profile_id,
        order_number,
        item_name,
        item_type,
        size,
        amount,
        status,
        shipping_address,
        delivery_city,
        estimated_delivery,
        tracking_info,
        order_date,
        created_at
      ) VALUES (
        v_profile_id,
        v_order_num,
        'KnoWMi Phygital Signature Tee (Regular Edition)',
        'tshirt',
        'L',
        799,
        'paid',
        'Customer Standard Shipping Address',
        'Bengaluru',
        '3 - 5 Business Days',
        'DISPATCH: KWM1088IN',
        CURRENT_DATE,
        now()
      );
    END IF;
  END IF;
END $$;
