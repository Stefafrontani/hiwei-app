import type { ApiResponse } from '@/types'
import type { ListFilesResult } from '@/application/use-cases/storage/ListFiles/ListFiles.dto'
import type { InitiateUploadResult } from '@/application/use-cases/storage/InitiateUpload/InitiateUpload.dto'
import type { UploadPartResult } from '@/application/use-cases/storage/UploadPart/UploadPart.dto'
import type { CompleteUploadResult } from '@/application/use-cases/storage/CompleteUpload/CompleteUpload.dto'

export function presentListFiles(result: ListFilesResult): ApiResponse<{ files: ListFilesResult }> {
  return { data: { files: result } }
}

export function presentInitiateUpload(result: InitiateUploadResult): ApiResponse<InitiateUploadResult> {
  return { data: result }
}

export function presentUploadPart(result: UploadPartResult): ApiResponse<UploadPartResult> {
  return { data: result }
}

export function presentCompleteUpload(result: CompleteUploadResult): ApiResponse<CompleteUploadResult> {
  return { data: result }
}
