import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type BadgeVariant = 'default' | 'success' | 'warning' | 'neutral' | 'brand'

export function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}) {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-slate-100 text-slate-800 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    neutral: 'bg-gray-100 text-gray-600 border-gray-200',
    brand: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  }

  return (
    <span className={cn('rounded-full border px-2.5 py-0.5 text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'

export function Button({
  children,
  variant = 'primary',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}) {
  const base =
    'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50'

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
    secondary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm',
    outline: 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50',
    ghost: 'text-slate-700 hover:bg-slate-100',
  }

  return (
    <button className={cn(base, variants[variant], 'h-10 px-4 py-2', className)} {...props}>
      {children}
    </button>
  )
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm', className)}>{children}</div>
}
