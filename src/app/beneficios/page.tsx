import Link from 'next/link'
import { ShieldCheck, Truck, Wrench, Headphones, Star, Award } from 'lucide-react'
import { AppHeader } from '@/components/quiz/AppHeader'
import { Button } from '@/components/ui/button'

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: 'Garantía oficial',
    description: 'Todos nuestros productos cuentan con garantía oficial de 12 meses. Si algo falla, lo resolvemos sin costo.',
    color: 'text-[#2563EB]',
    bg: 'bg-[#EFF6FF]',
  },
  {
    icon: Truck,
    title: 'Envío a todo el país',
    description: 'Despachamos a cualquier punto del país en 48–72hs hábiles. Seguimiento en tiempo real del pedido.',
    color: 'text-[#16A34A]',
    bg: 'bg-[#F0FDF4]',
  },
  {
    icon: Wrench,
    title: 'Instalación profesional',
    description: 'Contamos con técnicos certificados para instalar tu dashcam de forma segura y prolija en nuestro taller.',
    color: 'text-[#D97706]',
    bg: 'bg-[#FFFBEB]',
  },
  {
    icon: Headphones,
    title: 'Soporte post-venta',
    description: 'Nuestro equipo está disponible para ayudarte después de la compra. Configuración, dudas y más.',
    color: 'text-[#7C3AED]',
    bg: 'bg-[#F5F3FF]',
  },
  {
    icon: Star,
    title: 'Productos seleccionados',
    description: 'Solo vendemos dashcams que probamos y certificamos. Cada modelo pasa por nuestro proceso de calidad.',
    color: 'text-[#DB2777]',
    bg: 'bg-[#FDF2F8]',
  },
  {
    icon: Award,
    title: 'Mejor precio garantizado',
    description: 'Si encontrás el mismo producto más barato, te igualamos el precio. Tu confianza es lo más importante.',
    color: 'text-[#0891B2]',
    bg: 'bg-[#ECFEFF]',
  },
]

export default function BeneficiosPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <AppHeader />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-5 py-8 md:py-12">
          {/* Hero */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#EFF6FF]">
              <Award className="h-7 w-7 text-[#2563EB]" />
            </div>
            <h1 className="text-[24px] font-bold text-[#18181B] md:text-[32px]">
              Beneficios exclusivos
            </h1>
            <p className="mt-2 text-[14px] text-[#71717A] md:text-[16px]">
              Comprá con confianza. En Hiwei, el servicio es parte del producto.
            </p>
          </div>

          {/* Benefits grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {BENEFITS.map(({ icon: Icon, title, description, color, bg }) => (
              <div
                key={title}
                className="flex gap-4 rounded-2xl border border-[#E4E4E7] bg-white p-5"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bg}`}
                >
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[14px] font-semibold text-[#18181B]">{title}</p>
                  <p className="text-[13px] leading-relaxed text-[#71717A]">{description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <Link href="/quiz">
              <Button className="h-12 rounded-xl bg-[#2563EB] px-8 text-[14px] font-semibold hover:bg-[#1D4ED8]">
                Encontrá tu dashcam ideal
              </Button>
            </Link>
            <p className="text-[12px] text-[#A1A1AA]">Gratis · Sin registro · 6 preguntas</p>
          </div>
        </div>
      </main>
    </div>
  )
}
