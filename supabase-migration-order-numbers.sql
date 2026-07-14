-- Atomski generator kratkog broja narudžbe: YYMMDD + 3-znamenkasti dnevni broj (9 znamenki)
-- Primjer: 260714042 = 14. srpnja 2026., 42. narudžba tog dana
-- Pokreni u Supabase SQL Editoru

CREATE TABLE IF NOT EXISTS order_daily_counters (
  date_key TEXT PRIMARY KEY,
  counter INT NOT NULL DEFAULT 0
);

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  today_key TEXT;
  next_val INT;
BEGIN
  today_key := to_char(NOW() AT TIME ZONE 'Europe/Zagreb', 'YYMMDD');

  INSERT INTO order_daily_counters (date_key, counter)
  VALUES (today_key, 1)
  ON CONFLICT (date_key) DO UPDATE
    SET counter = order_daily_counters.counter + 1
  RETURNING counter INTO next_val;

  IF next_val > 999 THEN
    RAISE EXCEPTION 'Daily order limit (999) exceeded for %', today_key;
  END IF;

  RETURN today_key || lpad(next_val::text, 3, '0');
END;
$$;
