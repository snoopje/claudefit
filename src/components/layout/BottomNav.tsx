/**
 * BottomNav component - Mobile bottom navigation
 * Dark Industrial styling
 */

import { NavLink, useLocation } from 'react-router-dom'

const bottomNavLinks = [
  { path: '/', label: 'Home', icon: 'home' },
  { path: '/workouts', label: 'Workouts', icon: 'workouts' },
  { path: '/progress', label: 'Progress', icon: 'progress' },
  { path: '/nutrition', label: 'Nutrition', icon: 'nutrition' },
  { path: '/settings', label: 'Settings', icon: 'settings' },
]

const icons = {
  home: (
    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  ),
  workouts: (
    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  ),
  progress: (
    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  ),
  nutrition: (
    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  ),
  settings: (
    <>
      <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </>
  ),
}

export function BottomNav() {
  const location = useLocation()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#050505]/95 backdrop-blur-xl border-t border-white/[0.04]">
      <div className="flex items-center justify-around py-2">
        {bottomNavLinks.map((link) => {
          const isActive = location.pathname === link.path ||
            (link.path !== '/' && location.pathname.startsWith(link.path))

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={`
                flex flex-col items-center gap-1 px-3 py-2 rounded-lg
                transition-all duration-300
                ${isActive
                  ? 'text-lime'
                  : 'text-text-dim hover:text-text-secondary'
                }
              `}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {icons[link.icon as keyof typeof icons]}
              </svg>
              <span className="font-mono text-[9px] uppercase tracking-[0.15em]">
                {link.label}
              </span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
