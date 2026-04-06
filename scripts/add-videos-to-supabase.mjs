/**
 * Adds the `videos` JSONB column to the dashcam table and populates it
 * with R2 video URLs.
 *
 * Usage:  node scripts/add-videos-to-supabase.mjs
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

// ── Load .env.local ──────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '..', '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eqIdx = trimmed.indexOf('=')
  if (eqIdx === -1) continue
  const key = trimmed.slice(0, eqIdx)
  const val = trimmed.slice(eqIdx + 1)
  if (!process.env[key]) process.env[key] = val
}

const R2 = process.env.NEXT_PUBLIC_R2_PUBLIC_URL

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
)

// ── Video mapping per product ────────────────────────────────────────────────
const VIDEOS = {
  'radares-full-hd': [
    { videoUrl: `${R2}/opt_e1-frontal-dia-1.mp4`, label: 'Ruta de día', cameraPosition: 'frontal' },
    { videoUrl: `${R2}/opt_e1-frontal-dia-2.mp4`, label: 'Ruta de día 2', cameraPosition: 'frontal' },
    { videoUrl: `${R2}/opt_e1-trasera-dia-1.mp4`, label: 'Vista trasera urbana', cameraPosition: 'trasera' },
    { videoUrl: `${R2}/opt_e1-trasera-dia-2.mp4`, label: 'Vista trasera urbana 2', cameraPosition: 'trasera' },
  ],
  'vs1': [
    { videoUrl: `${R2}/opt_vs1-dia-1.mp4`, label: 'Manejo urbano 2K', cameraPosition: 'frontal' },
    { videoUrl: `${R2}/opt_vs1-noche-1.MP4`, label: 'Visión nocturna', cameraPosition: 'frontal' },
  ],
  'radares-4k': [
    { videoUrl: `${R2}/opt_s1ultra-frontal-dia-1.mp4`, label: 'Detalle patentes 4K', cameraPosition: 'frontal' },
    { videoUrl: `${R2}/opt_s1ultra-frontal-dia-2.mp4`, label: 'Detalle patentes 4K 2', cameraPosition: 'frontal' },
    { videoUrl: `${R2}/opt_s1ultra-trasera-dia-1.mp4`, label: 'Seguimiento trasero 4K', cameraPosition: 'trasera' },
    { videoUrl: `${R2}/opt_s1ultra-trasera-dia-2.mp4`, label: 'Seguimiento trasero 4K 2', cameraPosition: 'trasera' },
  ],
  // F7NP y F17 Elite: sin videos en R2 todavía — se dejan como array vacío
  'f7np': [],
  'f17-elite': [],
}

// ── 1. Create the column if it doesn't exist ─────────────────────────────────
console.log('1. Creando columna videos (si no existe)...')

const { error: rpcError } = await supabase.rpc('exec_sql', {
  query: `ALTER TABLE dashcam ADD COLUMN IF NOT EXISTS videos jsonb DEFAULT '[]'::jsonb;`,
})

if (rpcError) {
  // If the RPC doesn't exist, try direct SQL via REST
  console.log('   RPC no disponible, probando vía SQL directo...')
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({
      query: `ALTER TABLE dashcam ADD COLUMN IF NOT EXISTS videos jsonb DEFAULT '[]'::jsonb;`,
    }),
  })

  if (!res.ok) {
    console.error('\n⚠ No se pudo crear la columna automáticamente.')
    console.error('  Creala manualmente en Supabase SQL Editor:')
    console.error('')
    console.error('  ALTER TABLE dashcam ADD COLUMN IF NOT EXISTS videos jsonb DEFAULT \'[]\'::jsonb;')
    console.error('')
    console.error('  Luego volvé a correr este script.')
    process.exit(1)
  }
}

console.log('   ✓ Columna lista')

// ── 2. Update each product ───────────────────────────────────────────────────
console.log('\n2. Actualizando videos por producto...')

for (const [id, videos] of Object.entries(VIDEOS)) {
  const { error } = await supabase
    .from('dashcam')
    .update({ videos })
    .eq('id', id)

  if (error) {
    console.error(`   ✗ ${id}: ${error.message}`)
  } else {
    console.log(`   ✓ ${id}: ${videos.length} videos`)
  }
}

// ── 3. Verify ────────────────────────────────────────────────────────────────
console.log('\n3. Verificando...')

const { data, error: fetchError } = await supabase
  .from('dashcam')
  .select('id, name, videos')

if (fetchError) {
  console.error('Error:', fetchError.message)
} else {
  for (const row of data) {
    const count = Array.isArray(row.videos) ? row.videos.length : 0
    console.log(`   ${row.id}: ${count} videos`)
  }
}

console.log('\n✓ Listo!')
