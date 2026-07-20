import type { Session } from '@supabase/supabase-js'

export type AppRole = 'user' | 'resolver' | 'admin'

export type ResolverApprovalState = 'none' | 'pending' | 'approved' | 'rejected'

export type AuthStatus = 'booting' | 'anonymous' | 'authenticated' | 'error'

export type ResolverApplicationSummary = {
  exists: boolean
  status: ResolverApprovalState
}

export type AppProfile = {
  id: string
  email: string
  name: string | null
  role: AppRole
  resolverApplication?: ResolverApplicationSummary
}

export type AuthMeResponse = AppProfile

export type AuthState = {
  status: AuthStatus
  session: Session | null
  accessToken: string | null
  profile: AppProfile | null
  errorMessage: string | null
}

export type AuthContextValue = AuthState & {
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}
