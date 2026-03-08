-- ============================================================
-- Migration: Add source tracking to leads
-- Tracks where each lead was registered from.
-- Run this in Supabase SQL Editor or via: supabase db push
-- ============================================================

-- ── 1. Create enum type for lead sources ──────────────────────────────────────

CREATE TYPE lead_source AS ENUM ('benefits', 'recommendation', 'consult', 'other');

-- ── 2. Add source column to lead table ────────────────────────────────────────

ALTER TABLE lead
  ADD COLUMN IF NOT EXISTS source lead_source;
