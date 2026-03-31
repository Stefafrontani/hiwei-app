import type { VideoQuality } from './VideoQuality'

export type VideoResolution = '4K' | '2K' | 'Full HD'

export const VIDEO_QUALITY_RESOLUTION: Record<VideoQuality, VideoResolution> = {
  'superior': '4K',
  'muy-buena': '2K',
  'buena': 'Full HD',
}
