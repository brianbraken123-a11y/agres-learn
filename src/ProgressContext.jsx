import { createContext, useContext } from 'react'
import { useProgress } from './hooks/useProgress.js'

const ProgressCtx = createContext(null)

export function ProgressProvider({ children }) {
  const nilai = useProgress()
  return <ProgressCtx.Provider value={nilai}>{children}</ProgressCtx.Provider>
}

export function useProgressCtx() {
  const ctx = useContext(ProgressCtx)
  if (!ctx) throw new Error('useProgressCtx harus dipakai di dalam ProgressProvider')
  return ctx
}
