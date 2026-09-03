import { supabase } from '../lib/supabase'

export function fetchCatalogue(table) {
  return supabase.from(table).select('*').order('created_at', { ascending: false })
}
