import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import logo from '../../logo.png'
import Notice from '../components/Notice'
import { isConfigured } from '../lib/supabase'
import { loginUser, registerUser, requestPasswordReset, updatePassword } from '../services/authService'
import { cleanText } from '../utils/content'
import { toUserMessage } from '../utils/errorMessages'

const accessContent = {
  login: {
    title: 'Acceso seguro',
    submitLabel: 'Iniciar sesión',
  },
  recovery: {
    title: 'Recuperar contraseña',
    submitLabel: 'Enviar enlace',
  },
  register: {
    title: 'Crear cuenta',
    submitLabel: 'Crear cuenta',
  },
  reset: {
    title: 'Restablecer contraseña',
    submitLabel: 'Guardar nueva contraseña',
  },
}

export default function AccessPage({ mode, session }) {
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [variant, setVariant] = useState('info')
  const content = useMemo(() => accessContent[mode], [mode])

  if (session && mode !== 'reset') {
    return <Navigate to="/inicio" replace />
  }

  const setFeedback = (nextVariant, text) => {
    setVariant(nextVariant)
    setMessage(text)
  }

  const handleSubmit = async event => {
    event.preventDefault()

    if (!isConfigured) {
      setFeedback('error', 'Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para activar el acceso.')
      return
    }

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')
    const fullName = cleanText(formData.get('name'))

    if (mode === 'register' && (fullName.length < 2 || fullName.length > 60)) {
      setFeedback('error', 'Ingresa un nombre válido de 2 a 60 caracteres.')
      return
    }

    if (mode !== 'recovery' && password.length < 8) {
      setFeedback('error', 'La contraseña debe tener al menos 8 caracteres.')
      return
    }

    setBusy(true)

    let response

    if (mode === 'register') {
      response = await registerUser({ email, fullName, password })
    } else if (mode === 'recovery') {
      response = await requestPasswordReset(email)
    } else if (mode === 'reset') {
      response = await updatePassword(password)
    } else {
      response = await loginUser({ email, password })
    }

    setBusy(false)

    if (response.error) {
      setFeedback('error', toUserMessage(response.error))
      return
    }

    if (mode === 'register') {
      setFeedback('success', 'Cuenta creada. Confirma tu correo antes de iniciar sesión.')
      return
    }

    if (mode === 'recovery') {
      setFeedback('success', 'Revisa tu correo para continuar con la recuperación de la contraseña.')
      return
    }

    if (mode === 'reset') {
      setFeedback('success', 'Contraseña actualizada correctamente. Ahora puedes iniciar sesión.')
      navigate('/acceso', { replace: true })
      return
    }

    navigate('/inicio', { replace: true })
  }

  return (
    <div className="auth">
      <section>
        <img className="auth-logo" src={logo} alt="Logotipo PPI" />
        <p className="eyebrow">CENTRO DE DEFENSA DIGITAL</p>
        <h1>Conoce el riesgo. Reduce la superficie de ataque.</h1>
        <p>PPI es una plataforma educativa escolar para aprender prevención de amenazas informáticas con apoyo de Supabase.</p>
      </section>

      <form className="card auth-card" onSubmit={handleSubmit}>
        <h2>{content.title}</h2>
        <p className="auth-copy">Usa mensajes claros, validaciones simples y flujos protegidos para estudiantes y administradores.</p>

        {message && <Notice variant={variant}>{message}</Notice>}

        {mode === 'register' && (
          <label htmlFor="name">
            Nombre completo
            <input id="name" name="name" required minLength="2" maxLength="60" />
          </label>
        )}

        {mode !== 'reset' && (
          <label htmlFor="email">
            Correo electrónico
            <input id="email" name="email" type="email" required autoComplete="email" />
          </label>
        )}

        {mode !== 'recovery' && (
          <label htmlFor="password">
            {mode === 'reset' ? 'Nueva contraseña' : 'Contraseña'}
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength="8"
              autoComplete={mode === 'reset' ? 'new-password' : mode === 'login' ? 'current-password' : 'new-password'}
            />
          </label>
        )}

        {mode === 'reset' && !session && (
          <Notice variant="info">
            Abre el enlace enviado a tu correo para cargar una sesión de recuperación antes de cambiar la contraseña.
          </Notice>
        )}

        <button disabled={busy || (mode === 'reset' && !session)} type="submit">
          {busy ? 'Procesando...' : content.submitLabel}
        </button>

        <div className="auth-links">
          {mode !== 'login' && (
            <button className="link" onClick={() => navigate('/acceso')} type="button">
              Volver al acceso
            </button>
          )}

          {mode !== 'register' && mode !== 'reset' && (
            <button className="link" onClick={() => navigate('/registro')} type="button">
              Crear una cuenta
            </button>
          )}

          {mode !== 'recovery' && mode !== 'reset' && (
            <button className="link" onClick={() => navigate('/recuperar')} type="button">
              ¿Olvidaste tu contraseña?
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
