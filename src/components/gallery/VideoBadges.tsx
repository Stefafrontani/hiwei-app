import { CAMERA_POSITION_LABELS, type CameraPosition } from '@/domain/value-objects/CameraPosition'
import { VIDEO_QUALITY_RESOLUTION } from '@/domain/value-objects/VideoResolution'
import type { VideoQuality } from '@/domain/value-objects/VideoQuality'
import { Badge } from '@/components/ui/badge'

interface VideoBadgesProps {
  cameraPosition: CameraPosition
  maxQuality: VideoQuality
}

export function VideoBadges({ cameraPosition, maxQuality }: VideoBadgesProps) {
  return (
    <div className="absolute top-4 left-4 z-20 flex gap-1.5">
      <Badge variant="secondary" className="uppercase tracking-wider">
        {CAMERA_POSITION_LABELS[cameraPosition]}
      </Badge>
      <Badge variant="secondary" className="uppercase tracking-wider">
        {VIDEO_QUALITY_RESOLUTION[maxQuality]}
      </Badge>
    </div>
  )
}
