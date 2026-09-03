import { supabase } from '../lib/supabase'
import { cleanText } from '../utils/content'

const getRecoveryRedirectUrl = () => `${window.location.origin}/restablecer`

export function getCurrentSession() {
  return supabase.auth.getSession()
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback)
}

export function fetchProfile(userId) {
  return supabase.from('profiles').select('*').eq('id', userId).single()
}

export function registerUser({ email, fullName, password }) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: cleanText(fullName),
      },
    },
  })
}

export function loginUser({ email, password }) {
  return supabase.auth.signInWithPassword({ email, password })
}

export function logoutUser() {
  return supabase.auth.signOut()
}

export function requestPasswordReset(email) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getRecoveryRedirectUrl(),
  })
}

export function updatePassword(password) {
  return supabase.auth.updateUser({ password })
}
