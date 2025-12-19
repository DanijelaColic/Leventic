-- Migracija: Dodavanje 'available' kolone u products tablicu
-- Pokrenite ovu skriptu u Supabase SQL Editor

-- Dodaj available kolonu ako ne postoji
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS available BOOLEAN DEFAULT TRUE;

-- Ažuriraj postojeće proizvode da budu dostupni (ako je kolona NULL)
UPDATE products 
SET available = TRUE 
WHERE available IS NULL;

-- Komentar: Sada možete koristiti available polje u admin sučelju

