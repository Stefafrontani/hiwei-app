# Hiwei App

Dashcam recommendation wizard built with Next.js 16, Tailwind CSS v4, shadcn/ui, and Supabase.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Architecture**: Hexagonal (Ports & Adapters)

## Getting Started

### 1. Clone and install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `SUPABASE_URL` | ✅ | Project URL — Supabase Dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Service role key (server-side only, bypasses RLS) |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Same URL, exposed to browser (for future client-side use) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Public anon key (for future client-side use) |

> ⚠️ Never commit `.env.local`. `SUPABASE_SERVICE_ROLE_KEY` must stay server-side only.

### 3. Run Supabase migrations

The schema and seed data are in `supabase/migrations/001_initial_schema.sql`.

**Option A — Supabase SQL Editor (no CLI needed):**
1. Open your Supabase project → SQL Editor
2. Copy and paste the full contents of `supabase/migrations/001_initial_schema.sql`
3. Click **Run**

**Option B — Supabase CLI:**
```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

### 4. Start the development server

```bash
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

### 5. Verify database connectivity

```bash
curl http://localhost:3000/api/db-health
```

Expected response:
```json
{
  "data": { "status": "ok", "productCount": 5 },
  "message": "Database connection successful"
}
```

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build + TypeScript check
npm run lint     # ESLint
```

## Project Structure

```
src/
  app/
    api/                     # Route Handlers (DI wiring point)
      db-health/             # GET  — Supabase connectivity smoke test
      recommendation/        # POST — Recommendation engine
      contact/               # POST — Advisor contact form
      beneficios/            # POST — Benefits registration
      send-recommendation/   # POST — Send recommendation by email
  domain/dashcam/            # Entities, services, output port interfaces
  application/dashcam/       # Use cases
  infrastructure/dashcam/    # Supabase adapters + InMemory fallback
  lib/supabase/              # Client factories (server + browser)
supabase/
  migrations/                # SQL migration files
```

## Database Tables

| Table | Purpose |
|---|---|
| `dashcam_products` | Product catalog (read-only from app, seeded via migration) |
| `contact_requests` | Advisor contact form submissions |
| `benefits_registrations` | Benefits sign-up form submissions |
| `sent_recommendations` | Send-recommendation form submissions |

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Application health check |
| `GET` | `/api/db-health` | Database connectivity smoke test |
| `POST` | `/api/recommendation` | Get recommendation from quiz answers |
| `POST` | `/api/contact` | Submit advisor contact request |
| `POST` | `/api/beneficios` | Register for exclusive benefits |
| `POST` | `/api/send-recommendation` | Send recommendation via email |

All endpoints return `ApiResponse<T>`:
```ts
{ data?: T; error?: string; message?: string }
```
