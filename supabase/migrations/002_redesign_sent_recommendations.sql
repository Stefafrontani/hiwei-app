-- ============================================================
-- Migration: Redesign recommendation_sent
-- Stores quiz answers, recommendation result, and budget breakdown.
-- Contact fields (name, email, phone) are now optional.
-- Run this in Supabase SQL Editor or via: supabase db push
-- ============================================================

-- ── 1. Make contact fields nullable ─────────────────────────────────────────

ALTER TABLE recommendation_sent
  ALTER COLUMN name DROP NOT NULL,
  ALTER COLUMN email DROP NOT NULL;

-- ── 2. Add quiz + recommendation + budget columns ───────────────────────────

ALTER TABLE recommendation_sent
  ADD COLUMN quiz_answers            JSONB   NOT NULL DEFAULT '{}',
  ADD COLUMN recommended_product_id   TEXT    NOT NULL DEFAULT '',
  ADD COLUMN recommended_product_name TEXT    NOT NULL DEFAULT '',
  ADD COLUMN match_score              INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN budget_items             JSONB   NOT NULL DEFAULT '[]',
  ADD COLUMN budget_total             INTEGER NOT NULL DEFAULT 0;

-- ── 3. Remove defaults (only needed for existing rows) ──────────────────────

ALTER TABLE recommendation_sent
  ALTER COLUMN quiz_answers            DROP DEFAULT,
  ALTER COLUMN recommended_product_id   DROP DEFAULT,
  ALTER COLUMN recommended_product_name DROP DEFAULT,
  ALTER COLUMN match_score              DROP DEFAULT,
  ALTER COLUMN budget_items             DROP DEFAULT,
  ALTER COLUMN budget_total             DROP DEFAULT;

-- ── 4. Index for quick lookups by product ───────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_recommendation_sent_product
  ON recommendation_sent(recommended_product_id);
