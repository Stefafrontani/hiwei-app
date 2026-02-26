import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  Zap,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

// ─── Section wrapper ────────────────────────────────────────────────────────

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <Separator />
      {children}
    </section>
  )
}

// ─── Color swatch ────────────────────────────────────────────────────────────

function Swatch({
  label,
  bgClass,
  textClass = "text-white",
}: {
  label: string
  bgClass: string
  textClass?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className={`${bgClass} ${textClass} rounded-lg h-16 flex items-center justify-center text-xs font-mono font-medium`}
      >
        {label}
      </div>
      <span className="text-xs text-muted-foreground text-center">{label}</span>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DesignSystemPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Design System</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Tokens semánticos, variantes CVA y primitivos shadcn de Hiwei.
        </p>
      </div>

      {/* ── 1. TYPOGRAPHY ── */}
      <Section title="Typography" description="Escala tipográfica basada en Geist Sans.">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">h1 — text-4xl font-bold tracking-tight</p>
            <h1 className="text-4xl font-bold tracking-tight">El asesor de cámaras de tu auto</h1>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">h2 — text-3xl font-semibold tracking-tight</p>
            <h2 className="text-3xl font-semibold tracking-tight">Encuentra la dashcam ideal</h2>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">h3 — text-2xl font-semibold</p>
            <h3 className="text-2xl font-semibold">Recomendación personalizada</h3>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">h4 — text-xl font-semibold</p>
            <h4 className="text-xl font-semibold">Características principales</h4>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">body — text-base</p>
            <p>La cámara dashcam protege tu vehículo registrando cada viaje con alta definición.</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">small — text-sm</p>
            <p className="text-sm">Grabación continua en loop con detección de movimiento.</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">muted — text-sm text-muted-foreground</p>
            <p className="text-sm text-muted-foreground">Disponible en modelos de 1 y 2 canales.</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">code — font-mono text-sm</p>
            <code className="font-mono text-sm bg-muted px-2 py-1 rounded">bg-brand text-brand-foreground</code>
          </div>
        </div>
      </Section>

      {/* ── 2. COLOR TOKENS ── */}
      <Section title="Color Tokens" description="Tokens semánticos expuestos como clases Tailwind.">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Swatch label="brand" bgClass="bg-brand" />
          <Swatch label="success" bgClass="bg-success" />
          <Swatch label="warning" bgClass="bg-warning" textClass="text-warning-foreground" />
          <Swatch label="info" bgClass="bg-info" />
          <Swatch label="destructive" bgClass="bg-destructive" />
          <Swatch label="primary" bgClass="bg-primary" />
          <Swatch label="secondary" bgClass="bg-secondary" textClass="text-secondary-foreground" />
          <Swatch label="muted" bgClass="bg-muted" textClass="text-muted-foreground" />
        </div>
      </Section>

      {/* ── 3. BUTTON ── */}
      <Section title="Button" description="Todas las variantes en todos los tamaños.">
        <div className="space-y-6">
          {/* Variants row */}
          <div>
            <p className="text-xs text-muted-foreground mb-3">Variants (default size)</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="default">Default</Button>
              <Button variant="brand">Brand</Button>
              <Button variant="success">Success</Button>
              <Button variant="warning">Warning</Button>
              <Button variant="info">Info</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>
          {/* Sizes row */}
          <div>
            <p className="text-xs text-muted-foreground mb-3">Sizes (brand variant)</p>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="brand" size="lg">Large</Button>
              <Button variant="brand" size="default">Default</Button>
              <Button variant="brand" size="sm">Small</Button>
              <Button variant="brand" size="xs">XS</Button>
              <Button variant="brand" size="icon"><Zap /></Button>
              <Button variant="brand" size="icon-sm"><Zap /></Button>
              <Button variant="brand" size="icon-lg"><Zap /></Button>
            </div>
          </div>
          {/* Disabled */}
          <div>
            <p className="text-xs text-muted-foreground mb-3">Disabled state</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="brand" disabled>Brand</Button>
              <Button variant="success" disabled>Success</Button>
              <Button variant="outline" disabled>Outline</Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 4. BADGE ── */}
      <Section title="Badge" description="Todas las variantes.">
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="brand">Brand</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="ghost">Ghost</Badge>
          <Badge variant="link">Link</Badge>
        </div>
      </Section>

      {/* ── 5. ALERT ── */}
      <Section title="Alert" description="Todas las variantes con ícono y texto de ejemplo.">
        <div className="space-y-3">
          <Alert variant="default">
            <Info className="size-4" />
            <AlertTitle>Default</AlertTitle>
            <AlertDescription>Información general del sistema sin categoría específica.</AlertDescription>
          </Alert>

          <Alert variant="brand">
            <Zap className="size-4" />
            <AlertTitle>Brand</AlertTitle>
            <AlertDescription>Novedad Hiwei: ya tenés disponible la recomendación personalizada.</AlertDescription>
          </Alert>

          <Alert variant="success">
            <CheckCircle2 className="size-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Tu recomendación fue enviada correctamente al correo.</AlertDescription>
          </Alert>

          <Alert variant="warning">
            <TriangleAlert className="size-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>Tu sesión expirará en 5 minutos. Guardá tus cambios.</AlertDescription>
          </Alert>

          <Alert variant="info">
            <Info className="size-4" />
            <AlertTitle>Info</AlertTitle>
            <AlertDescription>Los precios mostrados son orientativos y pueden variar.</AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Destructive</AlertTitle>
            <AlertDescription>No se pudo enviar el formulario. Verificá tu conexión a internet.</AlertDescription>
          </Alert>
        </div>
      </Section>

      {/* ── 6. INPUT ── */}
      <Section title="Input" description="Estados: default, focused (via CSS), error (aria-invalid).">
        <div className="grid sm:grid-cols-3 gap-6 max-w-2xl">
          <div className="space-y-2">
            <Label htmlFor="input-default">Default</Label>
            <Input id="input-default" placeholder="Tu nombre" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="input-disabled">Disabled</Label>
            <Input id="input-disabled" placeholder="No editable" disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="input-error" className="text-destructive">Error</Label>
            <Input
              id="input-error"
              placeholder="Email inválido"
              aria-invalid="true"
              defaultValue="no-es-un-email"
            />
            <p className="text-xs text-destructive">El email no es válido.</p>
          </div>
        </div>
      </Section>

      {/* ── 7. CARD ── */}
      <Section title="Card" description="Ejemplo de card usando tokens semánticos.">
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Dashcam 4K Plus</CardTitle>
              <CardDescription>Recomendada para uso frecuente en ciudad</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="brand">Recomendado</Badge>
                <Badge variant="success">En stock</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Grabación en 4K, visión nocturna mejorada y GPS integrado.
              </p>
              <Button variant="brand" className="w-full">Ver producto</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dashcam Dual Básica</CardTitle>
              <CardDescription>Ideal para conductores ocasionales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">Alternativa</Badge>
                <Badge variant="warning">Últimas unidades</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Doble lente frontal y trasera, gran angular 170°, instalación simple.
              </p>
              <Button variant="outline" className="w-full">Ver producto</Button>
            </CardContent>
          </Card>
        </div>
      </Section>
    </div>
  )
}
