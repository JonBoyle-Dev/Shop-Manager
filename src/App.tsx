import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { MemberSelectPage } from './pages/MemberSelectPage'
import { MembersAdminPage } from './pages/MembersAdminPage'
import { ListsPage } from './pages/ListsPage'
import { CombinedShopPage } from './pages/CombinedShopPage'
import { TickListPage } from './pages/TickListPage'
import { ItemDetailPage } from './pages/ItemDetailPage'
import { useMemberContext } from './context/MemberContext'
import { useListContext } from './context/ListContext'

function RequireMember({ children }: { children: ReactNode }) {
  const { currentMember } = useMemberContext()
  if (!currentMember) return <Navigate to="/" replace />
  return <>{children}</>
}

function RequireList({ children }: { children: ReactNode }) {
  const { currentMember } = useMemberContext()
  const { currentList } = useListContext()
  if (!currentMember) return <Navigate to="/" replace />
  if (!currentList) return <Navigate to="/lists" replace />
  return <>{children}</>
}

function HomeRoute() {
  const { currentMember } = useMemberContext()
  const { currentList } = useListContext()
  if (!currentMember) return <MemberSelectPage />
  if (!currentList) return <Navigate to="/lists" replace />
  return <Navigate to="/tick-list" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route
        path="/tick-list"
        element={
          <RequireList>
            <AppShell>
              <TickListPage />
            </AppShell>
          </RequireList>
        }
      />
      <Route
        path="/item/:id"
        element={
          <RequireList>
            <AppShell>
              <ItemDetailPage />
            </AppShell>
          </RequireList>
        }
      />
      <Route
        path="/lists"
        element={
          <RequireMember>
            <AppShell>
              <ListsPage />
            </AppShell>
          </RequireMember>
        }
      />
      <Route
        path="/members"
        element={
          <AppShell>
            <MembersAdminPage />
          </AppShell>
        }
      />
      <Route
        path="/shop-combined"
        element={
          <RequireMember>
            <AppShell>
              <CombinedShopPage />
            </AppShell>
          </RequireMember>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
