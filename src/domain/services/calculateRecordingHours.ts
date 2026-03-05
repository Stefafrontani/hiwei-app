export function calculateRecordingHours(cardSizeGB: number, totalStorageInGB: number): number {
  if (totalStorageInGB <= 0) return 0
  const cycles = cardSizeGB / totalStorageInGB
  const minutes = cycles * 5
  return Math.floor(minutes / 60)
}
