import Link from "next/link";
import { Camera, Star, ShieldCheck, Wrench, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-border bg-card px-5 md:px-12">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand">
            <Camera className="h-[18px] w-[18px] text-white" />
          </div>
          <span className="text-[18px] font-bold text-foreground">Hiwei</span>
        </div>
        <Link href="/beneficios">
          <Button variant="ghost" className="text-[14px] text-muted-foreground">
            Beneficios
          </Button>
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-2xl px-5 py-16 text-center md:py-24">
        <Badge className="mb-4 bg-brand/10 text-brand hover:bg-brand/10">
          Asesor Inteligente de Dashcams
        </Badge>
        <h1 className="mb-4 text-[32px] font-bold leading-tight text-foreground md:text-[48px]">
          Encontrá la dashcam <span className="text-brand">perfecta</span> para tu vehículo
        </h1>
        <p className="mb-8 text-[16px] leading-relaxed text-muted-foreground md:text-[18px]">
          Respondé 6 preguntas y nuestro asesor inteligente te recomienda la dashcam ideal según tu auto, preferencias y presupuesto.
        </p>
        <Link href="/quiz">
          <Button variant="brand" className="flex h-14 items-center gap-2 rounded-xl px-8 text-[16px] font-semibold">
            Empezar el asesoramiento
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
        <p className="mt-3 text-[12px] text-muted-foreground">Gratis · Sin registro · Solo 6 preguntas</p>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-3xl px-5 pb-16">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { icon: Star,        title: "Recomendación personalizada", desc: "Analizamos tus respuestas y te damos la mejor opción para vos.", color: "text-brand",    bg: "bg-brand/10"   },
            { icon: ShieldCheck, title: "Garantía y soporte",          desc: "Todos los productos tienen garantía oficial y soporte post-venta.",   color: "text-success", bg: "bg-success/10" },
            { icon: Wrench,      title: "Instalación profesional",     desc: "Contamos con técnicos certificados para instalar tu dashcam.",        color: "text-warning", bg: "bg-warning/10" },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <p className="text-[14px] font-semibold text-foreground">{title}</p>
              <p className="text-[13px] leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
