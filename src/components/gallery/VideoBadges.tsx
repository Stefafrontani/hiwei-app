import { CAMERA_POSITION_LABELS, type CameraPosition } from '@/domain/value-objects/CameraPosition'
import { VIDEO_QUALITY_RESOLUTION } from '@/domain/value-objects/VideoResolution'
import type { VideoQuality } from '@/domain/value-objects/VideoQuality'

interface VideoBadgesProps {
  cameraPosition: CameraPosition
  maxQuality: VideoQuality
}

export function VideoBadges({ cameraPosition, maxQuality }: VideoBadgesProps) {
  return (
    <div className="absolute top-4 left-4 z-20 flex gap-1.5">
      <span className="rounded bg-black/50 p-2 py-0.5 text-xs font-bold uppercase tracking-wider text-foreground backdrop-blur-sm">
        {CAMERA_POSITION_LABELS[cameraPosition]}
      </span>
      <span className="rounded bg-black/50 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-foreground backdrop-blur-sm">
        {VIDEO_QUALITY_RESOLUTION[maxQuality]}
      </span>
    </div>
  )
}
