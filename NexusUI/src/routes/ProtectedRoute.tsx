import type { ReactNode } from 'react'

import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '@/context/AuthProvider'
import { AuthBootScreen, AuthErrorScreen } from '@/routes/RouteGate'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { status, errorMessage } = useAuth()
  const location = useLocation()

  if (status === 'booting') {
    return <AuthBootScreen message="Checking your session and loading your Project Nexus profile." />
  }

  if (status === 'error') {
    return <AuthErrorScreen description={errorMessage} />
  }

  if (status === 'anonymous') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}
