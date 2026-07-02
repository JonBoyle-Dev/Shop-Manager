import type { ReactNode } from 'react'
import { NavBar } from './NavBar'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh bg-slate-50">
      <NavBar />
      <main>{children}</main>
    </div>
  )
}
