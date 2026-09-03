import { BarChart3, BookOpen, Bug, LogOut, MessageSquare, Settings, ShieldCheck } from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../logo.png'
import { logoutUser } from '../services/authService'
import Notice from './Notice'

const navigationItems = [
  ['/inicio', 'Inicio', ShieldCheck],
  ['/metodos', 'Métodos', BookOpen],
  ['/amenazas', 'Amenazas', Bug],
  ['/comunidad', 'Comunidad', MessageSquare],
  ['/perfil', 'Perfil', Settings],
]

export default function Layout({ children, profile, session }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isAccessRoute = ['/acceso', '/registro', '/recuperar', '/restablecer'].includes(location.pathname)

  const handleLogout = async () => {
    const { error } = await logoutUser()

    if (error) {
      window.alert('No fue posible cerrar la sesión. Inténtalo nuevamente.')
      return
    }

    navigate('/acceso', { replace: true })
  }

  if (!session || isAccessRoute) {
    return children
  }

  return (
    <div className="shell">
      <aside>
        <div className="brand">
          <img src={logo} alt="PPI" />
          <span>
            PPI
            <small>Centro de defensa digital</small>
          </span>
        </div>

        <nav aria-label="Navegación principal">
          {navigationItems.map(([to, label, Icon]) => (
            <NavLink key={to} to={to}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          {profile?.role === 'admin' && (
            <NavLink to="/admin">
              <BarChart3 size={18} />
              Administración
            </NavLink>
          )}
        </nav>

        {!profile && (
          <Notice variant="info">No fue posible cargar el perfil. Revisa tu sesión de Supabase.</Notice>
        )}

        <button className="ghost" onClick={handleLogout} type="button">
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </aside>

      <main>{children}</main>
    </div>
  )
}
