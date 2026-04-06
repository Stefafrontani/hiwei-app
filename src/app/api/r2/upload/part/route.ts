import { NextResponse } from 'next/server'
import { UploadPartUseCase } from '@/application/use-cases/storage/UploadPart/UploadPart.usecase'
import { R2StorageRepository } from '@/infrastructure/repositories/r2/R2StorageRepository'
import { presentUploadPart, presentError } from '@/infrastructure/presenters/api'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const key = formData.get('key') as string
    const uploadId = formData.get('uploadId') as string
    const partNumber = Number(formData.get('partNumber'))
    const file = formData.get('file') as File

    const body = Buffer.from(await file.arrayBuffer())

    const useCase = new UploadPartUseCase(new R2StorageRepository())
    const result = await useCase.execute({ key, uploadId, partNumber, body })
    return NextResponse.json(presentUploadPart(result))
  } catch (error) {
    return NextResponse.json(presentError(error, 'Failed to upload part'), { status: 400 })
  }
}
