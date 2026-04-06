import { NextResponse } from 'next/server'
import { ListFilesUseCase } from '@/application/use-cases/storage/ListFiles/ListFiles.usecase'
import { R2StorageRepository } from '@/infrastructure/repositories/r2/R2StorageRepository'
import { presentListFiles, presentError } from '@/infrastructure/presenters/api'

export async function GET() {
  try {
    const useCase = new ListFilesUseCase(new R2StorageRepository())
    const result = await useCase.execute()
    return NextResponse.json(presentListFiles(result))
  } catch (error) {
    return NextResponse.json(presentError(error, 'Failed to list files'), { status: 500 })
  }
}
