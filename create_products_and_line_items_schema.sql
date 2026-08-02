-- ================================================
-- Enterprise E-Commerce Schema Migration
-- 1. public.products (Product Master Catalog with Inventory Tracking)
-- 2. public.order_line_items (Relational Line Items per Order)
-- 3. Inventory Trigger & Updated record_customer_order RPC
-- ================================================

-- 1. Create Product Sequence starting at 5001
CREATE SEQUENCE IF NOT EXISTS public.prod_id_seq START WITH 5001;

-- 2. Create public.products table
CREATE TABLE IF NOT EXISTS public.products (
  id BIGINT PRIMARY KEY DEFAULT nextval('public.prod_id_seq'),
  title TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  price NUMERIC NOT NULL DEFAULT 799,
  category TEXT DEFAULT 'Streetwear',
  description TEXT,
  image_1 TEXT NOT NULL,
  image_2 TEXT,
  image_3 TEXT,
  inventory_on_hand INTEGER NOT NULL DEFAULT 100,
  inventory_committed INTEGER NOT NULL DEFAULT 0,
  inventory_damaged INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Read policy for products (everyone can read active products)
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products"
ON public.products FOR SELECT
USING (is_active = true OR EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'owner'));

-- Write policy for owner
DROP POLICY IF EXISTS "Owner can manage products" ON public.products;
CREATE POLICY "Owner can manage products"
ON public.products FOR ALL
USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'owner'));

-- 3. Insert Initial KnoWMi Products Catalog
INSERT INTO public.products (id, title, sku, price, image_1, image_2, image_3, inventory_on_hand, inventory_committed, inventory_damaged)
VALUES 
(
  5001,
  'KnoWMi Phygital Signature Tee (Regular Edition)',
  'KWM-SIG-REG-01',
  799,
  '/assets/scrolly/tshirt_front.png',
  '/assets/scrolly/tshirt_back.png',
  '/assets/scrolly/shirt_hero.png',
  250,
  12,
  0
),
(
  5002,
  'Work Hard. Stay Humble. (Anime Edition)',
  'KWM-ANM-OVR-02',
  799,
  '/assets/scrolly/anime_shirt.jpg',
  '/assets/scrolly/tshirt_back_reveal.png',
  '/assets/scrolly/knowmi_wear_it.png',
  150,
  8,
  0
),
(
  5003,
  'KnoWMi Phygital Core Tee (Oversized Edition)',
  'KWM-CORE-OVR-03',
  999,
  '/assets/scrolly/shirt_hero.png',
  '/assets/scrolly/tshirt_back.png',
  '/assets/scrolly/digital_profile.png',
  100,
  5,
  0
)
ON CONFLICT (sku) DO UPDATE SET
  title = EXCLUDED.title,
  price = EXCLUDED.price,
  image_1 = EXCLUDED.image_1,
  image_2 = EXCLUDED.image_2,
  image_3 = EXCLUDED.image_3;

-- 4. Create public.order_line_items table
CREATE TABLE IF NOT EXISTS public.order_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES public.products(id),
  product_title TEXT NOT NULL,
  sku TEXT NOT NULL,
  size TEXT NOT NULL DEFAULT 'L',
  unit_price NUMERIC NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price NUMERIC NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on order_line_items
ALTER TABLE public.order_line_items ENABLE ROW LEVEL SECURITY;

-- Read policy for order_line_items (Allows order summary lookup)
DROP POLICY IF EXISTS "Users can view their order line items" ON public.order_line_items;
CREATE POLICY "Users can view their order line items"
ON public.order_line_items FOR SELECT
USING (true);

-- 5. Backfill line items for existing orders
DO $$
DECLARE
  r RECORD;
  v_prod_id BIGINT;
  v_prod_title TEXT;
  v_sku TEXT;
  v_img TEXT;
BEGIN
  FOR r IN SELECT * FROM public.orders LOOP
    -- Determine product match
    IF LOWER(r.item_name) LIKE '%anime%' THEN
      v_prod_id := 5002;
      v_prod_title := 'Work Hard. Stay Humble. (Anime Edition)';
      v_sku := 'KWM-ANM-OVR-02';
      v_img := '/assets/scrolly/anime_shirt.jpg';
    ELSE
      v_prod_id := 5001;
      v_prod_title := COALESCE(r.item_name, 'KnoWMi Phygital Signature Tee (Regular Edition)');
      v_sku := COALESCE(r.sku, 'KWM-SIG-REG-01');
      v_img := COALESCE(NULLIF(r.model_image_url, '/assets/tees/front.webp'), '/assets/scrolly/tshirt_front.png');
    END IF;

    -- Insert line item if not exists for this order
    IF NOT EXISTS (SELECT 1 FROM public.order_line_items WHERE order_id = r.id) THEN
      INSERT INTO public.order_line_items (
        order_id, product_id, product_title, sku, size, unit_price, quantity, total_price, image_url
      ) VALUES (
        r.id, v_prod_id, v_prod_title, v_sku, COALESCE(r.size, 'L'), r.amount, 1, r.amount, v_img
      );
    END IF;
  END LOOP;
END $$;

-- 6. Updated record_customer_order RPC Function with Product & Line Item Integration
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
  p_model_image_url TEXT DEFAULT NULL,
  p_product_id BIGINT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_profile_id UUID;
  v_customer_id BIGINT;
  v_order_number TEXT;
  v_new_order_id UUID;
  v_target_prod_id BIGINT;
  v_prod_title TEXT;
  v_sku TEXT;
  v_img_url TEXT;
  v_unit_price NUMERIC;
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

  -- 2. Resolve Product Master Details
  v_target_prod_id := p_product_id;
  
  IF v_target_prod_id IS NULL THEN
    IF LOWER(p_item_name) LIKE '%anime%' THEN
      v_target_prod_id := 5002;
    ELSE
      v_target_prod_id := 5001;
    END IF;
  END IF;

  SELECT title, sku, price, image_1 
  INTO v_prod_title, v_sku, v_unit_price, v_img_url 
  FROM public.products 
  WHERE id = v_target_prod_id;

  -- Fallbacks if product query returns null
  v_prod_title := COALESCE(v_prod_title, p_item_name, 'KnoWMi Phygital Signature Tee');
  v_sku := COALESCE(v_sku, 'KWM-SIG-REG-01');
  v_img_url := COALESCE(NULLIF(p_model_image_url, '/assets/tees/front.webp'), v_img_url, '/assets/scrolly/tshirt_front.png');
  v_unit_price := COALESCE(v_unit_price, p_amount);

  -- 3. Generate next unique sequential order number
  v_order_number := public.generate_sequential_order_number();

  -- 4. Insert order header into public.orders
  INSERT INTO public.orders (
    profile_id, customer_id, order_number, item_name, size, amount,
    shipping_address, delivery_city, delivery_state, delivery_pincode,
    customer_phone, payment_id, razorpay_order_id, model_image_url, status
  ) VALUES (
    v_profile_id, v_customer_id, v_order_number, v_prod_title, p_size, p_amount,
    p_shipping_address, p_city, p_state, p_pincode,
    p_customer_phone, p_payment_id, p_razorpay_order_id, v_img_url, 'paid'
  )
  RETURNING id INTO v_new_order_id;

  -- 5. Insert order line item into public.order_line_items
  INSERT INTO public.order_line_items (
    order_id, product_id, product_title, sku, size, unit_price, quantity, total_price, image_url
  ) VALUES (
    v_new_order_id, v_target_prod_id, v_prod_title, v_sku, p_size, v_unit_price, 1, p_amount, v_img_url
  );

  -- 6. Atomically update product inventory (increment committed inventory)
  IF v_target_prod_id IS NOT NULL THEN
    UPDATE public.products
    SET inventory_committed = inventory_committed + 1,
        updated_at = now()
    WHERE id = v_target_prod_id;
  END IF;

  v_result := jsonb_build_object(
    'order_id', v_new_order_id,
    'order_number', v_order_number,
    'customer_id', v_customer_id,
    'product_id', v_target_prod_id,
    'sku', v_sku,
    'status', 'success'
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.record_customer_order TO authenticated, anon, service_role;

-- 7. Add sku column to persona_designs if missing & create Automatic Sync Trigger to public.products
ALTER TABLE public.persona_designs ADD COLUMN IF NOT EXISTS sku TEXT;

DROP FUNCTION IF EXISTS public.trg_sync_persona_design_to_products CASCADE;

CREATE OR REPLACE FUNCTION public.trg_sync_persona_design_to_products()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.products (
    title,
    sku,
    price,
    image_1,
    image_2,
    image_3,
    inventory_on_hand,
    inventory_committed,
    inventory_damaged,
    is_active
  ) VALUES (
    NEW.name,
    COALESCE(NULLIF(NEW.sku, ''), 'KWM-DSG-' || SUBSTRING(NEW.id::text from 1 for 6)),
    COALESCE(NEW.price, 799),
    COALESCE(NULLIF(NEW.front_image_url, ''), NULLIF(NEW.model_image_url, ''), '/assets/scrolly/tshirt_front.png'),
    NEW.back_image_url,
    NEW.model_image_url,
    COALESCE(NEW.total_stock, 100),
    0,
    0,
    COALESCE(NEW.is_available, true)
  )
  ON CONFLICT (sku) DO UPDATE SET
    title = EXCLUDED.title,
    price = EXCLUDED.price,
    image_1 = EXCLUDED.image_1,
    image_2 = EXCLUDED.image_2,
    image_3 = EXCLUDED.image_3,
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_design_to_products ON public.persona_designs;
CREATE TRIGGER trg_sync_design_to_products
AFTER INSERT OR UPDATE ON public.persona_designs
FOR EACH ROW EXECUTE FUNCTION public.trg_sync_persona_design_to_products();
