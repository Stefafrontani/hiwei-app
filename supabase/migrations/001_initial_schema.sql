-- ============================================================
-- Hiwei App — Initial Schema
-- Run this in Supabase SQL Editor or via: supabase db push
-- ============================================================

-- ── Tables ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS dashcam_products (
  id                    TEXT PRIMARY KEY,
  name                  TEXT NOT NULL,
  brand                 TEXT NOT NULL,
  description           TEXT NOT NULL,
  price                 INTEGER NOT NULL,
  price_display         TEXT NOT NULL,
  rating                NUMERIC(3,1) NOT NULL,
  review_count          INTEGER NOT NULL DEFAULT 0,
  specs                 TEXT[] NOT NULL DEFAULT '{}',
  features              TEXT[] NOT NULL DEFAULT '{}',
  tags                  TEXT[] NOT NULL DEFAULT '{}',
  camera_positions      TEXT[] NOT NULL DEFAULT '{}',
  max_quality           TEXT NOT NULL CHECK (max_quality IN ('muy-buena', 'superior')),
  max_recording_time    TEXT NOT NULL CHECK (max_recording_time IN ('1h', '2h', '4h', '8h')),
  supports_parking      BOOLEAN NOT NULL DEFAULT false,
  supports_bluetooth    BOOLEAN NOT NULL DEFAULT false,
  supports_installation BOOLEAN NOT NULL DEFAULT false,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_requests (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  phone      TEXT NOT NULL,
  email      TEXT NOT NULL,
  query      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS benefits_registrations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sent_recommendations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_contact_requests_email        ON contact_requests(email);
CREATE INDEX IF NOT EXISTS idx_benefits_registrations_email  ON benefits_registrations(email);
CREATE INDEX IF NOT EXISTS idx_sent_recommendations_email    ON sent_recommendations(email);

-- ── Row Level Security ────────────────────────────────────────────────────────

ALTER TABLE dashcam_products        ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests        ENABLE ROW LEVEL SECURITY;
ALTER TABLE benefits_registrations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE sent_recommendations    ENABLE ROW LEVEL SECURITY;

-- Public read-only for product catalog
CREATE POLICY "public_read_products"
  ON dashcam_products FOR SELECT USING (true);

-- Submission tables: service_role key (used server-side) bypasses RLS automatically.
-- No anon/public access policies are created, effectively blocking direct browser writes.

-- ── Seed: 5 Hiwei products ────────────────────────────────────────────────────

INSERT INTO dashcam_products (
  id, name, brand, description, price, price_display, rating, review_count,
  specs, features, tags, camera_positions, max_quality, max_recording_time,
  supports_parking, supports_bluetooth, supports_installation
) VALUES
(
  'hiwei-x1-pro',
  'Hiwei X1 Pro',
  'Hiwei',
  'La opción más popular para uso diario. Grabación frontal en alta definición con ángulo amplio de 140°.',
  89990,
  '$89.990 – $99.990 ARS',
  4.6, 214,
  ARRAY['Full HD 1080p', 'Ángulo 140°', 'WDR nocturno', 'App móvil'],
  ARRAY['Resolución Full HD 1080p', 'Ángulo de 140°', 'Sensor de noche WDR', 'G-Sensor integrado', 'App móvil incluida'],
  ARRAY['popular', 'frontal', 'relación precio-calidad'],
  ARRAY['frontal'],
  'muy-buena', '2h',
  false, false, true
),
(
  'hiwei-x2-dual',
  'Hiwei X2 Dual',
  'Hiwei',
  'Cobertura delantera y trasera para máxima protección. Ideal para quienes quieren registrar todo lo que pasa en la ruta.',
  149990,
  '$149.990 – $165.000 ARS',
  4.7, 178,
  ARRAY['Frontal 1080p', 'Trasera 720p', 'Parking mode', 'Bluetooth'],
  ARRAY['Cámara frontal Full HD 1080p', 'Cámara trasera HD 720p', 'Visión nocturna mejorada', 'Pantalla LCD 2.4"', 'Detección de movimiento'],
  ARRAY['doble cámara', 'frontal y trasera', 'protección total'],
  ARRAY['frontal', 'frontal-trasera'],
  'muy-buena', '4h',
  true, true, true
),
(
  'hiwei-x3-ultra',
  'Hiwei X3 Ultra',
  'Hiwei',
  'El modelo más completo de la línea. Triple cámara con calidad superior y modo estacionamiento avanzado.',
  249990,
  '$249.990 – $275.000 ARS',
  4.9, 89,
  ARRAY['4K Ultra HD', 'GPS integrado', 'Parking 24hs', 'Triple cámara'],
  ARRAY['Cámara frontal 4K Ultra HD', 'Cámara trasera Full HD 1080p', 'Cámara interior HD', 'GPS integrado', 'Modo estacionamiento 24hs', 'Control Bluetooth'],
  ARRAY['triple cámara', 'ultra HD', 'premium', 'GPS'],
  ARRAY['frontal', 'frontal-trasera', 'frontal-trasera-interior'],
  'superior', '8h',
  true, true, true
),
(
  'hiwei-s1-basic',
  'Hiwei S1 Basic',
  'Hiwei',
  'Compacta y sencilla. Perfecta para quien busca registrar el viaje sin complicaciones a un precio accesible.',
  49990,
  '$49.990 – $59.990 ARS',
  4.3, 312,
  ARRAY['HD 720p', 'Ángulo 120°', 'Plug & play', 'Bucle automático'],
  ARRAY['Resolución HD 720p', 'Ángulo de 120°', 'Grabación en bucle automática', 'Instalación plug & play'],
  ARRAY['económico', 'básico', 'frontal'],
  ARRAY['frontal'],
  'muy-buena', '1h',
  false, false, true
),
(
  'hiwei-x2-plus',
  'Hiwei X2 Plus',
  'Hiwei',
  'Frontal y trasera con calidad superior y pantalla táctil. El equilibrio perfecto entre precio y prestaciones.',
  189990,
  '$189.990 – $210.000 ARS',
  4.8, 143,
  ARRAY['2K QHD', 'Wi-Fi', 'Parking mode', 'Pantalla táctil 3"'],
  ARRAY['Cámara frontal 2K QHD', 'Cámara trasera Full HD 1080p', 'Pantalla táctil IPS 3"', 'Wi-Fi integrado', 'Modo estacionamiento', 'Control Bluetooth incluido'],
  ARRAY['calidad superior', 'frontal y trasera', 'wifi'],
  ARRAY['frontal', 'frontal-trasera'],
  'superior', '4h',
  true, true, true
)
ON CONFLICT (id) DO NOTHING;
