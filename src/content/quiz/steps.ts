import type { VehicleType } from '@/domain/value-objects/VehicleType'
import type { VideoQuality } from '@/domain/value-objects/VideoQuality'
import type { CameraPosition } from '@/domain/value-objects/CameraPosition'
import type { VehicleUsage } from '@/domain/value-objects/VehicleUsage'
import type { ParkingMode } from '@/domain/value-objects/ParkingMode'
import type { Installation } from '@/domain/value-objects/Installation'

// ── Step 1: Tipo de vehículo ──────────────────────────────────────────

export const STEP1 = {
  title: '¿Qué tipo de vehículo tenés?',
  subtitle: 'Elegí la opción que mejor describa tu vehículo',
  vehicleTypeLabel: 'TIPO DE VEHÍCULO *',
  vehicleYearLabel: 'AÑO DEL VEHÍCULO *',
  yearPlaceholder: 'Ej: 2020',
  yearError: 'Seleccioná el año del vehículo',
  options: [
    { type: 'auto' as VehicleType, label: 'Auto' },
    { type: 'pickup' as VehicleType, label: 'Pickup' },
    { type: 'suv' as VehicleType, label: 'SUV' },
    { type: 'otro' as VehicleType, label: 'Otro' },
  ],
} as const

// ── Step 2: Calidad de imagen ─────────────────────────────────────────

export const STEP2 = {
  title: '¿Qué calidad de imagen preferís?',
  subtitle: 'Elegí según tus preferencias.',
  infoText: 'A mayor calidad, mayor nitidez en la grabación',
  sectionLabel: 'CALIDAD DE GRABACIÓN *',
  options: [
    { value: 'buena' as VideoQuality, title: 'Buena', description: 'La calidad es suficiente para grabar lo que importa: patentes.' },
    { value: 'muy-buena' as VideoQuality, title: 'Muy buena', description: 'Además de registrar lo importante, también captura otros detalles.' },
    { value: 'superior' as VideoQuality, title: 'Calidad superior', description: 'Mejor lectura de detalles y nitidez, ideal si querés lo mejor.' },
  ],
} as const

// ── Step 3: Posiciones de cámara ──────────────────────────────────────

export const STEP3 = {
  title: '¿Cuántas cámaras necesitás?',
  subtitle: 'Podés elegir grabar distintos ángulos.',
  sectionLabel: 'UBICACIÓN DE CÁMARAS *',
  options: [
    { positions: ['frontal'] as CameraPosition[], title: 'Frontal', description: 'Una cámara apuntando hacia el frente' },
    { positions: ['frontal', 'trasera'] as CameraPosition[], title: 'Frontal + Trasera', description: 'Cubre adelante y atrás del vehículo' },
    { positions: ['frontal', 'trasera', 'interior'] as CameraPosition[], title: 'Frontal + Trasera + Interior', description: 'Cubre adelante, atrás y también el interior del vehículo' },
  ],
} as const

// ── Step 4: Uso del vehículo ──────────────────────────────────────────

export const STEP4 = {
  title: '¿Qué uso le das al vehículo?',
  subtitle: 'Esto nos ayuda a saber cuánto tiempo pasás en el auto.',
  sectionLabel: 'USO PRINCIPAL DEL VEHÍCULO *',
  infoText: 'Todos nuestros modelos tienen grabación en bucle - loop recording -. Cuando la memoria se llena, se borran los últimos videos para darle espacio a los nuevos.',
  options: [
    { value: 'work_tool' as VehicleUsage, label: 'Trabajo', subLabel: 'Taxi, delivery, remis' },
    { value: 'commute' as VehicleUsage, label: 'Ocasional', subLabel: 'Pocas veces por semana' },
    { value: 'recreational' as VehicleUsage, label: 'Recreativo', subLabel: 'Paseos, salidas' },
    { value: 'other' as VehicleUsage, label: 'Otro', subLabel: 'Sin preferencia' },
  ],
} as const

// ── Step 5: Modo estacionamiento ──────────────────────────────────────

export const STEP5 = {
  title: '¿Querés que la DASHCAM funcione con el auto apagado?',
  subtitle: 'Permite que la dashcam continúe grabando mientras el vehículo está apagado, conectándose directamente a la batería del auto. Esto se conoce como "modo estacionamiento.',
  infoText: 'ATENCIÓN: El uso continuo de la batería con el auto apagado puede reducir su vida útil.',
  options: [
    { value: 'si' as ParkingMode, title: 'Sí, quiero el modo estacionamiento', description: 'Se incluirá un kit especial para instalar la DASHCAM a la fusilera del auto.' },
    { value: 'no' as ParkingMode, title: 'No, no lo quiero', description: 'La DASHCAM grabará únicamente al arrancar el auto.' },
  ],
} as const

// ── Step 6: Instalación ───────────────────────────────────────────────

export const STEP6 = {
  title: '¿Te gustaría que instalemos tu dashcam?',
  subtitle: 'La instalación puede agobiar a más de uno, por eso podés optar por dejarnos a nosotros la instalación.',
  options: [
    { value: 'si' as Installation, title: 'Sí, quiero instalación profesional', description: 'Nuestro equipo instala tu dashcam de forma segura y prolija.' },
    { value: 'no' as Installation, title: 'No, prefiero instalarlo por mi cuenta', description: 'Te enviamos con todo lo necesario para instalar.' },
  ],
} as const
