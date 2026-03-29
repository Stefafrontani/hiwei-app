interface DesktopSidebarProps {
  children: React.ReactNode
}

export function DesktopSidebar({ children }: DesktopSidebarProps) {
  return (
    <aside className="hidden w-[340px] shrink-0 flex-col md:flex backdrop-blur-2xl bg-white/[0.03] border-l border-white/[0.06] overflow-y-auto no-scrollbar">
      {children}
    </aside>
  )
}
