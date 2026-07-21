import { AuthApiError } from '@/services/auth/client'
import type { ResolverApplicationRecord } from '@/services/auth/resolverApplications'
import type { AppProfile } from '@/types/auth'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

export async function fetchAdminUsers(accessToken: string): Promise<AppProfile[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/auth/users`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const message = await readErrorMessage(response)
    throw new AuthApiError(message, response.status)
  }

  return response.json() as Promise<AppProfile[]>
}

export async function fetchAdminResolvers(accessToken: string): Promise<AppProfile[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/auth/resolvers`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const message = await readErrorMessage(response)
    throw new AuthApiError(message, response.status)
  }

  return response.json() as Promise<AppProfile[]>
}

export async function fetchAdminResolverApplications(accessToken: string): Promise<ResolverApplicationRecord[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/auth/resolver-applications`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const message = await readErrorMessage(response)
    throw new AuthApiError(message, response.status)
  }

  return response.json() as Promise<ResolverApplicationRecord[]>
}

export async function approveAdminResolverApplication(accessToken: string, applicationId: number) {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/auth/resolver-applications/${applicationId}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({}),
  })

  if (!response.ok) {
    const message = await readErrorMessage(response)
    throw new AuthApiError(message, response.status)
  }

  return response.json() as Promise<ResolverApplicationRecord>
}

export async function rejectAdminResolverApplication(accessToken: string, applicationId: number) {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/auth/resolver-applications/${applicationId}/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({}),
  })

  if (!response.ok) {
    const message = await readErrorMessage(response)
    throw new AuthApiError(message, response.status)
  }

  return response.json() as Promise<ResolverApplicationRecord>
}

async function readErrorMessage(response: Response) {
  try {
    const data = (await response.json()) as { detail?: string }
    return data.detail || 'Unable to load users.'
  } catch {
    return 'Unable to load users.'
  }
}
