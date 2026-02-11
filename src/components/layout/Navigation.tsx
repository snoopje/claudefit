/**
 * Navigation component - Desktop top navigation
 * Dark Industrial styling with blurred background
 */

import { NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

const navLinks = [
  { path: '/', label: 'Dashboard' },
  { path: '/workouts', label: 'Workouts' },
  { path: '/workouts/history', label: 'History' },
  { path: '/exercises', label: 'Exercises' },
  { path: '/routines', label: 'Routines' },
  { path: '/progress', label: 'Progress' },
  { path: '/body-metrics', label: 'Body' },
  { path: '/nutrition', label: 'Nutrition' },
  { path: '/goals', label: 'Goals' },
  { path: '/settings', label: 'Settings' },
]

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-40
        backdrop-blur-xl bg-[#050505]/80
        border-b border-white/[0.04]
        transition-all duration-300
        ${scrolled ? 'py-3' : 'py-4'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 bg-lime flex items-center justify-center">
              <span className="font-display text-xl text-background">C</span>
            </div>
            <span className="font-display text-xl tracking-wide text-foreground group-hover:text-lime transition-colors">
              CLAUDE<span className="text-lime">FIT</span>
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path ||
                (link.path !== '/' && location.pathname.startsWith(link.path))

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive: navIsActive }) => `
                    px-3 py-2 rounded-full
                    font-mono text-[11px] tracking-[0.15em] uppercase
                    transition-all duration-300
                    ${isActive || navIsActive
                      ? 'bg-lime/10 text-lime'
                      : 'text-text-secondary hover:text-foreground hover:bg-white/[0.04]'
                    }
                  `}
                >
                  {link.label}
                </NavLink>
              )
            })}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-text-dim hover:text-foreground transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}
