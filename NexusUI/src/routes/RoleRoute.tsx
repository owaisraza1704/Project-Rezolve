import type { ReactNode } from 'react'

import { Navigate } from 'react-router-dom'

import { useAuth } from '@/context/AuthProvider'
import type { AppRole } from '@/types/auth'
import { AuthErrorScreen } from '@/routes/RouteGate'

const roleHome: Record<AppRole, string> = {
  user: '/user',
  resolver: '/resolver',
  admin: '/admin',
}

export default function RoleRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: AppRole[]
  children: ReactNode
}) {
  const { profile } = useAuth()

  if (!profile) {
    return <AuthErrorScreen title="Your profile is missing" description="Sign in again so we can recover your workspace access." />
  }

  if (!allowedRoles.includes(profile.role)) {
    return <Navigate to={roleHome[profile.role]} replace />
  }

  return <>{children}</>
}
