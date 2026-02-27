# Design System Tokens

## Regla de oro
**Nunca uses colores hex (`#394493`) en componentes dentro de `src/components/ui/`.
Siempre usa tokens semánticos** (`bg-primary`, `text-brand`, `border-warning`, etc.)

---

## Brand Palette → Token Mapping

| Brand Color       | Hex       | Token(s)                                                  | Role                                    |
|-------------------|-----------|-----------------------------------------------------------|-----------------------------------------|
| Deep indigo       | `#394493` | `--primary`, `--brand`, `--ring`                          | CTAs, links, focus rings, brand identity |
| Dark warm charcoal| `#24211B` | `--foreground`, dark-mode `--background`                  | Body text (light), surfaces (dark)       |
| Warm beige        | `#DBD6D1` | `--secondary`, `--border`, `--input`                      | Secondary elements, borders, input frames|
| White             | `#FFFFFF` | `--background`, `--primary-foreground`, `--brand-foreground`| Surfaces (light), text on indigo        |
| Golden yellow     | `#E5C761` | `--warning`, `--chart-2`                                  | Warnings, highlights, chart accent       |

**Design philosophy:** Indigo drives CTAs and brand moments. Beige warms borders and secondary surfaces. Gold appears sparingly in warnings/charts. Charcoal replaces cold black for a warmer feel. White backgrounds stay clean.

---

## Tokens semánticos

| Token | Light mode | Dark mode | Uso recomendado |
|---|---|---|---|
| `--primary` / `--primary-foreground` | deep indigo / white | lighter indigo / white | CTAs, botones principales, enlaces |
| `--brand` / `--brand-foreground` | deep indigo / white | medium indigo / white | Identidad Hiwei, CTA alternativo |
| `--secondary` / `--secondary-foreground` | warm beige / charcoal | dark warm / near-white | Elemento secundario UI, bordes |
| `--accent` / `--accent-foreground` | warm tint / charcoal | dark warm / near-white | Hover states (ghost, outline) |
| `--muted` / `--muted-foreground` | light warm gray / medium gray | dark warm / medium gray | Texto y fondos desactivados |
| `--success` / `--success-foreground` | green / white | brighter green / charcoal | Confirmaciones, estados OK |
| `--warning` / `--warning-foreground` | golden yellow / charcoal | muted gold / charcoal | Alertas no críticas, atención |
| `--info` / `--info-foreground` | cyan-blue / white | brighter cyan / charcoal | Información contextual |
| `--destructive` | red | brighter red | Errores, acciones destructivas |

### Accessibility notes

All primary pairings pass WCAG AA:
- Indigo on white: **~10:1** contrast ratio
- Beige with charcoal: **~11:1**
- Gold with charcoal: **~9.4:1**
- Muted-foreground on white: **~5.5:1**
- `--ring` uses indigo — visible focus states in both modes

### Clases Tailwind expuestas

```
bg-primary        text-primary        border-primary        ring-primary
bg-primary-foreground  text-primary-foreground
bg-brand          text-brand          border-brand          ring-brand
bg-brand-foreground  text-brand-foreground
bg-secondary      text-secondary      border-secondary
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
| `default` | Acción primaria (indigo) |
| `brand` | CTA Hiwei (idéntico a primary, para énfasis semántico) |
| `success` | Confirmar / guardar |
| `warning` | Acción con precaución |
| `info` | Acción informativa |
| `destructive` | Eliminar / acción irreversible |
| `outline` | Acción secundaria |
| `secondary` | Acción terciaria (beige) |
| `ghost` | Botón sin fondo visible |
| `link` | Estilo enlace |

### Variantes de Badge

`default`, `brand`, `success`, `warning`, `info`, `destructive`,
`secondary`, `outline`, `ghost`, `link`

### Variantes de Alert

`default`, `brand`, `success`, `warning`, `info`, `destructive`
