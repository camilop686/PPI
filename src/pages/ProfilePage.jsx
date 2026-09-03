import { useState } from 'react'
import Notice from '../components/Notice'
import Page from '../components/Page'
import { updateProfileName } from '../services/profileService'
import { cleanText } from '../utils/content'
import { toUserMessage } from '../utils/errorMessages'

export default function ProfilePage({ session, profile }) {
  const initialName = profile?.full_name || ''
  const [dirty, setDirty] = useState(false)
  const [message, setMessage] = useState('')
  const [name, setName] = useState(initialName)
  const [variant, setVariant] = useState('info')

  const handleSave = async event => {
    event.preventDefault()

    const nextName = cleanText(name)

    if (nextName.length < 2 || nextName.length > 60) {
      setVariant('error')
      setMessage('Ingresa un nombre válido de 2 a 60 caracteres.')
      return
    }

    const { error } = await updateProfileName(session.user.id, nextName)

    if (error) {
      setVariant('error')
      setMessage(toUserMessage(error))
      return
    }

    setVariant('success')
    setMessage('Perfil actualizado correctamente.')
    setName(nextName)
    setDirty(false)
  }

  return (
    <Page title="Mi perfil">
      <form className="card form profile-card" onSubmit={handleSave}>
        <label htmlFor="profile-name">
          Nombre
          <input
            id="profile-name"
            value={dirty ? name : initialName}
            onChange={event => {
              setDirty(true)
              setName(event.target.value)
            }}
            required
            maxLength="60"
          />
        </label>

        <label htmlFor="profile-email">
          Correo
          <input id="profile-email" value={session.user.email || ''} disabled />
        </label>

        <div className="profile-meta">
          <p><strong>Rol:</strong> {profile?.role || 'user'}</p>
          <p><strong>ID:</strong> protegido por Supabase</p>
          <p><strong>Creado:</strong> solo lectura</p>
        </div>

        <p className="field-note">Solo puedes actualizar tu nombre. El rol, el id y los campos sensibles están protegidos en frontend y por RLS.</p>

        <button type="submit">Guardar cambios</button>

        {message && <Notice variant={variant}>{message}</Notice>}
      </form>
    </Page>
  )
}
