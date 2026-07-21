import type { ReactNode } from 'react'

import { Navigate } from 'react-router-dom'

import { useAuth } from '@/context/AuthProvider'
import { AuthBootScreen, AuthErrorScreen } from '@/routes/RouteGate'

export default function ResolverRoute({ children }: { children: ReactNode }) {
  const { profile, status, errorMessage } = useAuth()

  if (status === 'booting') {
    return <AuthBootScreen message="Checking your session so we can load the resolver application flow." />
  }

  if (status === 'error') {
    return <AuthErrorScreen description={errorMessage} />
  }

  if (status === 'anonymous') {
    return <>{children}</>
  }

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
