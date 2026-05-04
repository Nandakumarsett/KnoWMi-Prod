-- 1. Create the persona_designs table
CREATE TABLE public.persona_designs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC DEFAULT 999,
  front_image_url TEXT,
  back_image_url TEXT,
  model_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.persona_designs ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies
-- Anyone can view the designs
CREATE POLICY "Public designs are viewable by everyone." 
  ON public.persona_designs FOR SELECT 
  USING (true);

-- Only owners can insert/update/delete designs
CREATE POLICY "Owners can manage designs." 
  ON public.persona_designs FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'owner'
    )
  );

-- 4. Create a storage bucket for product images (Run this via Dashboard UI if this SQL fails)
INSERT INTO storage.buckets (id, name, public) VALUES ('product_images', 'product_images', true);

-- 5. Storage Policies for product_images
CREATE POLICY "Product images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'product_images' );

CREATE POLICY "Owners can upload product images."
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product_images' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'owner'
    )
  );
