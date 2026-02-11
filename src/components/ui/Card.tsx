/**
 * Card component - Dark Industrial styling
 * Sharp corners, hover lift effect, subtle lime accent
 */

import { HTMLAttributes, forwardRef } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'accent'
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', hover = false, padding = 'md', className = '', children, ...props }, ref) => {
    const baseStyles = 'rounded-none transition-all duration-500 ease-out'

    const variantStyles = {
      default: 'bg-surface border border-transparent',
      elevated: 'bg-surface-elevated border border-transparent',
      bordered: 'bg-surface border border-surface-elevated',
      accent: 'bg-surface border-l-2 border-l-lime border-y-transparent border-r-transparent',
    }

    const hoverStyles = hover
      ? 'hover:-translate-y-1 hover:bg-[#111111] hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
      : ''

    const paddingStyles = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${paddingStyles[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
