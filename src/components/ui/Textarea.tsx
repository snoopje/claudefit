/**
 * Textarea component - Dark Industrial styling
 */

import { TextareaHTMLAttributes, forwardRef } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  containerClassName?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', containerClassName = '', ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label className="font-mono text-[11px] tracking-[0.2em] uppercase text-text-secondary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full bg-surface border border-surface-elevated rounded-none
            px-3 py-2.5 text-foreground placeholder:text-text-dim
            focus:outline-none focus:border-lime focus:ring-1 focus:ring-lime
            transition-colors duration-300 resize-none
            ${error ? 'border-red-600 focus:border-red-600 focus:ring-red-600' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-red-600">
            {error}
          </span>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
