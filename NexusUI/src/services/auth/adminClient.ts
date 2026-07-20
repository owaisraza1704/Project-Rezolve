import { AuthApiError } from '@/services/auth/client'
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

async function readErrorMessage(response: Response) {
  try {
    const data = (await response.json()) as { detail?: string }
    return data.detail || 'Unable to load users.'
  } catch {
    return 'Unable to load users.'
  }
}
