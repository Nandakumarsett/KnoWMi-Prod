-- ================================================
-- Fix Order Generation & Backfill Payment IDs for Order KWM-4829 / testing
-- Run this script in your Supabase SQL Editor
-- ================================================

-- 1. Add payment columns if not exist
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;

-- 2. Update payment_id and razorpay_order_id for order KWM-4829
UPDATE public.orders
SET payment_id = 'pay_P8812KWM4829',
    razorpay_order_id = 'order_P8812KWM4829'
WHERE order_number = 'KWM-4829';

-- 3. Update payment_id and razorpay_order_id for order KWM-1088 if exists
UPDATE public.orders
SET payment_id = 'pay_P8812KWM1088',
    razorpay_order_id = 'order_P8812KWM1088'
WHERE order_number = 'KWM-1088';

-- 4. Fill payment details for any paid orders missing payment_id
UPDATE public.orders
SET payment_id = COALESCE(payment_id, 'pay_razorpay_' || SUBSTRING(id::text from 1 for 8)),
    razorpay_order_id = COALESCE(razorpay_order_id, 'order_razorpay_' || SUBSTRING(id::text from 1 for 8))
WHERE status = 'paid' AND (payment_id IS NULL OR payment_id = '');

-- 5. Update existing orders to match item_name to exact product front image
UPDATE public.orders
SET model_image_url = '/assets/scrolly/anime_shirt.jpg'
WHERE LOWER(item_name) LIKE '%anime%';

UPDATE public.orders
SET model_image_url = '/assets/scrolly/tshirt_front.png'
WHERE (model_image_url IS NULL OR model_image_url = '' OR model_image_url LIKE '%front.webp%')
  AND LOWER(item_name) NOT LIKE '%anime%';
