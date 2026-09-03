import { useEffect, useState } from 'react'
import { isConfigured } from '../lib/supabase'
import { fetchProfile, getCurrentSession, onAuthStateChange } from '../services/authService'

export function useAuthSession() {
  const [session, setSession] = useState(() => (isConfigured ? undefined : null))
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    let active = true

    if (!isConfigured) {
      return undefined
    }

    getCurrentSession()
      .then(({ data, error }) => {
        if (!active || error || !data.session) {
          setProfile(null)
          setSession(null)
          return
        }

        setProfile(undefined)
        setSession(data.session)
      })
      .catch(() => {
        if (active) {
          setProfile(null)
          setSession(null)
        }
      })

    const {
      data: { subscription },
    } = onAuthStateChange((_event, nextSession) => {
      if (active) {
        setProfile(nextSession ? undefined : null)
        setSession(nextSession)
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!session?.user?.id) {
      return undefined
    }

    let active = true

    fetchProfile(session.user.id)
      .then(({ data }) => {
        if (active) {
          setProfile(data ?? null)
        }
      })
      .catch(() => {
        if (active) {
          setProfile(null)
        }
      })

    return () => {
      active = false
    }
  }, [session])

  return {
    loading: session === undefined || (Boolean(session) && profile === undefined),
    profile,
    session,
  }
}
