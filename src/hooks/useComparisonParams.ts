'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

export function useComparisonParams(productIds: string[]) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const isInitialMount = useRef(true)

  const initialA = searchParams.get('a')
  const initialB = searchParams.get('b')

  const [modelAId, setModelAId] = useState<string | null>(
    initialA && productIds.includes(initialA) ? initialA : null
  )
  const [modelBId, setModelBId] = useState<string | null>(() => {
    if (!initialB || !productIds.includes(initialB)) return null
    return initialB === initialA ? null : initialB
  })

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    const params = new URLSearchParams()
    if (modelAId) params.set('a', modelAId)
    if (modelBId) params.set('b', modelBId)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [modelAId, modelBId, pathname, router])

  return { modelAId, setModelAId, modelBId, setModelBId }
}
