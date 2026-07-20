import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Session } from '@supabase/supabase-js'

import { supabase } from '@/lib/supabase'
import { fetchAuthMe } from '@/services/auth/client'
import type { AppProfile, AuthContextValue, AuthState } from '@/types/auth'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const initialState: AuthState = {
  status: 'booting',
  session: null,
  accessToken: null,
  profile: null,
  errorMessage: null,
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState)

  const setAuthenticatedState = (session: Session, profile: AppProfile) => {
    setState({
      status: 'authenticated',
      session,
      accessToken: session.access_token,
      profile,
      errorMessage: null,
    })
  }

  const setAnonymousState = () => {
    setState({
      status: 'anonymous',
      session: null,
      accessToken: null,
      profile: null,
      errorMessage: null,
    })
  }

  const setErrorState = (session: Session | null, message: string) => {
    setState({
      status: 'error',
      session,
      accessToken: session?.access_token || null,
      profile: null,
      errorMessage: message,
    })
  }

  useEffect(() => {
    let isMounted = true

    const hydrateSession = async (session: Session | null) => {
      if (!isMounted) {
        return
      }

      if (!session) {
        setAnonymousState()
        return
      }

      setState((current) => ({
        ...current,
        status: 'booting',
        session,
        accessToken: session.access_token,
        errorMessage: null,
      }))

      try {
        const profile = await fetchAuthMe(session.access_token)

        if (!isMounted) {
          return
        }

        setAuthenticatedState(session, profile)
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unable to load your application profile.'

        if (!isMounted) {
          return
        }

        setErrorState(session, message)
      }
    }

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) {
        return
      }

      if (error) {
        setErrorState(null, error.message)
        return
      }

      void hydrateSession(data.session)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      void hydrateSession(session)
    })

    return () => {
      isMounted = false
      data.subscription.unsubscribe()
    }
  }, [])

  const value: AuthContextValue = {
    ...state,
    signOut: async () => {
      await supabase.auth.signOut()
    },
    refreshProfile: async () => {
      const session = state.session

      if (!session) {
        setAnonymousState()
        return
      }

      setState((current) => ({
        ...current,
        status: 'booting',
        errorMessage: null,
      }))

      try {
        const profile = await fetchAuthMe(session.access_token)
        setAuthenticatedState(session, profile)
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unable to load your application profile.'

        setErrorState(session, message)
      }
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.')
  }

  return context
}
