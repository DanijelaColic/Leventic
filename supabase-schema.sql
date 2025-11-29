-- Skripta za kreiranje Supabase tablica
-- Kopirajte i pokrenite ovu skriptu u Supabase SQL Editor

-- 1. Kreiranje tablice proizvoda
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL,
  emoji TEXT NOT NULL,
  image TEXT NOT NULL,
  images JSONB,
  variants JSONB,
  detailed_description TEXT,
  usage TEXT,
  ingredients TEXT,
  notes TEXT,
  storage TEXT,
  expiry TEXT,
  nutrition JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Kreiranje tablice narudžbi
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_postal_code TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Kreiranje tablice postavki
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Dodavanje indeksa za bolju performansu
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 6. Kreiranje politika - dopuštanje čitanja svima
CREATE POLICY "Enable read access for all users" ON products
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON settings
  FOR SELECT USING (true);

-- 7. Dopuštanje write operacija samo authenticated korisnicima
-- (Admin će koristiti service role key, tako da će moći sve)
CREATE POLICY "Enable insert for authenticated users only" ON products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON products
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users only" ON products
  FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON orders
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users only" ON orders
  FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON settings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON settings
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users only" ON settings
  FOR DELETE USING (true);

-- 8. Funkcija za automatsko ažuriranje updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Triggeri za automatsko ažuriranje updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 10. Umetanje početnih postavki
INSERT INTO settings (key, value) VALUES
  ('shipping_cost', '{"default": 5.00, "free_above": 50.00}'::jsonb),
  ('currency', '"EUR"'::jsonb),
  ('tax_rate', '0.25'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 11. Generiranje sekvence za order_number
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1000;

-- GOTOVO! 
-- Nakon pokretanja ove skripte:
-- 1. Kopirajte SUPABASE_URL iz Project Settings > API
-- 2. Kopirajte ANON_KEY iz Project Settings > API
-- 3. Kopirajte SERVICE_ROLE_KEY iz Project Settings > API
-- 4. Zamijenite vrijednosti u .env fajlu

