'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, Columns2 } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { type CameraPosition, CAMERA_POSITION_LABELS } from '@/domain/value-objects/CameraPosition'

interface ImmersiveToolbarProps {
  activeAngle: CameraPosition
  availableAngles: CameraPosition[]
  onAngleChange: (angle: CameraPosition) => void
  onClose: () => void
  onDualFullscreen: () => void
}

export function ImmersiveToolbar({
  activeAngle,
  availableAngles,
  onAngleChange,
  onClose,
  onDualFullscreen,
}: ImmersiveToolbarProps) {
  const [visible, setVisible] = useState(true)
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(null)

  const resetHideTimer = useCallback(() => {
    setVisible(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setVisible(false), 3000)
  }, [])

  useEffect(() => {
    hideTimer.current = setTimeout(() => setVisible(false), 3000)
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [])

  return (
    <>
      {/* Tap zone to reveal toolbar */}
      <div
        className="absolute inset-x-0 top-0 z-30 h-16"
        onTouchStart={resetHideTimer}
        onClick={resetHideTimer}
      />

      <div
        className={`absolute inset-x-0 top-0 z-40 flex items-center gap-2 bg-black/70 backdrop-blur-md px-2 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}
        style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}
        onTouchStart={resetHideTimer}
      >
        <div className="flex items-center gap-2 pb-2">
          {/* Back button */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {/* Angle tabs */}
          <Tabs value={activeAngle} onValueChange={(v) => onAngleChange(v as CameraPosition)} className="flex-1 min-w-0">
            <TabsList className="w-full bg-white/[0.08] p-0.5 rounded-lg gap-0.5">
              {availableAngles.map((angle) => (
                <TabsTrigger
                  key={angle}
                  value={angle}
                  className="flex-1 py-1.5 text-[11px] font-medium data-[state=active]:bg-brand data-[state=active]:text-brand-foreground data-[state=active]:font-bold data-[state=active]:shadow-none"
                >
                  {CAMERA_POSITION_LABELS[angle]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Dual fullscreen button */}
          <button
            type="button"
            onClick={onDualFullscreen}
            className="flex md:hidden h-10 w-10 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
          >
            <Columns2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  )
}
