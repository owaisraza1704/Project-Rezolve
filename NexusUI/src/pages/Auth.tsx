import type { ReactNode } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import { Activity, ArrowRight, ShieldCheck } from 'lucide-react'

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
  const navigate = useNavigate()

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
      <form className="space-y-6" onSubmit={(event) => { event.preventDefault(); navigate('/user') }}>
        <Field label="Email address" type="email" />
        <Field label="Password" type="password" />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-700">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
            Remember me
          </label>
          <a href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
            Forgot password?
          </a>
        </div>

        <Button type="submit" className="h-11 w-full text-base">
          Sign in
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
  const navigate = useNavigate()

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
      <form className="space-y-6" onSubmit={(event) => { event.preventDefault(); navigate('/user') }}>
        <Field label="Full name" type="text" />
        <Field label="Email address" type="email" />
        <Field label="Password" type="password" />

        <Button type="submit" className="h-11 w-full text-base">
          Create account
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </AuthShell>
  )
}

function Field({ label, type }: { label: string; type: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        required
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  )
}
