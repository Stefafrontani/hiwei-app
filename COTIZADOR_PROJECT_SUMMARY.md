# Hiwei App — Project Summary

## Qué es

**Hiwei** es un motor de recomendación inteligente de dashcams. Guía al usuario a través de un wizard de 6 pasos para encontrar la dashcam ideal para su vehículo, genera una recomendación personalizada con presupuesto detallado, y permite enviarla por email.

## Objetivo de negocio

- Capturar leads interesados en dashcams
- Recomendar el producto óptimo según necesidades del usuario
- Facilitar la compra con link al ecommerce y presupuesto desglosado
- Construir base de marketing con sistema de opt-in + código de descuento (HIWEI20K)

## Stack técnico

| Tecnología | Versión |
|---|---|
| Next.js (App Router) | 16 |
| React | 19 |
| TypeScript | 5 (strict) |
| Tailwind CSS | v4 (config CSS, oklch) |
| Supabase | DB + client |
| Resend | Envío de emails |
| shadcn/ui | Componentes UI |
| Sonner | Toast notifications |
| Lucide React | Iconografía |

## Arquitectura: Hexagonal (Ports & Adapters)

```
Presentation (App Router / Route Handlers)
        ↓
Application (Use Cases)
        ↓
Domain (Entities, Services, Ports — sin dependencias externas)
        ↑
Infrastructure (Supabase repos, Resend email, Clock adapter)
```

DI manual en los route handlers — sin contenedor de inyección.

## Flujo principal del usuario

```
1. / → redirige a /cotiza-tu-dashcam
2. Quiz 6 pasos:
   - Paso 1: Tipo de vehículo + año
   - Paso 2: Calidad de video (buena/muy-buena/superior)
   - Paso 3: Posiciones de cámara (frontal/+trasera/+interior)
   - Paso 4: Uso del vehículo (trabajo/commute/recreativo/otro)
   - Paso 5: Modo estacionamiento (sí/no → determina hardwire kit)
   - Paso 6: Instalación profesional (sí/no)
   → Respuestas guardadas en localStorage (hiwei-quiz)
3. POST /api/recommendation → scoring + presupuesto → guarda en Supabase
4. /resultado → muestra recomendación principal + presupuesto desglosado
5. "Enviarme la recomendación" → POST /api/send-recommendation
   → Si opt-in marketing: crea lead + email bienvenida con descuento
   → Envía email con recomendación completa (specs, presupuesto, link ecommerce)
```

## API Routes

| Método | Ruta | Use Case |
|---|---|---|
| POST | `/api/recommendation` | GetRecommendationUseCase — scoring + budget |
| POST | `/api/send-recommendation` | SendRecommendationUseCase — emails |
| POST | `/api/contact` | ContactAdvisorUseCase — formulario contacto |
| POST | `/api/lead` | RegisterLeadUseCase — registro desde /beneficios |
| GET | `/api/memory-cards` | Lista de memory cards |
| GET | `/api/health` | Health check |
| GET | `/api/db-health` | DB health check |

## Dominio clave

- **Scoring**: 2 dimensiones (calidad + cantidad de cámaras), 50 pts c/u = 100 total. Penalidades: -15 por déficit, -5 por exceso.
- **Budget**: Precio producto (con descuento), memory card (según uso), HWK ($70k si parking=sí), instalación ($210k si instalación=sí). Descuento efectivo 10%.
- **Emails**: 2 templates HTML — recomendación (specs + budget + expiración 7 días) y bienvenida (código HIWEI20K).

## Estructura de archivos clave

```
src/
  app/                    → Pages + API routes
    cotiza-tu-dashcam/    → Wizard 6 pasos
    resultado/            → Página de resultado
    beneficios/           → Lead capture
  domain/
    entities/             → QuizAnswers, DashcamProduct, Lead, MemoryCard...
    services/             → DashcamRecommendationService, buildDefaultBudget
    ports/                → Interfaces (IDashcamRepository, IEmailService...)
    value-objects/        → VehicleType, VideoQuality, CameraPosition...
  application/use-cases/  → GetRecommendation, SendRecommendation, RegisterLead, ContactAdvisor
  infrastructure/
    email/                → ResendEmailService + templates HTML
    repositories/supabase/→ Repos Supabase (dashcam, lead, contact, recommendation)
    adapters/             → SystemClockAdapter
  components/
    quiz/                 → Header, sidebar, progress, navigation
    steps/                → Step1-Step6
    result/               → Cards de recomendación, budget breakdown
    overlays/             → Contact/Send overlays (Sheet/Dialog)
    ui/                   → shadcn components
  lib/constants.ts        → Precios, código descuento
```

## Constantes importantes

- `DISCOUNT_CODE = 'HIWEI20K'`
- `HWK_PRICE = 70000`
- `INSTALLATION_PRICE = 210000`
- `CASH_DISCOUNT = 0.10` (10%)
- Expiración recomendación: 7 días

## Brevo (CRM / Marketing)

Pipeline automático de sincronización de leads a Brevo:

```
INSERT en tabla "lead" (Supabase)
  → Database Webhook (INSERT)
    → Edge Function "sync-lead-to-brevo"
      → POST https://api.brevo.com/v3/contacts (upsert)
```

- **Edge Function**: `supabase/functions/sync-lead-to-brevo/index.ts`
- **Lista Brevo**: `hiwei_leads`
- **Atributos sincronizados**: `NAME`, `PHONE`, `VEHICLE_TYPE`, `DASHCAM_RECOMMENDED`, `OPT_IN_MARKETING`, `SOURCE`
- La función intenta obtener `DASHCAM_RECOMMENDED` y `VEHICLE_TYPE` de `recommendation_sent` (best-effort, puede llegar vacío si la recomendación no está vinculada al momento del INSERT)
- Usa `updateEnabled: true` (upsert por email — idempotente)
- Siempre responde 200 para evitar retries de Supabase
- **Guía de setup**: `docs/setup-brevo-sync.md`

## Env vars requeridas

- `RESEND_API_KEY` — API key de Resend
- `RESEND_FROM_EMAIL` — Sender (opcional)
- Credenciales Supabase (en el client)
- `BREVO_API_KEY` — API key de Brevo (secret en Supabase Edge Functions)
- `BREVO_LIST_ID` — ID numérico de la lista hiwei_leads (secret en Supabase Edge Functions)

## Design system

- Paleta: charcoal `#24211B`, beige `#DBD6D1`, gold `#E5C761`, white, indigo `#394493`
- Tokens semánticos en oklch (`globals.css`), sin `tailwind.config`
- Variantes custom de Button/Badge: `brand`, `success`, `warning`, `info`
- Mobile-first con sidebars desktop diferenciadas
- shadcn/ui components: button, card, input, label, badge, alert, separator, avatar, dropdown-menu, sonner, dialog, sheet, select
