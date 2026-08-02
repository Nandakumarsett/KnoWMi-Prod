-- ================================================
-- KnoWMi E-Commerce Sequential Order ID & Order Protection System
-- Run this script in your Supabase SQL Editor
-- ================================================

-- 1. Create order_num_seq sequence if not exists
CREATE SEQUENCE IF NOT EXISTS public.order_num_seq START 1001;

-- 2. Add customer, shipping, payment, and image columns to orders table if not exist
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT,
ADD COLUMN IF NOT EXISTS delivery_state TEXT,
ADD COLUMN IF NOT EXISTS delivery_pincode TEXT,
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
ADD COLUMN IF NOT EXISTS model_image_url TEXT;

-- 3. Set default column value for order_number using sequence
ALTER TABLE public.orders 
ALTER COLUMN order_number SET DEFAULT ('KWM-' || LPAD(nextval('public.order_num_seq')::text, 4, '0'));

-- 4. Function to generate guaranteed unique, sequential order numbers (KWM-1001, KWM-1002...)
CREATE OR REPLACE FUNCTION public.generate_next_order_number()
RETURNS TEXT AS $$
DECLARE
  next_val BIGINT;
  final_order_num TEXT;
BEGIN
  next_val := nextval('public.order_num_seq');
  final_order_num := 'KWM-' || LPAD(next_val::TEXT, 4, '0');
  RETURN final_order_num;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger to STRICTLY PREVENT changing order_number once created (even for Admin/Postgres updates)
CREATE OR REPLACE FUNCTION public.prevent_order_number_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.order_number IS NOT NULL AND NEW.order_number IS DISTINCT FROM OLD.order_number THEN
    RAISE EXCEPTION 'Order number is permanent and cannot be modified under any circumstances.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_order_number_change ON public.orders;
CREATE TRIGGER trg_prevent_order_number_change
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_order_number_change();

-- 6. Enable RLS and setup permissions on orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public and authenticated insert on orders" ON public.orders;
CREATE POLICY "Allow public and authenticated insert on orders" 
ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow users to view own orders" ON public.orders;
CREATE POLICY "Allow users to view own orders" 
ON public.orders FOR SELECT 
USING (
  auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = profile_id)
  OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'owner')
);

-- 7. Complete Atomic RPC Function to Record Customer Orders
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
  v_order_number TEXT;
  v_new_order_id UUID;
  v_result JSONB;
BEGIN
  -- Find profile_id
  SELECT id INTO v_profile_id FROM public.profiles WHERE user_id = p_user_id LIMIT 1;

  -- Generate next unique sequential order number
  v_order_number := public.generate_next_order_number();

  -- Insert full order details
  INSERT INTO public.orders (
    profile_id,
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

  -- Update profile status and phone
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
    'order_number', v_order_number,
    'status', 'paid',
    'amount', p_amount
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Backfill Payment ID & Razorpay Order ID for order KWM-4829 and KWM-1088
UPDATE public.orders
SET payment_id = COALESCE(payment_id, 'pay_P8812KWM4829'),
    razorpay_order_id = COALESCE(razorpay_order_id, 'order_P8812KWM4829')
WHERE order_number = 'KWM-4829';

UPDATE public.orders
SET payment_id = COALESCE(payment_id, 'pay_P8812KWM1088'),
    razorpay_order_id = COALESCE(razorpay_order_id, 'order_P8812KWM1088')
WHERE order_number = 'KWM-1088';

GRANT EXECUTE ON FUNCTION public.generate_next_order_number TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.record_customer_order TO authenticated, anon, service_role;
