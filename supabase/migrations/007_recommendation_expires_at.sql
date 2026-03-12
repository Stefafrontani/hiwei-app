-- Add expiration date to recommendations (1 week from creation)
ALTER TABLE recommendation_sent
  ADD COLUMN expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '7 days');

-- Backfill existing rows
UPDATE recommendation_sent
  SET expires_at = created_at + INTERVAL '7 days'
  WHERE expires_at IS NULL;

-- Make NOT NULL after backfill
ALTER TABLE recommendation_sent
  ALTER COLUMN expires_at SET NOT NULL;
