import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const features = [
  {
    title: "Next.js App Router",
    description:
      "Routing basado en el sistema de archivos con layouts, loading states y error boundaries.",
    badge: "Frontend",
  },
  {
    title: "API Routes",
    description:
      "Endpoints REST directamente en Next.js. Prueba GET /api/health para ver un ejemplo.",
    badge: "Backend",
  },
  {
    title: "shadcn/ui",
    description:
      "Componentes accesibles, personalizables y listos para producción.",
    badge: "UI",
  },
  {
    title: "Tailwind CSS v4",
    description:
      "Estilos utilitarios con soporte completo para modo oscuro y variables CSS.",
    badge: "Estilos",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge className="mb-4" variant="secondary">
            v1.0.0
          </Badge>
          <h1 className="mb-3 text-4xl font-bold tracking-tight">Hiwei App</h1>
          <p className="text-lg text-muted-foreground">
            Plantilla Next.js con shadcn/ui y Tailwind CSS
          </p>
        </div>

        <Separator className="mb-12" />

        {/* Feature cards */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                  <Badge variant="outline">{feature.badge}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <a href="/api/health" target="_blank" rel="noreferrer">
              Probar API /health
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a
              href="https://ui.shadcn.com/docs/components"
              target="_blank"
              rel="noreferrer"
            >
              Ver componentes shadcn
            </a>
          </Button>
        </div>
      </div>
    </main>
  );
}
