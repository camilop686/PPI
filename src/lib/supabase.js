// Cliente único de datos y autenticación compartido por toda la aplicación.
import { createClient } from '@supabase/supabase-js'
// Las credenciales se leen desde variables Vite y nunca se escriben en el código.
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
// Permite mostrar un mensaje útil cuando falta configuración local.
export const isConfigured = Boolean(url && key)
// Usa valores de reserva para que la interfaz pueda arrancar sin romperse.
export const supabase = createClient(url || 'https://placeholder.supabase.co', key || 'placeholder-key', { auth: { persistSession: true, autoRefreshToken: true } })
