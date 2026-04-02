'use client'

import { createContext, useContext } from 'react'
import { useScrollAutoplay } from '@/hooks/useScrollAutoplay'
import { useIsMobile } from '@/hooks/use-mobile'

interface ScrollAutoplayContextValue {
  register: (id: string, videoEl: HTMLVideoElement) => void
  unregister: (id: string) => void
  enabled: boolean
}

const noop = () => {}
const NO_OP_VALUE: ScrollAutoplayContextValue = {
  register: noop,
  unregister: noop,
  enabled: false,
}

const ScrollAutoplayCtx = createContext<ScrollAutoplayContextValue | null>(null)

export function ScrollAutoplayProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  const value = useScrollAutoplay({ enabled: isMobile })

  return <ScrollAutoplayCtx.Provider value={value}>{children}</ScrollAutoplayCtx.Provider>
}

export function useScrollAutoplayContext(): ScrollAutoplayContextValue {
  const ctx = useContext(ScrollAutoplayCtx)
  return ctx ?? NO_OP_VALUE
}
