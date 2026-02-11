/**
 * Badge component - Dark Industrial styling
 * Monospace font, uppercase, sharp corners
 */

import { HTMLAttributes } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'lime' | 'ember' | 'muted' | 'outline'
  size?: 'sm' | 'md'
  prefix?: string
}

export function Badge({
  variant = 'default',
  size = 'sm',
  prefix = '/',
  className = '',
  children,
  ...props
}: BadgeProps) {
  const baseStyles = 'font-mono uppercase tracking-[0.2em] rounded-none inline-flex items-center'

  const variantStyles = {
    default: 'bg-surface-elevated text-foreground',
    lime: 'bg-lime/10 text-lime',
    ember: 'bg-ember/10 text-ember',
    muted: 'bg-text-ghost/20 text-text-dim',
    outline: 'border border-surface-elevated text-text-secondary',
  }

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-1',
    md: 'text-[11px] px-2.5 py-1.5',
  }

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      <span className="opacity-50 mr-1">{prefix}</span>
      {children}
    </span>
  )
}
