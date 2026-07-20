import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import { Activity, ArrowRight, ShieldCheck } from 'lucide-react'

import { useAuth } from '../context/AuthProvider'
import { supabase } from '../lib/supabase'
import { Button, Card } from '../components/UI'

function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-50 px-6 py-12 font-sans">
      <div className="mx-auto w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Project Nexus</span>
        </Link>

        <h1 className="text-center text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-2 text-center text-sm text-slate-600">{subtitle}</p>

        <Card className="mt-8 px-4 py-8 sm:px-10">{children}</Card>
      </div>
    </div>
  )
}

export function SignIn() {
  const { status, errorMessage, profile } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated' && profile?.role === 'admin') {
      navigate('/admin', { replace: true })
    }
  }, [navigate, profile?.role, status])

  return (
    <AuthShell
      title="Sign in to your account"
      subtitle={
        <>
          Or{' '}
          <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            create a new account
          </Link>
        </>
      }
    >
      <form
        className="space-y-6"
        onSubmit={async (event) => {
          event.preventDefault()
          setFormError(null)
          setIsSubmitting(true)

          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error) {
            setFormError(error.message)
            setIsSubmitting(false)
            return
          }

          setIsSubmitting(false)
        }}
      >
        <Field
          label="Email address"
          type="email"
          value={email}
          onChange={setEmail}
        />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-700">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
            Remember me
          </label>
          <a href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
            Forgot password?
          </a>
        </div>

        <AuthMessage
          formError={formError}
          providerError={errorMessage}
          status={status}
          idleMessage="Sign in with your Supabase account to continue."
          successMessage="Signed in. Your workspace will unlock once app identity finishes loading."
        />

        <Button
          type="submit"
          className="h-11 w-full text-base"
          disabled={isSubmitting || status === 'booting'}
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <div className="mt-8 border-t border-slate-200 pt-6">
        <Link to="/resolver">
          <Button variant="outline" className="h-11 w-full border-slate-200 text-slate-600">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Apply as resolver
          </Button>
        </Link>
      </div>
    </AuthShell>
  )
}

export function SignUp() {
  const { status, errorMessage, profile } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated' && profile?.role === 'admin') {
      navigate('/admin', { replace: true })
    }
  }, [navigate, profile?.role, status])

  return (
    <AuthShell
      title="Create your account"
      subtitle={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </>
      }
    >
      <form
        className="space-y-6"
        onSubmit={async (event) => {
          event.preventDefault()
          setFormError(null)
          setNotice(null)
          setIsSubmitting(true)

          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/login`,
              data: {
                name,
                full_name: name,
              },
            },
          })

          if (error) {
            setFormError(error.message)
            setIsSubmitting(false)
            return
          }

          setNotice('Account created. Check your email to confirm your address before continuing.')
          setIsSubmitting(false)
        }}
      >
        <Field label="Full name" type="text" value={name} onChange={setName} />
        <Field
          label="Email address"
          type="email"
          value={email}
          onChange={setEmail}
        />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
        />

        <AuthMessage
          formError={formError}
          providerError={errorMessage}
          status={status}
          idleMessage={notice}
          successMessage="Signed in. Your workspace will unlock once app identity finishes loading."
        />

        <Button
          type="submit"
          className="h-11 w-full text-base"
          disabled={isSubmitting || status === 'booting'}
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </AuthShell>
  )
}

function AuthMessage({
  formError,
  providerError,
  status,
  idleMessage,
  successMessage,
}: {
  formError: string | null
  providerError: string | null
  status: 'booting' | 'anonymous' | 'authenticated' | 'error'
  idleMessage: string | null
  successMessage: string
}) {
  const message = formError || providerError

  if (message) {
    return <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p>
  }

  if (status === 'booting') {
    return (
      <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
        Loading your session...
      </p>
    )
  }

  if (status === 'authenticated') {
    return (
      <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
        {successMessage}
      </p>
    )
  }

  if (!idleMessage) {
    return null
  }

  return <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">{idleMessage}</p>
}

function Field({
  label,
  type,
  value,
  onChange,
}: {
  label: string
  type: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  )
}
