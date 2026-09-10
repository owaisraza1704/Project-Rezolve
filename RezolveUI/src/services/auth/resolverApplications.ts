import { AuthApiError } from '@/services/auth/client'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

export type ResolverApplicationRecord = {
  id: number
  profile_id: number
  status: 'pending' | 'approved' | 'rejected'
  motivation: string
  experience_summary: string | null
  skills: string | null
  availability: string | null
  review_notes: string | null
  reviewed_by: number | null
  created_at: string
}

export type ResolverApplicationPayload = {
  motivation: string
  experience_summary: string
  skills: string
  availability: string
}

export type PublicResolverOnboardingPayload = ResolverApplicationPayload & {
  full_name: string
  email: string
  password: string
}

export async function submitResolverApplication(accessToken: string, payload: ResolverApplicationPayload) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/resolver-applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const message = await readErrorMessage(response)
    throw new AuthApiError(message, response.status)
  }

  return response.json() as Promise<ResolverApplicationRecord>
}

export async function submitPublicResolverOnboarding(payload: PublicResolverOnboardingPayload) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/resolver-onboarding`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const message = await readErrorMessage(response)
    throw new AuthApiError(message, response.status)
  }

  return response.json() as Promise<ResolverApplicationRecord>
}

export async function fetchMyResolverApplications(accessToken: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/resolver-applications/me`, {
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

async function readErrorMessage(response: Response) {
  try {
    const data = (await response.json()) as { detail?: string }
    return data.detail || 'Unable to process resolver application.'
  } catch {
    return 'Unable to process resolver application.'
  }
}
