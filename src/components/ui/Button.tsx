/**
 * Button component - Dark Industrial styling
 * Sharp corners, lime accent, hover effects
 */

import { ButtonHTMLAttributes, forwardRef } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'ember'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'rounded-none font-bold uppercase tracking-wider transition-all duration-500 ease-out'
    const disabledStyles = (disabled || isLoading) && 'opacity-50 cursor-not-allowed'

    const variantStyles = {
      primary: 'bg-lime text-background hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(200,255,0,0.25)] active:scale-[0.97]',
      secondary: 'bg-surface-elevated text-foreground border border-surface-elevated hover:-translate-y-0.5 hover:border-lime',
      ghost: 'bg-transparent text-muted hover:text-foreground hover:bg-white/[0.04]',
      danger: 'bg-red-600 text-white hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(220,38,38,0.25)]',
      ember: 'bg-ember text-white hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(255,77,0,0.25)]',
    }

    const sizeStyles = {
      sm: 'text-xs px-3 py-2',
      md: 'text-xs px-4 py-3',
      lg: 'text-sm px-6 py-4',
    }

    const widthStyles = fullWidth ? 'w-full' : ''

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${disabledStyles} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
