import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { CURRENT_MEMBER_STORAGE_KEY } from '../lib/constants'
import type { Member } from '../types/database'

interface MemberContextValue {
  currentMember: Member | null
  setCurrentMember: (member: Member | null) => void
}

const MemberContext = createContext<MemberContextValue | undefined>(undefined)

export function MemberProvider({ children }: { children: ReactNode }) {
  const [currentMember, setCurrentMemberState] = useState<Member | null>(() => {
    const raw = localStorage.getItem(CURRENT_MEMBER_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Member) : null
  })

  const setCurrentMember = useCallback((member: Member | null) => {
    setCurrentMemberState(member)
    if (member) {
      localStorage.setItem(CURRENT_MEMBER_STORAGE_KEY, JSON.stringify(member))
    } else {
      localStorage.removeItem(CURRENT_MEMBER_STORAGE_KEY)
    }
  }, [])

  return (
    <MemberContext.Provider value={{ currentMember, setCurrentMember }}>
      {children}
    </MemberContext.Provider>
  )
}

export function useMemberContext() {
  const ctx = useContext(MemberContext)
  if (!ctx) throw new Error('useMemberContext must be used within a MemberProvider')
  return ctx
}
