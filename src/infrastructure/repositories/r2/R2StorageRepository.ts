import {
  ListObjectsV2Command,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
} from '@aws-sdk/client-s3'
import { getR2Client, R2_BUCKET } from '@/infrastructure/r2/client'
import type { IStorageRepository, MultipartUploadInit, UploadedPart } from '@/domain/ports/IStorageRepository'
import type { StorageFile } from '@/domain/entities/StorageFile'

export class R2StorageRepository implements IStorageRepository {
  async listFiles(): Promise<StorageFile[]> {
    const { Contents } = await getR2Client().send(
      new ListObjectsV2Command({ Bucket: R2_BUCKET }),
    )

    return (Contents ?? []).map((obj) => ({
      key: obj.Key!,
      size: obj.Size ?? 0,
      sizeMB: Number(((obj.Size ?? 0) / 1024 / 1024).toFixed(1)),
      lastModified: obj.LastModified,
    }))
  }

  async initiateMultipartUpload(fileName: string, contentType: string): Promise<MultipartUploadInit> {
    const { UploadId } = await getR2Client().send(
      new CreateMultipartUploadCommand({
        Bucket: R2_BUCKET,
        Key: fileName,
        ContentType: contentType,
      }),
    )

    return { uploadId: UploadId!, key: fileName }
  }

  async uploadPart(key: string, uploadId: string, partNumber: number, body: Buffer): Promise<UploadedPart> {
    const { ETag } = await getR2Client().send(
      new UploadPartCommand({
        Bucket: R2_BUCKET,
        Key: key,
        UploadId: uploadId,
        PartNumber: partNumber,
        Body: body,
      }),
    )

    return { etag: ETag!, partNumber }
  }

  async completeMultipartUpload(key: string, uploadId: string, parts: UploadedPart[]): Promise<string> {
    await getR2Client().send(
      new CompleteMultipartUploadCommand({
        Bucket: R2_BUCKET,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: parts.map((p) => ({
            ETag: p.etag,
            PartNumber: p.partNumber,
          })),
        },
      }),
    )

    return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`
  }
}
