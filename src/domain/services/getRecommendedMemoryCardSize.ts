import type { VehicleUsage } from '@/domain/value-objects/VehicleUsage'

export function getRecommendedMemoryCardSize(usage?: VehicleUsage): number {
  switch (usage) {
    case 'work_tool':
      return 128
    case 'commute':
      return 64
    default:
      return 32
  }
}
