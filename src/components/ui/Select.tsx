/**
 * Select component - Dark Industrial styling
 */

import { SelectHTMLAttributes, forwardRef } from 'react'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: Array<{ value: string; label: string; disabled?: boolean }>
  placeholder?: string
  containerClassName?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', containerClassName = '', ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label className="font-mono text-[11px] tracking-[0.2em] uppercase text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full bg-surface border border-surface-elevated rounded-none
              px-3 py-2.5 text-foreground appearance-none cursor-pointer
              focus:outline-none focus:border-lime focus:ring-1 focus:ring-lime
              transition-colors duration-300
              ${error ? 'border-red-600 focus:border-red-600 focus:ring-red-600' : ''}
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-lime">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
        {error && (
          <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-red-600">
            {error}
          </span>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
