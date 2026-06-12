ALTER TABLE persona_designs 
ADD COLUMN IF NOT EXISTS image4_url text,
ADD COLUMN IF NOT EXISTS image5_url text,
ADD COLUMN IF NOT EXISTS image6_url text;
