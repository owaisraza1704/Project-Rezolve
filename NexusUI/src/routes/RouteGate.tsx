import { Link } from 'react-router-dom'

import { useAuth } from '@/context/AuthProvider'
import { Button, Card } from '@/components/UI'

export function AuthBootScreen({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <Card className="w-full max-w-md px-6 py-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Preparing your workspace</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
      </Card>
    </div>
  )
}

export function AuthErrorScreen({
  title = 'We could not load your account',
  description,
  actionLabel = 'Retry',
}: {
  title?: string
  description?: string | null
  actionLabel?: string
}) {
  const { refreshProfile, signOut } = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <Card className="w-full max-w-lg px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {description || 'Please try again. If the problem continues, sign out and start a fresh session.'}
        </p>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => void refreshProfile()}>{actionLabel}</Button>
          <Button variant="outline" onClick={() => void signOut()}>
            Sign out
          </Button>
          <Link to="/">
            <Button variant="ghost">Back home</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
