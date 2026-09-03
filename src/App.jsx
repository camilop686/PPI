import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import LoadingState from './components/LoadingState'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuthSession } from './hooks/useAuthSession'
import AccessPage from './pages/AccessPage'
import AdminPage from './pages/AdminPage'
import CataloguePage from './pages/CataloguePage'
import CommunityPage from './pages/CommunityPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import './App.css'

function AppRoutes({ session, profile }) {
  return (
    <Routes>
      <Route path="/acceso" element={<AccessPage mode="login" session={session} />} />
      <Route path="/registro" element={<AccessPage mode="register" session={session} />} />
      <Route path="/recuperar" element={<AccessPage mode="recovery" session={session} />} />
      <Route path="/restablecer" element={<AccessPage mode="reset" session={session} />} />
      <Route
        path="/inicio"
        element={
          <ProtectedRoute session={session} profile={profile}>
            <HomePage profile={profile} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/metodos"
        element={
          <ProtectedRoute session={session} profile={profile}>
            <CataloguePage
              table="prevention_methods"
              title="Métodos de prevención"
              kind="Método"
              emptyMessage="No hay métodos registrados."
              filterLabel="Nivel de riesgo"
              filterKey="risk_level"
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/amenazas"
        element={
          <ProtectedRoute session={session} profile={profile}>
            <CataloguePage
              table="threats"
              title="Amenazas informáticas"
              kind="Amenaza"
              emptyMessage="No hay amenazas registradas."
              filterLabel="Categoría"
              filterKey="category"
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/comunidad"
        element={
          <ProtectedRoute session={session} profile={profile}>
            <CommunityPage session={session} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <ProtectedRoute session={session} profile={profile}>
            <ProfilePage session={session} profile={profile} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute session={session} profile={profile} adminOnly>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={session ? '/inicio' : '/acceso'} replace />} />
    </Routes>
  )
}

export default function App() {
  const { loading, profile, session } = useAuthSession()

  if (loading) {
    return <LoadingState message="Cargando plataforma segura..." />
  }

  return (
    <BrowserRouter>
      <Layout profile={profile} session={session}>
        <AppRoutes profile={profile} session={session} />
      </Layout>
    </BrowserRouter>
  )
}
