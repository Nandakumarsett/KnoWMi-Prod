-- ================================================
-- KnoWMi E-Commerce Dedicated Customers Directory System
-- Run this script in your Supabase SQL Editor
-- ================================================

-- 1. Create sequence for customer codes (CUST-1001, CUST-1002...)
CREATE SEQUENCE IF NOT EXISTS public.cust_code_seq START 1001;

-- 2. Create public.customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_code TEXT UNIQUE DEFAULT ('CUST-' || LPAD(nextval('public.cust_code_seq')::text, 4, '0')),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  street_address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  total_orders INTEGER DEFAULT 1,
  total_spent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Add customer_id reference to orders table if not exists
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;

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

-- 5. Backfill existing profiles into public.customers table
DO $$
DECLARE
  r RECORD;
  v_cust_id UUID;
BEGIN
  FOR r IN 
    SELECT DISTINCT ON (p.id)
      p.id AS profile_id,
      p.user_id,
      COALESCE(NULLIF(TRIM(CONCAT(p.first_name, ' ', p.last_name)), ''), 'KnoWMi Customer') AS full_name,
      COALESCE(o.customer_email, 'customer@knowmi.co') AS email,
      COALESCE(p.phone, o.customer_phone, '') AS phone,
      COALESCE(o.shipping_address, '') AS street_address,
      COALESCE(o.delivery_city, 'Bengaluru') AS city,
      COALESCE(o.delivery_state, 'Karnataka') AS state,
      COALESCE(o.delivery_pincode, '') AS pincode,
      COALESCE(p.amount_paid, 799) AS total_spent
    FROM public.profiles p
    LEFT JOIN public.orders o ON o.profile_id = p.id
    ORDER BY p.id, o.created_at DESC
  LOOP
    IF NOT EXISTS (SELECT 1 FROM public.customers WHERE profile_id = r.profile_id OR user_id = r.user_id) THEN
      INSERT INTO public.customers (
        user_id, profile_id, full_name, email, phone, street_address, city, state, pincode, total_spent
      ) VALUES (
        r.user_id, r.profile_id, r.full_name, r.email, r.phone, r.street_address, r.city, r.state, r.pincode, r.total_spent
      )
      RETURNING id INTO v_cust_id;

      IF v_cust_id IS NOT NULL THEN
        UPDATE public.orders SET customer_id = v_cust_id WHERE profile_id = r.profile_id;
      END IF;
    END IF;
  END LOOP;
END $$;

-- 6. Updated record_customer_order RPC function to auto-upsert into public.customers
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
  v_customer_id UUID;
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
        street_address = COALESCE(NULLIF(p_shipping_address, ''), street_address),
        city = COALESCE(NULLIF(p_city, ''), city),
        state = COALESCE(NULLIF(p_state, ''), state),
        pincode = COALESCE(NULLIF(p_pincode, ''), pincode),
        total_orders = total_orders + 1,
        total_spent = total_spent + p_amount,
        updated_at = now()
    WHERE id = v_customer_id;
  END IF;

  -- 2. Generate next unique sequential order number
  v_order_number := public.generate_next_order_number();

  -- 3. Insert order record linked to customer_id
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
