import { NextResponse } from 'next/server'
import { InitiateUploadUseCase } from '@/application/use-cases/storage/InitiateUpload/InitiateUpload.usecase'
import { R2StorageRepository } from '@/infrastructure/repositories/r2/R2StorageRepository'
import { presentInitiateUpload, presentError } from '@/infrastructure/presenters/api'

export async function POST(request: Request) {
  try {
    const input = await request.json()
    const useCase = new InitiateUploadUseCase(new R2StorageRepository())
    const result = await useCase.execute(input)
    return NextResponse.json(presentInitiateUpload(result))
  } catch (error) {
    return NextResponse.json(presentError(error, 'Failed to initiate upload'), { status: 400 })
  }
}
