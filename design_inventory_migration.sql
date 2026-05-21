-- Add color inventory support to persona_designs table
-- Run this in the Supabase SQL Editor

-- 1. Add available_colors column (array of color objects with name, hex, stock)
ALTER TABLE persona_designs
  ADD COLUMN IF NOT EXISTS available_colors JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS total_stock INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;

-- 2. Example: seed a design with colors (replace 'your-design-id' with a real ID)
-- UPDATE persona_designs
-- SET available_colors = '[
--   {"id": "black",   "label": "Black",     "hex": "#111111", "stock": 50},
--   {"id": "white",   "label": "White",     "hex": "#FFFFFF", "stock": 30},
--   {"id": "navy",    "label": "Navy Blue", "hex": "#1e3a5f", "stock": 20},
--   {"id": "olive",   "label": "Olive",     "hex": "#556B2F", "stock": 15},
--   {"id": "charcoal","label": "Charcoal",  "hex": "#36454F", "stock": 25},
--   {"id": "maroon",  "label": "Maroon",    "hex": "#800000", "stock": 10}
-- ]', total_stock = 150
-- WHERE id = 'your-design-id';

-- 3. Verify
SELECT id, name, available_colors, total_stock, is_available FROM persona_designs;
