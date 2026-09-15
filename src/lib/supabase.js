import { createClient } from '@supabase/supabase-js'

const url =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://moatgyzjohslksjkzvyj.supabase.co'

const key =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_AjtpjCBU4-rE-8SILDLNmQ_LzwzYc6G'

export const isConfigured = Boolean(url && key)

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})