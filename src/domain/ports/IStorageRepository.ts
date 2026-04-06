import type { StorageFile } from '@/domain/entities/StorageFile'

export interface MultipartUploadInit {
  uploadId: string
  key: string
}

export interface UploadedPart {
  etag: string
  partNumber: number
}

export interface IStorageRepository {
  listFiles(): Promise<StorageFile[]>
  initiateMultipartUpload(fileName: string, contentType: string): Promise<MultipartUploadInit>
  uploadPart(key: string, uploadId: string, partNumber: number, body: Buffer): Promise<UploadedPart>
  completeMultipartUpload(key: string, uploadId: string, parts: UploadedPart[]): Promise<string>
}
