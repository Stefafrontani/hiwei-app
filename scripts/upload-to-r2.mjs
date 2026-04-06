/**
 * Upload large files to Cloudflare R2 using multipart upload.
 *
 * This script calls the AWS S3 SDK directly (CreateMultipartUploadCommand, etc.)
 * instead of going through the hexagonal architecture (IStorageRepository / R2StorageRepository).
 * The hexagonal layer exists in the app (src/app/api/r2/) and is ready to be used
 * from a browser-based admin UI when needed.
 *
 * Usage:
 *   node scripts/upload-to-r2.mjs <file-path> [remote-key]
 *
 * Examples:
 *   node scripts/upload-to-r2.mjs ./videos/frontal1-4k.MP4
 *   node scripts/upload-to-r2.mjs ./videos/frontal1-4k.MP4 opt_f7np-frontal-noche-1.mp4
 *
 * If remote-key is omitted, the original file name is used.
 * Reads credentials from .env.local automatically.
 */

import { readFileSync, statSync, createReadStream } from 'fs'
import { basename, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from '@aws-sdk/client-s3'

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

// ── Config ───────────────────────────────────────────────────────────────────
const BUCKET = process.env.CLOUDFLARE_R2_BUCKET_NAME
const ENDPOINT = process.env.CLOUDFLARE_R2_ENDPOINT
const PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL
const PART_SIZE = 50 * 1024 * 1024 // 50 MB per chunk
const MAX_CONCURRENT = 4

const client = new S3Client({
  region: 'auto',
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
})

// ── Args ─────────────────────────────────────────────────────────────────────
const filePath = process.argv[2]
if (!filePath) {
  console.error('Usage: node scripts/upload-to-r2.mjs <file-path> [remote-key]')
  process.exit(1)
}

const fullPath = resolve(filePath)
const key = process.argv[3] ?? basename(fullPath)
const fileSize = statSync(fullPath).size
const totalParts = Math.ceil(fileSize / PART_SIZE)

console.log(`\nArchivo:  ${fullPath}`)
console.log(`Key:      ${key}`)
console.log(`Tamaño:   ${(fileSize / 1024 / 1024).toFixed(1)} MB`)
console.log(`Partes:   ${totalParts} (${PART_SIZE / 1024 / 1024} MB c/u)`)
console.log()

// ── Upload ───────────────────────────────────────────────────────────────────
let uploadId

try {
  // 1. Initiate
  const { UploadId } = await client.send(
    new CreateMultipartUploadCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: 'video/mp4',
    }),
  )
  uploadId = UploadId
  console.log(`Upload iniciado (ID: ${uploadId.slice(0, 12)}...)`)

  // 2. Upload parts with concurrency
  const completedParts = []
  let nextPart = 1

  async function uploadNext() {
    while (nextPart <= totalParts) {
      const partNumber = nextPart++
      const start = (partNumber - 1) * PART_SIZE
      const end = Math.min(start + PART_SIZE, fileSize)

      const stream = createReadStream(fullPath, { start, end: end - 1 })
      const chunks = []
      for await (const chunk of stream) chunks.push(chunk)
      const body = Buffer.concat(chunks)

      const { ETag } = await client.send(
        new UploadPartCommand({
          Bucket: BUCKET,
          Key: key,
          UploadId: uploadId,
          PartNumber: partNumber,
          Body: body,
        }),
      )

      completedParts.push({ ETag, PartNumber: partNumber })
      const pct = Math.round((completedParts.length / totalParts) * 100)
      process.stdout.write(`\r  Progreso: ${completedParts.length}/${totalParts} partes (${pct}%)`)
    }
  }

  const workers = Array.from({ length: MAX_CONCURRENT }, () => uploadNext())
  await Promise.all(workers)
  console.log()

  // 3. Complete
  completedParts.sort((a, b) => a.PartNumber - b.PartNumber)

  await client.send(
    new CompleteMultipartUploadCommand({
      Bucket: BUCKET,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: completedParts },
    }),
  )

  console.log(`\n✓ Upload completo!`)
  console.log(`  URL: ${PUBLIC_URL}/${key}`)
} catch (err) {
  console.error('\n✗ Error:', err.message)

  if (uploadId) {
    console.log('  Abortando multipart upload...')
    await client
      .send(new AbortMultipartUploadCommand({ Bucket: BUCKET, Key: key, UploadId: uploadId }))
      .catch(() => {})
  }

  process.exit(1)
}