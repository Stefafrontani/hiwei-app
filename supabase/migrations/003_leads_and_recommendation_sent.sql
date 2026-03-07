-- ============================================================
-- Migration: Normalise leads + recommendation_sent
-- Lead data lives in `lead` table; recommendation_sent references it.
-- Run this in Supabase SQL Editor or via: supabase db push
-- ============================================================

-- ── 1. Add opt_in_marketing to lead ─────────────────────────────────────────

ALTER TABLE lead
  ADD COLUMN IF NOT EXISTS opt_in_marketing BOOLEAN NOT NULL DEFAULT false;

-- ── 2. Unique constraint on lead.email (needed for upsert) ──────────────────

ALTER TABLE lead
  ADD CONSTRAINT lead_email_unique UNIQUE (email);

-- ── 3. Add lead_id to recommendation_sent ───────────────────────────────────

ALTER TABLE recommendation_sent
  ADD COLUMN lead_id UUID REFERENCES lead(id);

CREATE INDEX IF NOT EXISTS idx_recommendation_sent_lead
  ON recommendation_sent(lead_id);

-- ── 4. Drop contact columns from recommendation_sent ────────────────────────

ALTER TABLE recommendation_sent
  DROP COLUMN IF EXISTS name,
  DROP COLUMN IF EXISTS email,
  DROP COLUMN IF EXISTS phone;
