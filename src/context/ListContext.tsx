import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { CURRENT_LIST_STORAGE_KEY } from '../lib/constants'
import type { List } from '../types/database'

interface ListContextValue {
  currentList: List | null
  setCurrentList: (list: List | null) => void
}

const ListContext = createContext<ListContextValue | undefined>(undefined)

export function ListProvider({ children }: { children: ReactNode }) {
  const [currentList, setCurrentListState] = useState<List | null>(() => {
    const raw = localStorage.getItem(CURRENT_LIST_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as List) : null
  })

  const setCurrentList = useCallback((list: List | null) => {
    setCurrentListState(list)
    if (list) {
      localStorage.setItem(CURRENT_LIST_STORAGE_KEY, JSON.stringify(list))
    } else {
      localStorage.removeItem(CURRENT_LIST_STORAGE_KEY)
    }
  }, [])

  return <ListContext.Provider value={{ currentList, setCurrentList }}>{children}</ListContext.Provider>
}

export function useListContext() {
  const ctx = useContext(ListContext)
  if (!ctx) throw new Error('useListContext must be used within a ListProvider')
  return ctx
}
