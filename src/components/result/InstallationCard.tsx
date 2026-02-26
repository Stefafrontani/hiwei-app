import { Wrench } from 'lucide-react'

export function InstallationCard() {
  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-success bg-success/10 p-3.5 md:p-4">
      {/* Row */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-success/20">
          <Wrench className="h-[18px] w-[18px] text-success" />
        </div>
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="text-[13px] font-bold text-success">Instalación profesional incluida</span>
          <span className="text-[11px] font-medium text-success/70">Sí, quiero que me la instalen</span>
        </div>
        <span className="shrink-0 rounded-md bg-success/20 px-2 py-1 text-[10px] font-semibold text-success">
          Seleccionado
        </span>
      </div>
      {/* Info */}
      <p className="text-[11px] leading-relaxed text-success/70">
        Un técnico certificado instalará tu dashcam de forma limpia y segura. Coordinaremos fecha y lugar.
      </p>
    </div>
  )
}
