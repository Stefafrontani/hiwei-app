import type { IDashcamRepository } from '@/domain/ports/IDashcamRepository'
import type { DashcamProduct } from '@/domain/entities/DashcamProduct'

const PRODUCTS: DashcamProduct[] = [
  {
    id: 'radares-full-hd',
    name: 'Radares Full HD',
    description: 'Cuando hablamos del radares Full HD hay que destacar su excelente relación precio calidad: otorga una imagen muy clara y su precio está muy por debajo de otros modelos. Si sos medio colgado al volante, este modelo te puede ayudar alertándote radares de velocidad y semáforo.',
    priceDisplay: '$325.000 ARS',
    priceFinalDisplay: '$292.500 ARS',
    discount: 0.10,
    priceAllCashDisplay: '$263.250 ARS',
    specs: ['Calidad Full HD', 'Grabación Frontal y trasera', 'Detección de radares de velocidad / semáforo', 'Grabación en bucle', 'Permite modo estacionamiento', 'Wifi', 'GPS integrado', 'Aplicación para celular'],
    tags: ['Más vendido', 'Detector de radares', 'Económico', 'Precio-calidad', 'Flota', 'Taxi / Remis', 'Full HD Frontal', 'Full HD Trasera', 'Doble cobertura', 'WiFi', 'Grabación en bucle', 'GPS integrado', 'Bloqueo por impacto', 'G-Sensor'],
    cameraPositions: ['frontal', 'trasera'],
    maxQuality: 'buena',
    cycleSize: 0.8,
    ecommerceUrl: 'https://www.hiwei.com.ar/productos/anti-radares-full-hd-preventa-exclusiva/',
    includedMemoryCardSize: null,
  },
  {
    id: 'f7np',
    name: 'F7NP - Doble cámara 4K + 1080P',
    description: 'La F7NP registra en 4K frontal y 1080P trasero, capturando patentes, señales y detalles con gran nitidez. Su sensor Sony STARVIS 2 y los lentes gran angular (170° frontal y 140° trasero) permiten una visión amplia y equilibrada, ideal para viajes, uso diario, rideshare y nuevos conductores.',
    priceDisplay: '$405.000 ARS',
    priceFinalDisplay: '$405.000 ARS',
    discount: 0.15,
    priceAllCashDisplay: '$309.825 ARS',
    specs: ['Calidad 2k', 'Grabación Frontal y trasera', 'Grabación en bucle', 'Permite modo estacionamiento', 'Wifi', 'GPS integrado', 'Aplicación para celular'],
    tags: ['Recomendado', 'Precio-calidad', '4K Frontal', 'HD Trasera', 'Doble cobertura', 'WiFi', 'Grabación en bucle', 'GPS integrado', 'Bloqueo por impacto', 'G-Sensor'],
    cameraPositions: ['frontal', 'trasera'],
    maxQuality: 'superior',
    cycleSize: 1.1,
    ecommerceUrl: 'https://www.hiwei.com.ar/productos/f7np/',
    includedMemoryCardSize: 128,
  },
  {
    id: 'vs1',
    name: 'VS1 - Frontal y discreta 2K',
    description: 'Mini dashcam del tamaño de una llave de auto, diseñada para pasar totalmente desapercibida detrás del retrovisor. Sin pantallas ni luces que llamen la atención, te acompaña de forma silenciosa mientras cuidás cada viaje.',
    priceDisplay: '$415.000 ARS',
    priceFinalDisplay: '$415.000 ARS',
    discount: 0,
    priceAllCashDisplay: '$373.500 ARS',
    specs: ['Calidad 2k', 'Grabación Frontal', 'Grabación en bucle', 'Permite modo estacionamiento', 'Wifi', 'GPS integrado', 'Aplicación para celular'],
    tags: ['Discreto', 'Premium', '2K Frontal', 'WiFi', 'Grabación en bucle', 'GPS integrado', 'Bloqueo por impacto', 'G-Sensor'],
    cameraPositions: ['frontal'],
    maxQuality: 'superior',
    cycleSize: 0.7,
    ecommerceUrl: 'https://www.hiwei.com.ar/productos/discreto1/',
    includedMemoryCardSize: 32,
  },
  {
    id: 'radares-4k',
    name: 'Radares 4K',
    description: 'Además de su excepcional calidad de video de 4k tanto frontal como trasera, este modelo te avisa radares de velocidad y semáforo, convirtiéndose de esta manera en algo único en el mercado.',
    priceDisplay: '$500.000 ARS',
    priceFinalDisplay: '$450.000 ARS',
    discount: 0.10,
    priceAllCashDisplay: '$405.000 ARS',
    specs: ['Calidad 4k', 'Grabación Frontal y trasera', 'Detección de radares de velocidad / semáforo', 'Grabación en bucle', 'Permite modo estacionamiento', 'Wifi', 'GPS integrado', 'Aplicación para celular'],
    tags: ['Recomendado', 'Precio-calidad', 'Detector de radares', '4K Frontal', '4K Trasera', 'Doble cobertura', 'WiFi', 'Grabación en bucle', 'GPS integrado', 'Bloqueo por impacto', 'G-Sensor'],
    cameraPositions: ['frontal', 'trasera'],
    maxQuality: 'muy-buena',
    cycleSize: 2.3,
    ecommerceUrl: 'https://www.hiwei.com.ar/productos/anti-radares-4k/',
    includedMemoryCardSize: null,
  },
  {
    id: 'f17-elite',
    name: 'F17 Elite - Triple cámara 4K + 2.5K + 1080P',
    description: 'La F17 Elite combina un sensor Sony STARVIS 2 IMX678 frontal (8MP), un IMX675 trasero (4MP) y una cámara interior 1080P para ofrecer grabación real en 4K + 2.5K + 1080P. Captura patentes, señales y detalles desde los tres ángulos, ideal para autos familiares, Uber, Cabify o flotas.',
    priceDisplay: '$650.000 ARS',
    priceFinalDisplay: '$650.000 ARS',
    discount: 0,
    priceAllCashDisplay: '$585.000 ARS',
    specs: ['Calidad 4k', 'Grabación Frontal, trasera e interior', 'Grabación en bucle', 'Permite modo estacionamiento', 'Wifi', 'GPS integrado', 'Control por voz', 'Aplicación para celular'],
    tags: ['Premium', 'Graba Interior', '4K Frontal', '2.5K Trasera', '1080p Interior', 'Triple cobertura', 'Alta nitidez', 'WiFi', 'Grabación en bucle', 'GPS integrado', 'Bloqueo por impacto', 'G-Sensor'],
    cameraPositions: ['frontal', 'trasera', 'interior'],
    maxQuality: 'superior',
    cycleSize: 2.2,
    ecommerceUrl: 'https://www.hiwei.com.ar/productos/triple-cobertura/',
    includedMemoryCardSize: 128,
  }
]

export class InMemoryDashcamRepository implements IDashcamRepository {
  async getAll(): Promise<DashcamProduct[]> {
    return Promise.resolve(PRODUCTS)
  }

  async getById(id: string): Promise<DashcamProduct | undefined> {
    return Promise.resolve(PRODUCTS.find((p) => p.id === id))
  }
}
