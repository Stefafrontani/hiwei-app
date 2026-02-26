import Link from "next/link";
import { Camera, Star, ShieldCheck, Wrench, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-[#E4E4E7] bg-white px-5 md:px-12">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#2563EB]">
            <Camera className="h-[18px] w-[18px] text-white" />
          </div>
          <span className="text-[18px] font-bold text-[#18181B]">Hiwei</span>
        </div>
        <Link href="/beneficios">
          <Button variant="ghost" className="text-[14px] text-[#71717A]">
            Beneficios
          </Button>
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-2xl px-5 py-16 text-center md:py-24">
        <Badge className="mb-4 bg-[#EFF6FF] text-[#2563EB] hover:bg-[#EFF6FF]">
          Asesor Inteligente de Dashcams
        </Badge>
        <h1 className="mb-4 text-[32px] font-bold leading-tight text-[#18181B] md:text-[48px]">
          Encontrá la dashcam <span className="text-[#2563EB]">perfecta</span> para tu vehículo
        </h1>
        <p className="mb-8 text-[16px] leading-relaxed text-[#71717A] md:text-[18px]">
          Respondé 6 preguntas y nuestro asesor inteligente te recomienda la dashcam ideal según tu auto, preferencias y presupuesto.
        </p>
        <Link href="/quiz">
          <Button className="flex h-14 items-center gap-2 rounded-xl bg-[#2563EB] px-8 text-[16px] font-semibold hover:bg-[#1D4ED8]">
            Empezar el asesoramiento
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
        <p className="mt-3 text-[12px] text-[#A1A1AA]">Gratis · Sin registro · Solo 6 preguntas</p>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-3xl px-5 pb-16">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { icon: Star, title: "Recomendación personalizada", desc: "Analizamos tus respuestas y te damos la mejor opción para vos.", color: "text-[#2563EB]", bg: "bg-[#EFF6FF]" },
            { icon: ShieldCheck, title: "Garantía y soporte", desc: "Todos los productos tienen garantía oficial y soporte post-venta.", color: "text-[#16A34A]", bg: "bg-[#F0FDF4]" },
            { icon: Wrench, title: "Instalación profesional", desc: "Contamos con técnicos certificados para instalar tu dashcam.", color: "text-[#D97706]", bg: "bg-[#FFFBEB]" },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="flex flex-col gap-3 rounded-2xl border border-[#E4E4E7] bg-white p-5">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <p className="text-[14px] font-semibold text-[#18181B]">{title}</p>
              <p className="text-[13px] leading-relaxed text-[#71717A]">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
