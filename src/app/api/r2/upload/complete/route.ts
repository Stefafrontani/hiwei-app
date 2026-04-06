import { NextResponse } from 'next/server'
import { CompleteUploadUseCase } from '@/application/use-cases/storage/CompleteUpload/CompleteUpload.usecase'
import { R2StorageRepository } from '@/infrastructure/repositories/r2/R2StorageRepository'
import { presentCompleteUpload, presentError } from '@/infrastructure/presenters/api'

export async function POST(request: Request) {
  try {
    const input = await request.json()
    const useCase = new CompleteUploadUseCase(new R2StorageRepository())
    const result = await useCase.execute(input)
    return NextResponse.json(presentCompleteUpload(result))
  } catch (error) {
    return NextResponse.json(presentError(error, 'Failed to complete upload'), { status: 400 })
  }
}
