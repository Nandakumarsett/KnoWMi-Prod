-- =========================================================
-- KnoWMi Email System & Legal Feature Completeness Migration
-- Run this in: Supabase Dashboard → SQL Editor
-- =========================================================

-- ─── 1. Add columns to payment_orders ─────────────────────
ALTER TABLE payment_orders
  ADD COLUMN IF NOT EXISTS receipt_number TEXT,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS customer_email TEXT,
  ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- ─── 2. Add welcome_email_sent flag to profiles ────────────
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS welcome_email_sent BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT TRUE;

-- ─── 3. Return Requests table ──────────────────────────────
CREATE TABLE IF NOT EXISTS return_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id        TEXT NOT NULL,           -- references orders.id (text, since orders uses text PKs)
  order_number    TEXT,
  issue_type      TEXT NOT NULL CHECK (issue_type IN ('defect', 'wrong_item', 'qr_issue', 'size_exchange', 'other')),
  description     TEXT NOT NULL,
  video_url       TEXT,                    -- Google Drive / YouTube link to unboxing video
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'resolved')),
  admin_notes     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: users can only see their own requests
ALTER TABLE return_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own return requests" ON return_requests;
CREATE POLICY "Users see own return requests"
  ON return_requests FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own return requests" ON return_requests;
CREATE POLICY "Users insert own return requests"
  ON return_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ─── 4. Deletion Requests table ───────────────────────────
CREATE TABLE IF NOT EXISTS deletion_requests (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email       TEXT NOT NULL,
  reason      TEXT,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

ALTER TABLE deletion_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own deletion request" ON deletion_requests;
CREATE POLICY "Users see own deletion request"
  ON deletion_requests FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert deletion request" ON deletion_requests;
CREATE POLICY "Users insert deletion request"
  ON deletion_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ─── 5. Email Broadcasts log table ────────────────────────
CREATE TABLE IF NOT EXISTS email_broadcasts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type        TEXT NOT NULL,
  subject     TEXT NOT NULL,
  sent_count  INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  sent_by     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata    JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE email_broadcasts ENABLE ROW LEVEL SECURITY;

-- Only owners can read broadcast logs (handled via profile role check in function)
DROP POLICY IF EXISTS "Broadcasts read by owner" ON email_broadcasts;
CREATE POLICY "Broadcasts read by owner"
  ON email_broadcasts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'owner'
    )
  );

-- ─── 6. Admin RLS bypass for return_requests ──────────────
DROP POLICY IF EXISTS "Owners manage all return requests" ON return_requests;
CREATE POLICY "Owners manage all return requests"
  ON return_requests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'owner'
    )
  );

-- ─── 7. Updated_at trigger for return_requests ────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_return_requests_updated_at ON return_requests;
CREATE TRIGGER set_return_requests_updated_at
  BEFORE UPDATE ON return_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
