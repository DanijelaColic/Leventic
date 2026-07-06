-- Tablica za praćenje neuspjelih pokušaja checkouta
-- Pokreni u Supabase SQL Editoru

CREATE TABLE IF NOT EXISTS checkout_failures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT,
  customer_email TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  error_code TEXT NOT NULL,
  error_message TEXT NOT NULL,
  error_details JSONB,
  request_payload JSONB,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_checkout_failures_created_at
  ON checkout_failures(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_checkout_failures_email
  ON checkout_failures(customer_email);

ALTER TABLE checkout_failures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on checkout_failures"
  ON checkout_failures
  FOR ALL
  USING (true)
  WITH CHECK (true);
