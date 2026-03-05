# Quiz Stepper - Guia completa

Flujo de 6 pasos en `/quiz` (`src/app/quiz/page.tsx`).
Respuestas se guardan en state como `QuizAnswers` y al finalizar se persisten en `localStorage` key `hiwei-quiz`.

---

## Step 1 — Tipo y ano de vehiculo
**Archivo:** `src/components/steps/Step1.tsx`
**Campo:** `vehicleType` + `vehicleYear`
**Objetivo:** Identificar el vehiculo del usuario para contextualizar la recomendacion.

**Que puede hacer el usuario:**
- Elegir tipo de vehiculo via OptionCard: `auto` | `pickup` | `suv` | `moto`
- Seleccionar ano del vehiculo via Select dropdown (ultimos 30 anos)

**Validacion:**
- Ambos campos son obligatorios (`vehicleType` + `vehicleYear`)
- Si intenta avanzar sin ano, aparece InfoBox rojo "Selecciona el ano del vehiculo"

**Impacto en resultado:** Actualmente no afecta el scoring de la recomendacion. Es dato informativo.

---

## Step 2 — Calidad de imagen
**Archivo:** `src/components/steps/Step2.tsx`
**Campo:** `videoQuality`
**Objetivo:** Determinar la calidad de grabacion deseada para matchear con productos.

**Que puede hacer el usuario:**
- Elegir una opcion via OptionRow (seleccion unica):
  - `buena` — "La calidad es suficiente para grabar lo que importa: patentes."
  - `muy-buena` — "Ademas de registrar lo importante, tambien captura otros detalles."
  - `superior` — "Mejor lectura de detalles y nitidez, ideal si queres lo mejor."

**Validacion:** Debe elegir una opcion para avanzar.

**Info:** Muestra InfoBox naranja: "A mayor calidad, mayor consumo de memoria y mayor precio"

**Impacto en resultado:** Dimension 1 del scoring (50 pts max). Se compara `videoQuality` del usuario contra `maxQuality` del producto. Match perfecto = 50 pts, deficit = -15 pts/nivel, exceso = -5 pts/nivel.

---

## Step 3 — Cantidad y ubicacion de camaras
**Archivo:** `src/components/steps/Step3.tsx`
**Campo:** `cameraPositions`
**Objetivo:** Definir cuantas camaras y en que posiciones necesita el usuario.

**Que puede hacer el usuario:**
- Elegir una opcion via OptionRow (seleccion unica, NO multi-select):
  - `['frontal']` — "Una camara apuntando hacia el frente"
  - `['frontal', 'trasera']` — "Cubre adelante y atras del vehiculo"
  - `['frontal', 'trasera', 'interior']` — "Cubre adelante, atras y tambien el interior"

**Que NO puede hacer:** Elegir combinaciones arbitrarias (ej: solo trasera, o frontal + interior sin trasera). Son presets fijos.

**Validacion:** Debe elegir una opcion.

**Impacto en resultado:** Dimension 2 del scoring (50 pts max). Se compara cantidad de camaras del usuario vs producto. Match perfecto = 50 pts, deficit = -15 pts/camara, exceso = -5 pts/camara.

---

## Step 4 — Uso del vehiculo
**Archivo:** `src/components/steps/Step4.tsx`
**Campo:** `vehicleUsage`
**Objetivo:** Determinar cuanto usa el vehiculo para recomendar la tarjeta de memoria adecuada.

**Que puede hacer el usuario:**
- Elegir una opcion via OptionCard:
  - `work_tool` — "Trabajo" (Taxi, delivery, remis)
  - `commute` — "Viaje ocasional" (Uso diario)
  - `recreational` — "Recreativo" (Uso ocasional)
  - `other` — "Otro" (Sin preferencia)

**Validacion:** Debe elegir una opcion.

**Info:** InfoBox naranja: "A mayor uso del vehiculo, recomendamos una tarjeta de memoria con mas capacidad"

**Impacto en resultado:**
- NO afecta el scoring de dashcams (no es dimension de puntuacion)
- SI determina la tarjeta de memoria recomendada en el presupuesto:
  - `other` / `recreational` → 32 GB
  - `commute` → 64 GB
  - `work_tool` → 128 GB
- Logica en: `src/domain/services/getRecommendedMemoryCardSize.ts`

---

## Step 5 — Modo estacionamiento
**Archivo:** `src/components/steps/Step5.tsx`
**Campo:** `parkingMode`
**Objetivo:** Determinar si el usuario quiere grabacion con el auto apagado (requiere HWK).

**Que puede hacer el usuario:**
- Elegir una opcion via OptionRow:
  - `si` — "Si, quiero que grabe con el auto apagado" (incluye Hardwire Kit)
  - `no` — "No, solo cuando manejo"

**Validacion:** Debe elegir una opcion.

**Info:** InfoBox ambar: explica que el modo estacionamiento requiere un hardwire kit conectado a la fusilera.

**Impacto en resultado:**
- NO afecta el scoring de dashcams
- SI afecta el presupuesto: si `parkingMode === 'si'`, el checkbox de HWK ($70.000) arranca activado en BudgetBreakdown. Si es `'no'`, arranca desactivado (pero visible, se puede togglear).

---

## Step 6 — Instalacion profesional
**Archivo:** `src/components/steps/Step6.tsx`
**Campo:** `installation`
**Objetivo:** Determinar si el usuario quiere instalacion profesional o prefiere hacerlo solo.

**Que puede hacer el usuario:**
- Elegir una opcion via OptionRow (acento verde):
  - `si` — "Si, quiero instalacion profesional"
  - `no` — "No, prefiero instalarlo por mi cuenta"

**Validacion:** Debe elegir una opcion.

**Impacto en resultado:**
- NO afecta el scoring de dashcams
- SI afecta el presupuesto: si `installation === 'si'`, el checkbox de Instalacion ($210.000) arranca activado en BudgetBreakdown. Si es `'no'`, arranca desactivado (pero visible).

**Nota:** Este es el ultimo paso. El subtitle bar cambia a variante verde con "Ultimo paso! Ya casi estamos". Al confirmar, guarda en localStorage y navega a `/resultado`.

---

## Flujo general

```
Step 1 → Step 2 → Step 3 → Step 4 → Step 5 → Step 6 → localStorage → /resultado
```

- Navegacion: `NavigationFooter` con botones Atras/Siguiente
- Boton "Siguiente" habilitado solo si `isStepComplete()` retorna true (`src/domain/entities/QuizAnswers.ts`)
- Ultimo step: boton dice "Ver recomendacion" y navega a `/resultado`
- Estado se pierde si se recarga la pagina (no hay persistencia parcial en localStorage)
- ProgressBar muestra avance visual (X de 6)
- Desktop: sidebar lateral (`DesktopSidebar`) muestra resumen de respuestas
- Steps 1-5: subtitle bar azul / Step 6: subtitle bar verde

## Componentes UI compartidos
- `OptionCard` — tarjeta clickeable con icono (Steps 1, 4)
- `OptionRow` — fila clickeable con icono, titulo y descripcion (Steps 2, 3, 5, 6)
- `InfoBox` — caja informativa con icono (variantes: orange, amber, red)
- `ProgressBar`, `SubtitleBar`, `NavigationFooter`, `AppHeader`, `DesktopSidebar`

## Archivos clave
- Pagina: `src/app/quiz/page.tsx`
- Steps: `src/components/steps/Step[1-6].tsx`
- Shared quiz UI: `src/components/quiz/`
- Entidad + validacion: `src/domain/entities/QuizAnswers.ts`
- Value objects: `src/domain/value-objects/` (VehicleType, VideoQuality, CameraPosition, VehicleUsage, ParkingMode, Installation)
