import type { ReactNode } from 'react'

import { Navigate } from 'react-router-dom'

import { useAuth } from '@/context/AuthProvider'
import { AuthErrorScreen } from '@/routes/RouteGate'

export default function ResolverRoute({ children }: { children: ReactNode }) {
  const { profile } = useAuth()

  if (!profile) {
    return <AuthErrorScreen title="Your profile is missing" description="Sign in again so we can recover your resolver access." />
  }

  if (profile.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  if (profile.role !== 'user' && profile.role !== 'resolver') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
