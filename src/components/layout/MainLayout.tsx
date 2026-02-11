/**
 * MainLayout component - Wrapper for all pages
 * Includes top navigation, bottom navigation, and page container
 */

import { ReactNode } from 'react'
import { Navigation } from './Navigation'
import { BottomNav } from './BottomNav'

interface MainLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  containerWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const containerWidths = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
}

export function MainLayout({
  children,
  title,
  subtitle,
  containerWidth = 'xl',
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main
        className={`
          pt-20 pb-24 lg:pb-8 px-4 lg:px-8
          ${containerWidths[containerWidth]} mx-auto
        `}
      >
        {/* Page Header */}
        {(title || subtitle) && (
          <header className="mb-8">
            {title && (
              <h1 className="font-display text-hero uppercase tracking-wide text-foreground mb-2">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary">
                {subtitle}
              </p>
            )}
          </header>
        )}

        {/* Page Content */}
        {children}
      </main>

      <BottomNav />
    </div>
  )
}

/**
 * Page section component with category label
 */
interface PageSectionProps {
  label?: string
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

export function PageSection({ label, title, description, children, className = '' }: PageSectionProps) {
  return (
    <section className={`mb-8 ${className}`}>
      {(label || title) && (
        <header className="mb-4">
          {label && (
            <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-lime">
              / {label}
            </span>
          )}
          {title && (
            <h2 className="font-display text-section uppercase tracking-wide text-foreground mt-1">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-text-secondary mt-2 max-w-lg">
              {description}
            </p>
          )}
        </header>
      )}
      {children}
    </section>
  )
}

/**
 * Page grid layout
 */
interface PageGridProps {
  children: ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PageGrid({ children, columns = 2, gap = 'md', className = '' }: PageGridProps) {
  const columnStyles = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  const gapStyles = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  }

  return (
    <div className={`grid ${columnStyles[columns]} ${gapStyles[gap]} ${className}`}>
      {children}
    </div>
  )
}

/**
 * Ambient glow background effect
 */
export function AmbientGlow({ className = '' }: { className?: string }) {
  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-lime blur-[130px] opacity-[0.03] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ember blur-[130px] opacity-[0.03] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime blur-[150px] opacity-[0.02] rounded-full" />
    </div>
  )
}
