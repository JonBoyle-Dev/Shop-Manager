import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { MemberSelectPage } from './pages/MemberSelectPage'
import { MembersAdminPage } from './pages/MembersAdminPage'
import { TickListPage } from './pages/TickListPage'
import { ItemDetailPage } from './pages/ItemDetailPage'
import { useMemberContext } from './context/MemberContext'

function RequireMember({ children }: { children: ReactNode }) {
  const { currentMember } = useMemberContext()
  if (!currentMember) return <Navigate to="/" replace />
  return <>{children}</>
}

function HomeRoute() {
  const { currentMember } = useMemberContext()
  if (currentMember) return <Navigate to="/tick-list" replace />
  return <MemberSelectPage />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route
        path="/tick-list"
        element={
          <RequireMember>
            <AppShell>
              <TickListPage />
            </AppShell>
          </RequireMember>
        }
      />
      <Route
        path="/item/:id"
        element={
          <RequireMember>
            <AppShell>
              <ItemDetailPage />
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
