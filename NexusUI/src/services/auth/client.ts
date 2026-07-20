import type { AuthMeResponse } from '@/types/auth'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

export class AuthApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'AuthApiError'
    this.status = status
  }
}

export async function fetchAuthMe(accessToken: string): Promise<AuthMeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const message = await readErrorMessage(response)
    throw new AuthApiError(message, response.status)
  }

  return response.json() as Promise<AuthMeResponse>
}

async function readErrorMessage(response: Response) {
  try {
    const data = (await response.json()) as { detail?: string }
    return data.detail || 'Unable to load application profile.'
  } catch {
    return 'Unable to load application profile.'
  }
}
