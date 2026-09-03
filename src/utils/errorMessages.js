export function toUserMessage(error, fallback = 'No fue posible completar la operación. Inténtalo nuevamente.') {
  if (!error) {
    return ''
  }

  const code = String(error.code ?? '').toLowerCase()
  const message = String(error.message ?? '').toLowerCase()

  if (code === '42p01' || message.includes('relation') && message.includes('does not exist')) {
    return 'La base de datos aún no tiene esta funcionalidad habilitada. Ejecuta las migraciones pendientes.'
  }

  if (code === '42501' || message.includes('row-level security') || message.includes('permission denied')) {
    return 'No tienes permisos para realizar esta acción.'
  }

  if (code === '23505' || message.includes('duplicate key')) {
    return 'Ya existe un registro con ese nombre.'
  }

  if (message.includes('invalid login credentials')) {
    return 'El correo o la contraseña son incorrectos.'
  }

  if (message.includes('email not confirmed')) {
    return 'Confirma tu correo antes de iniciar sesión.'
  }

  if (message.includes('user already registered')) {
    return 'Ya existe una cuenta registrada con ese correo.'
  }

  if (message.includes('password should be at least') || message.includes('password is too short')) {
    return 'La contraseña debe tener al menos 8 caracteres.'
  }

  if (message.includes('unable to validate email')) {
    return 'Ingresa un correo electrónico válido.'
  }

  if (message.includes('jwt expired') || message.includes('refresh token')) {
    return 'Tu sesión expiró. Inicia sesión nuevamente.'
  }

  return fallback
}
