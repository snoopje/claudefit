/**
 * Main App component with routing
 * ClaudeFit - A comprehensive fitness tracker with Dark Industrial design
 */

import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout, AmbientGlow } from './components/layout/MainLayout'

// Lazy load all pages for code splitting
const DashboardPage = lazy(() => import('./features/dashboard').then(m => ({ default: m.DashboardPage })))
const WorkoutsPage = lazy(() => import('./features/workouts').then(m => ({ default: m.WorkoutsPage })))
const WorkoutHistoryPage = lazy(() => import('./features/workouts').then(m => ({ default: m.WorkoutHistoryPage })))
const ExercisesPage = lazy(() => import('./features/exercises').then(m => ({ default: m.ExercisesPage })))
const RoutinesPage = lazy(() => import('./features/routines').then(m => ({ default: m.RoutinesPage })))
const ProgressPage = lazy(() => import('./features/progress').then(m => ({ default: m.ProgressPage })))
const BodyMetricsPage = lazy(() => import('./features/body-metrics').then(m => ({ default: m.BodyMetricsPage })))
const NutritionPage = lazy(() => import('./features/nutrition').then(m => ({ default: m.NutritionPage })))
const GoalsPage = lazy(() => import('./features/goals').then(m => ({ default: m.GoalsPage })))
const SettingsPage = lazy(() => import('./features/settings').then(m => ({ default: m.SettingsPage })))

// Loading component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-12 h-12 bg-lime mx-auto mb-4 flex items-center justify-center animate-pulse">
          <span className="font-display text-2xl text-background">C</span>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim">
          Loading...
        </p>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AmbientGlow />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Dashboard - Home */}
          <Route path="/" element={<MainLayout><DashboardPage /></MainLayout>} />

          {/* Workouts */}
          <Route path="/workouts" element={<MainLayout><WorkoutsPage /></MainLayout>} />
          <Route path="/workouts/history" element={<MainLayout><WorkoutHistoryPage /></MainLayout>} />

          {/* Exercises */}
          <Route path="/exercises" element={<MainLayout><ExercisesPage /></MainLayout>} />

          {/* Routines */}
          <Route path="/routines" element={<MainLayout><RoutinesPage /></MainLayout>} />

          {/* Progress */}
          <Route path="/progress" element={<MainLayout><ProgressPage /></MainLayout>} />

          {/* Body Metrics */}
          <Route path="/body-metrics" element={<MainLayout><BodyMetricsPage /></MainLayout>} />

          {/* Nutrition */}
          <Route path="/nutrition" element={<MainLayout><NutritionPage /></MainLayout>} />

          {/* Goals */}
          <Route path="/goals" element={<MainLayout><GoalsPage /></MainLayout>} />

          {/* Settings */}
          <Route path="/settings" element={<MainLayout><SettingsPage /></MainLayout>} />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
