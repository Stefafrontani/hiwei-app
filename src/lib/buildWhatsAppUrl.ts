import type { QuizAnswers } from '@/domain/entities/QuizAnswers'

const WA_PHONE = '1141695824'

interface WhatsAppMessageData {
  answers?: QuizAnswers
  currentStep?: number
  productName?: string
}

const VEHICLE_LABELS: Record<string, string> = {
  auto: 'Auto',
  pickup: 'Pickup',
  suv: 'SUV',
  moto: 'Moto',
}

const QUALITY_LABELS: Record<string, string> = {
  buena: 'Buena',
  'muy-buena': 'Muy buena',
  superior: 'Calidad superior',
}

const CAMERA_LABELS: Record<number, string> = {
  1: 'Solo frontal',
  2: 'Frontal + Trasera',
  3: 'Frontal + Trasera + Interior',
}

const USAGE_LABELS: Record<string, string> = {
  commute: 'Viaje ocasional',
  work_tool: 'Herramienta de trabajo',
  recreational: 'Recreativo',
  other: 'Otro',
}

function formatAnswers(answers: QuizAnswers): string {
  const lines: string[] = []

  if (answers.vehicleType) {
    const vehicle = VEHICLE_LABELS[answers.vehicleType] ?? answers.vehicleType
    const year = answers.vehicleYear ? ` - Ano ${answers.vehicleYear}` : ''
    lines.push(`1. Vehiculo: ${vehicle}${year}`)
  }

  if (answers.videoQuality) {
    const quality = QUALITY_LABELS[answers.videoQuality] ?? answers.videoQuality
    const detail = answers.videoQuality === 'superior' ? ' (prioriza calidad)' : answers.videoQuality === 'buena' ? ' (basica, suficiente)' : ''
    lines.push(`2. Calidad de imagen: ${quality}${detail}`)
  }

  if (answers.cameraPositions?.length) {
    const count = answers.cameraPositions.length
    const label = CAMERA_LABELS[count] ?? `${count} camaras`
    const detail = count >= 3 ? ' (busca cobertura completa)' : count === 1 ? ' (solo frente)' : ''
    lines.push(`3. Camaras: ${label}${detail}`)
  }

  if (answers.vehicleUsage) {
    lines.push(`4. Uso del vehiculo: ${USAGE_LABELS[answers.vehicleUsage] ?? answers.vehicleUsage}`)
  }

  if (answers.parkingMode) {
    const quiereKit = answers.parkingMode === 'si'
    lines.push(`5. Modo estacionamiento: ${quiereKit ? 'Si, quiere HWK' : 'No, sin kit'}`)
  }

  if (answers.installation) {
    const profesional = answers.installation === 'si'
    lines.push(`6. Instalacion: ${profesional ? 'Profesional (la hacemos nosotros)' : 'Por su cuenta'}`)
  }

  return lines.join('\n')
}

function hasAnyAnswer(answers?: QuizAnswers): boolean {
  if (!answers) return false
  return !!(answers.vehicleType || answers.videoQuality || answers.cameraPositions?.length || answers.vehicleUsage || answers.parkingMode || answers.installation)
}

function buildMessage({ answers, currentStep, productName }: WhatsAppMessageData): string {
  const parts: string[] = []
  const hasAnswers = hasAnyAnswer(answers)

  if (productName && hasAnswers) {
    // Caso 3: Quiz completo con recomendacion
    parts.push('Hola! Complete el quiz de Hiwei.')
    parts.push(`Me recomendaron la *${productName}*.`)
    parts.push(`\nMis respuestas:\n${formatAnswers(answers!)}`)
    parts.push('\nMi consulta es:')
  } else if (hasAnswers) {
    // Caso 2: Quiz en progreso
    parts.push('Hola! Estoy completando el quiz de dashcams de Hiwei.')
    parts.push(`Voy por el paso ${currentStep ?? '?'} de 6.`)
    parts.push(`\nMis respuestas hasta ahora:\n${formatAnswers(answers!)}`)
    parts.push('\nMi consulta es:')
  } else {
    // Caso 1: No arranco el quiz
    parts.push('Hola! Estoy interesado en dashcams.')
    parts.push('\nMi consulta es:')
  }

  return parts.join('\n')
}

export function buildWhatsAppUrl(data: WhatsAppMessageData): string {
  const message = buildMessage(data)
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(message)}`
}
