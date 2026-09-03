import { supabase } from '../lib/supabase'

export function updateProfileName(userId, fullName) {
  return supabase.from('profiles').update({ full_name: fullName }).eq('id', userId)
}
