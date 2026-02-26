# Design System Tokens

## Regla de oro
**Nunca uses colores hex (`#2563EB`) en componentes dentro de `src/components/ui/`.
Siempre usa tokens semánticos** (`bg-brand`, `text-success`, `border-warning`, etc.)

---

## Tokens semánticos

| Token | Light mode | Dark mode | Uso recomendado |
|---|---|---|---|
| `--brand` / `--brand-foreground` | `oklch(0.546 0.244 262.881)` (blue) | `oklch(0.698 0.195 262.881)` | Identidad Hiwei, CTA principal |
| `--success` / `--success-foreground` | `oklch(0.527 0.154 149.214)` (green) | `oklch(0.696 0.17 149.214)` | Confirmaciones, estados OK |
| `--warning` / `--warning-foreground` | `oklch(0.769 0.188 70.08)` (amber) | `oklch(0.828 0.189 84.429)` | Alertas no críticas, atención |
| `--info` / `--info-foreground` | `oklch(0.614 0.115 213.283)` (cyan-blue) | `oklch(0.75 0.12 213.283)` | Información contextual |
| `--destructive` | `oklch(0.577 0.245 27.325)` (red) | `oklch(0.704 0.191 22.216)` | Errores, acciones destructivas |
| `--primary` / `--primary-foreground` | near-black / near-white | near-white / near-black | Elemento principal UI |
| `--secondary` / `--secondary-foreground` | light gray / dark | dark gray / light | Elemento secundario UI |
| `--muted` / `--muted-foreground` | light gray / medium gray | dark gray / medium gray | Texto y fondos desactivados |

### Clases Tailwind expuestas

```
bg-brand          text-brand          border-brand          ring-brand
bg-brand-foreground  text-brand-foreground
bg-success        text-success        border-success        ring-success
bg-success-foreground  text-success-foreground
bg-warning        text-warning        border-warning        ring-warning
bg-warning-foreground  text-warning-foreground
bg-info           text-info           border-info           ring-info
bg-info-foreground    text-info-foreground
```

Con opacidad: `bg-brand/10`, `bg-success/20`, `border-warning/30`, etc.

---

## Tipografía

| Rol | Clases Tailwind |
|---|---|
| `h1` | `text-4xl font-bold tracking-tight` |
| `h2` | `text-3xl font-semibold tracking-tight` |
| `h3` | `text-2xl font-semibold` |
| `h4` | `text-xl font-semibold` |
| `body` | `text-base` (heredado) |
| `small` | `text-sm` |
| `muted` | `text-sm text-muted-foreground` |
| `code` | `font-mono text-sm` |

---

## Spacing y contenedores

| Uso | Valor |
|---|---|
| Padding de página (mobile) | `px-4` |
| Padding de página (desktop) | `px-8` |
| Max width contenedor estrecho | `max-w-2xl` |
| Max width contenedor normal | `max-w-4xl` |
| Max width contenedor ancho | `max-w-6xl` |
| Gap entre secciones | `gap-8` o `space-y-8` |
| Gap entre elementos relacionados | `gap-4` o `space-y-4` |

---

## Componentes disponibles (shadcn)

`button`, `badge`, `alert`, `card`, `input`, `label`, `separator`, `avatar`,
`dropdown-menu`, `dialog`, `sheet`, `select`, `sonner`

### Variantes de Button

| Variante | Uso |
|---|---|
| `default` | Acción primaria genérica |
| `brand` | CTA Hiwei (reemplaza hex `#2563EB`) |
| `success` | Confirmar / guardar |
| `warning` | Acción con precaución |
| `info` | Acción informativa |
| `destructive` | Eliminar / acción irreversible |
| `outline` | Acción secundaria |
| `secondary` | Acción terciaria |
| `ghost` | Botón sin fondo visible |
| `link` | Estilo enlace |

### Variantes de Badge

`default`, `brand`, `success`, `warning`, `info`, `destructive`,
`secondary`, `outline`, `ghost`, `link`

### Variantes de Alert

`default`, `brand`, `success`, `warning`, `info`, `destructive`
