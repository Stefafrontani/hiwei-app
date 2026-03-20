import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { CameraPosition } from '@/domain/value-objects/CameraPosition'

const ANGLE_LABELS: Record<CameraPosition, string> = {
  frontal: 'Frontal',
  trasera: 'Trasera',
  interior: 'Interior',
}

interface AngleTabsProps {
  angles: CameraPosition[]
  activeAngle: CameraPosition
  onAngleChange: (angle: CameraPosition) => void
  size?: 'default' | 'sm'
}

export function AngleTabs({ angles, activeAngle, onAngleChange, size = 'default' }: AngleTabsProps) {
  const triggerClass = size === 'sm'
    ? 'flex-1 py-1.5 text-[10px] font-medium data-[state=active]:bg-brand data-[state=active]:text-brand-foreground data-[state=active]:font-bold data-[state=active]:shadow-none'
    : 'flex-1 py-2 text-xs font-medium data-[state=active]:bg-brand data-[state=active]:text-brand-foreground data-[state=active]:font-bold data-[state=active]:shadow-none'

  return (
    <Tabs value={activeAngle} onValueChange={(v) => onAngleChange(v as CameraPosition)}>
      <TabsList className="w-full bg-background p-1 rounded-lg gap-1">
        {angles.map((angle) => (
          <TabsTrigger key={angle} value={angle} className={triggerClass}>
            {ANGLE_LABELS[angle]}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
