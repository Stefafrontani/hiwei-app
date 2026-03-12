-- Add product specs and ecommerce URL to recommendation_sent
ALTER TABLE recommendation_sent ADD COLUMN specs JSONB DEFAULT '[]'::jsonb;
ALTER TABLE recommendation_sent ADD COLUMN ecommerce_url TEXT DEFAULT '';
