-- ================================================
-- KnoWMi E-Commerce Customers Directory System (Cleaned & Corrected)
-- Run this script in your Supabase SQL Editor
-- ================================================

-- 1. Create sequence for BIGINT customer IDs starting at 1001 if not exists
CREATE SEQUENCE IF NOT EXISTS public.cust_id_seq START 1001;

-- 2. Re-create public.customers table cleanly
DROP TABLE IF EXISTS public.customers CASCADE;

CREATE TABLE public.customers (
  id BIGINT PRIMARY KEY DEFAULT nextval('public.cust_id_seq'),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT NULL,
  street_address TEXT DEFAULT NULL,
  city TEXT DEFAULT NULL,
  state TEXT DEFAULT NULL,
  pincode TEXT DEFAULT NULL,
  total_orders INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Add customer_id reference to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS customer_id BIGINT REFERENCES public.customers(id) ON DELETE SET NULL;

-- 4. Enable RLS on customers
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users to view own customer record" ON public.customers;
CREATE POLICY "Allow users to view own customer record"
ON public.customers FOR SELECT
USING (
  auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'owner')
);

DROP POLICY IF EXISTS "Allow public and authenticated insert on customers" ON public.customers;
CREATE POLICY "Allow public and authenticated insert on customers"
ON public.customers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow owner update on customers" ON public.customers;
CREATE POLICY "Allow owner update on customers"
ON public.customers FOR UPDATE
USING (
  auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'owner')
);

-- 5. Backfill profiles into public.customers with REAL Signup Emails & Accurately Gated Order/Address Data
DO $$
DECLARE
  r RECORD;
  v_cust_id BIGINT;
BEGIN
  FOR r IN 
    SELECT 
      p.id AS profile_id,
      p.user_id,
      COALESCE(NULLIF(TRIM(CONCAT(p.first_name, ' ', p.last_name)), ''), SPLIT_PART(au.email, '@', 1), 'KnoWMi Member') AS full_name,
      COALESCE(au.email, 'noemail@knowmi.co') AS real_email,
      p.phone AS profile_phone,
      po.customer_phone,
      po.shipping_address,
      po.delivery_city,
      po.delivery_state,
      po.delivery_pincode,
      COALESCE(ord_stats.order_count, 0) AS paid_order_count,
      COALESCE(ord_stats.total_paid, 0) AS paid_total_spent
    FROM public.profiles p
    LEFT JOIN auth.users au ON au.id = p.user_id
    LEFT JOIN (
      SELECT profile_id, COUNT(*) AS order_count, SUM(amount) AS total_paid
      FROM public.orders
      WHERE status IN ('paid', 'shipped', 'delivered')
      GROUP BY profile_id
    ) ord_stats ON ord_stats.profile_id = p.id
    LEFT JOIN LATERAL (
      SELECT customer_phone, shipping_address, delivery_city, delivery_state, delivery_pincode
      FROM public.orders
      WHERE profile_id = p.id AND status IN ('paid', 'shipped', 'delivered')
      ORDER BY created_at DESC
      LIMIT 1
    ) po ON true
  LOOP
    -- Insert customer record
    INSERT INTO public.customers (
      user_id,
      profile_id,
      full_name,
      email,
      phone,
      street_address,
      city,
      state,
      pincode,
      total_orders,
      total_spent
    ) VALUES (
      r.user_id,
      r.profile_id,
      r.full_name,
      r.real_email,
      CASE WHEN r.paid_order_count > 0 THEN COALESCE(r.profile_phone, r.customer_phone) ELSE r.profile_phone END,
      CASE WHEN r.paid_order_count > 0 THEN r.shipping_address ELSE NULL END,
      CASE WHEN r.paid_order_count > 0 THEN r.delivery_city ELSE NULL END,
      CASE WHEN r.paid_order_count > 0 THEN r.delivery_state ELSE NULL END,
      CASE WHEN r.paid_order_count > 0 THEN r.delivery_pincode ELSE NULL END,
      r.paid_order_count,
      r.paid_total_spent
    )
    RETURNING id INTO v_cust_id;

    -- Link orders to customer_id
    IF v_cust_id IS NOT NULL THEN
      UPDATE public.orders SET customer_id = v_cust_id WHERE profile_id = r.profile_id;
    END IF;
  END LOOP;
END $$;

-- 6. Updated record_customer_order RPC function with exact address & increment updates
DROP FUNCTION IF EXISTS public.record_customer_order CASCADE;

CREATE OR REPLACE FUNCTION public.record_customer_order(
  p_user_id UUID,
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_customer_phone TEXT,
  p_item_name TEXT,
  p_size TEXT,
  p_amount INTEGER,
  p_shipping_address TEXT,
  p_city TEXT,
  p_state TEXT,
  p_pincode TEXT,
  p_payment_id TEXT DEFAULT NULL,
  p_razorpay_order_id TEXT DEFAULT NULL,
  p_model_image_url TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_profile_id UUID;
  v_customer_id BIGINT;
  v_order_number TEXT;
  v_new_order_id UUID;
  v_result JSONB;
BEGIN
  -- Find profile_id
  SELECT id INTO v_profile_id FROM public.profiles WHERE user_id = p_user_id LIMIT 1;

  -- 1. Create or update customer record in public.customers
  SELECT id INTO v_customer_id FROM public.customers WHERE user_id = p_user_id LIMIT 1;

  IF v_customer_id IS NULL THEN
    INSERT INTO public.customers (
      user_id, profile_id, full_name, email, phone, street_address, city, state, pincode, total_orders, total_spent
    ) VALUES (
      p_user_id, v_profile_id, p_customer_name, p_customer_email, p_customer_phone, p_shipping_address, p_city, p_state, p_pincode, 1, p_amount
    )
    RETURNING id INTO v_customer_id;
  ELSE
    UPDATE public.customers
    SET full_name = COALESCE(NULLIF(p_customer_name, ''), full_name),
        email = COALESCE(NULLIF(p_customer_email, ''), email),
        phone = COALESCE(NULLIF(p_customer_phone, ''), phone),
        street_address = p_shipping_address,
        city = p_city,
        state = p_state,
        pincode = p_pincode,
        total_orders = total_orders + 1,
        total_spent = total_spent + p_amount,
        updated_at = now()
    WHERE id = v_customer_id;
  END IF;

  -- 2. Generate next unique sequential order number
  v_order_number := public.generate_next_order_number();

  -- 3. Insert order record linked to BIGINT customer_id
  INSERT INTO public.orders (
    profile_id,
    customer_id,
    order_number,
    item_name,
    item_type,
    size,
    amount,
    status,
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    delivery_city,
    delivery_state,
    delivery_pincode,
    payment_id,
    razorpay_order_id,
    model_image_url,
    estimated_delivery,
    order_date,
    created_at
  ) VALUES (
    v_profile_id,
    v_customer_id,
    v_order_number,
    p_item_name,
    'tshirt',
    p_size,
    p_amount,
    'paid',
    p_customer_name,
    p_customer_email,
    p_customer_phone,
    p_shipping_address,
    p_city,
    p_state,
    p_pincode,
    p_payment_id,
    p_razorpay_order_id,
    p_model_image_url,
    '3 - 5 Business Days',
    CURRENT_DATE,
    now()
  )
  RETURNING id INTO v_new_order_id;

  -- 4. Update profile status and phone
  IF v_profile_id IS NOT NULL THEN
    UPDATE public.profiles
    SET status = 'paid',
        is_purchased = true,
        purchased_at = now(),
        phone = COALESCE(NULLIF(p_customer_phone, ''), phone),
        amount_paid = COALESCE(amount_paid, 0) + p_amount
    WHERE id = v_profile_id;

    UPDATE public.public_profiles
    SET status = 'paid'
    WHERE id = v_profile_id;
  END IF;

  v_result := jsonb_build_object(
    'order_id', v_new_order_id,
    'customer_id', v_customer_id,
    'order_number', v_order_number,
    'status', 'paid',
    'amount', p_amount
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.record_customer_order TO authenticated, anon, service_role;
