# ClaudeFit - System Architecture Document

## Document Information

| Field | Value |
|-------|-------|
| **Project** | ClaudeFit Fitness Tracker |
| **Version** | 1.0.0 |
| **Date** | 2025-02-11 |
| **Author** | Technical Architect |
| **Status** | Proposed |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architectural Principles](#2-architectural-principles)
3. [Tech Stack Integration](#3-tech-stack-integration)
4. [Project Structure](#4-project-structure)
5. [Component Hierarchy](#5-component-hierarchy)
6. [Routing Structure](#6-routing-structure)
7. [State Management Approach](#7-state-management-approach)
8. [Service Layer Design](#8-service-layer-design)
9. [Type System Design](#9-type-system-design)
10. [Performance Optimization](#10-performance-optimization)
11. [Architecture Decision Records](#11-architecture-decision-records)

---

## 1. Executive Summary

ClaudeFit is a **client-side single-page application** with no backend dependency. All data persistence is handled via browser localStorage. The architecture prioritizes:

- **Type safety** through comprehensive TypeScript coverage
- **Separation of concerns** with clear layer boundaries
- **Scalability** for team growth and feature expansion
- **Performance** through efficient re-render strategies
- **Maintainability** via consistent patterns and modular design

### Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **Feature-based folder structure** | Enables clear ownership boundaries and supports team scaling |
| **React Context for state management** | Adequate for localStorage scale without external dependencies |
| **Service layer abstraction** | Decouples data operations from components, enables testing |
| **Custom hooks for domain logic** | Promotes reuse and encapsulates business logic |
| **Type-first development** | Catches errors at compile-time, improves IDE support |

---

## 2. Architectural Principles

### 2.1 Core Principles

```
Maintainability (100%)
  └─> Scalability (90%)
      └─> Performance (70%)
          └─> Short-term gains (30%)
```

### 2.2 Design Principles Applied

1. **Separation of Concerns**
   - UI components are pure and presentational
   - Business logic lives in custom hooks
   - Data operations are isolated in services
   - Types are defined centrally

2. **Single Responsibility**
   - Each component/hook/service has one clear purpose
   - Files are kept focused and concise

3. **Dependency Inversion**
   - Components depend on abstractions (hooks/interfaces)
   - Services implement storage interfaces

4. **DRY (Don't Repeat Yourself)**
   - Shared utilities are extracted
   - Common UI patterns become reusable components

5. **Defensive Programming**
   - All localStorage operations wrapped in try-catch
   - Default values provided for all data reads
   - Type guards for runtime validation

---

## 3. Tech Stack Integration

### 3.1 Stack Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         User Interface                       │
├─────────────────────────────────────────────────────────────┤
│  React 18  │  React Router  │  Tailwind CSS  │  Recharts    │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
├─────────────────────────────────────────────────────────────┤
│  Custom Hooks  │  Context Providers  │  Business Logic     │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
├─────────────────────────────────────────────────────────────┤
│  Service Layer  │  Type Definitions  │  Validators         │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      Storage Layer                           │
├─────────────────────────────────────────────────────────────┤
│                    Browser localStorage                      │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Technology Roles

| Technology | Purpose | Key Configurations |
|------------|---------|-------------------|
| **Vite** | Build tool, dev server, HMR | Fast refresh, path aliases |
| **React 18** | UI framework | Concurrent features, Suspense-ready |
| **TypeScript** | Type safety | Strict mode, path mapping |
| **React Router v6** | Client-side routing | Lazy loading routes, nested routes |
| **Tailwind CSS** | Styling | Custom theme, CSS variables |
| **Recharts** | Data visualization | Responsive charts, custom styling |
| **Zod** (recommended) | Runtime validation | Schema validation for localStorage |

### 3.3 Integration Patterns

#### Vite + TypeScript Integration
```typescript
// vite.config.ts - Path aliases for clean imports
{
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
    }
  }
}
```

#### React Router + Lazy Loading
```typescript
// Route-based code splitting for optimal bundle sizes
const Dashboard = lazy(() => import('@/features/dashboard/DashboardPage'));
const Workouts = lazy(() => import('@/features/workouts/WorkoutsPage'));
```

#### Tailwind + CSS Variables
```css
/* Design tokens mapped to CSS variables for theme consistency */
:root {
  --background: #050505;
  --foreground: #f0f0f0;
  --lime: #c8ff00;
  /* ... */
}
```

---

## 4. Project Structure

### 4.1 Folder Structure Overview

```
claufefit/
├── index.html                          # Application entry point
├── vite.config.ts                      # Vite configuration
├── tailwind.config.js                  # Tailwind theme configuration
├── tsconfig.json                       # TypeScript configuration
├── tsconfig.node.json                  # TypeScript config for Node scripts
│
├── public/                             # Static assets
│   ├── favicon.ico
│   └── fonts/                          # Local font files (if needed)
│
└── src/                                # Source root
    ├── main.tsx                        # React application bootstrap
    ├── App.tsx                         # Root component with router
    ├── vite-env.d.ts                   # Vite environment types
    │
    ├── assets/                         # Static assets (images, svgs)
    │   ├── icons/
    │   ├── illustrations/
    │   └── logo.svg
    │
    ├── styles/                         # Global styles
    │   ├── index.css                   # Tailwind imports + custom CSS
    │   ├── animations.css              # Animation utilities
    │   └── theme.css                   # CSS variables for design tokens
    │
    ├── types/                          # Type definitions (centralized)
    │   ├── index.ts                    # Export all types
    │   ├── models.ts                   # Domain model types
    │   ├── api.ts                      # API/Service response types
    │   └── ui.ts                       # UI component prop types
    │
    ├── constants/                      # Application constants
    │   ├── index.ts
    │   ├── storage-keys.ts             # localStorage key constants
    │   ├── routes.ts                   # Route path constants
    │   ├── exercise-data.ts            # Pre-built exercise library
    │   └── animations.ts               # Animation class names
    │
    ├── utils/                          # Utility functions
    │   ├── index.ts
    │   ├── formatters.ts               # Date, number, time formatting
    │   ├── validators.ts               # Input validation helpers
    │   ├── calculators.ts              # 1RM, volume, calorie calculations
    │   ├── date.ts                     # Date manipulation helpers
    │   └── cn.ts                       # className utility (clsx + tailwind-merge)
    │
    ├── services/                       # Data access layer
    │   ├── index.ts
    │   ├── storage/
    │   │   ├── index.ts                # Storage service exports
    │   │   ├── storage.service.ts      # Generic localStorage wrapper
    │   │   └── storage.keys.ts         # Storage key definitions
    │   │
    │   ├── api/                        # Service layer for each domain
    │   │   ├── index.ts
    │   │   ├── workouts.service.ts     # Workout CRUD operations
    │   │   ├── exercises.service.ts    # Exercise library operations
    │   │   ├── routines.service.ts     # Routine template operations
    │   │   ├── body-metrics.service.ts # Body measurements operations
    │   │   ├── nutrition.service.ts    # Meal/nutrition logging operations
    │   │   ├── goals.service.ts        # Goal tracking operations
    │   │   └── export.service.ts       # Data export functionality
    │   │
    │   └── hooks/                      # Service-level hooks (if needed)
    │       └── use-storage.ts          # Storage change listener hook
    │
    ├── contexts/                       # React Context providers
    │   ├── index.ts
    │   ├── AppContext.tsx              # Global app state provider
    │   └── ThemeContext.tsx            # Theme configuration provider
    │
    ├── components/                     # Shared UI components
    │   ├── index.ts
    │   │
    │   ├── ui/                          # Base/primitive components
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx
    │   │   ├── Input.tsx
    │   │   ├── Select.tsx
    │   │   ├── Textarea.tsx
    │   │   ├── Modal.tsx
    │   │   ├── Badge.tsx
    │   │   ├── Tabs.tsx
    │   │   ├── Spinner.tsx
    │   │   └── ProgressBar.tsx
    │   │
    │   ├── layout/                      # Layout components
    │   │   ├── Navbar.tsx
    │   │   ├── Sidebar.tsx
    │   │   ├── Footer.tsx
    │   │   ├── MainLayout.tsx
    │   │   └── MobileNav.tsx
    │   │
    │   ├── charts/                      # Chart wrapper components
    │   │   ├── LineChart.tsx
    │   │   ├── BarChart.tsx
    │   │   ├── PieChart.tsx
    │   │   └── StatCard.tsx
    │   │
    │   └── shared/                      # Domain-agnostic shared components
    │       ├── EmptyState.tsx
    │       ├── ErrorBoundary.tsx
    │       ├── ConfirmDialog.tsx
    │       ├── DatePicker.tsx
    │       └── SearchInput.tsx
    │
    ├── hooks/                          # Custom React hooks
    │   ├── index.ts
    │   │
    │   ├── data/                        # Data fetching hooks
    │   │   ├── use-workouts.ts         # Workout data operations
    │   │   ├── use-exercises.ts        # Exercise library operations
    │   │   ├── use-routines.ts         # Routine operations
    │   │   ├── use-body-metrics.ts     # Body metrics operations
    │   │   ├── use-nutrition.ts        # Nutrition operations
    │   │   └── use-goals.ts            # Goal operations
    │   │
    │   ├── ui/                          # UI-related hooks
    │   │   ├── use-media-query.ts      # Responsive breakpoints
    │   │   ├── use-local-storage.ts    # LocalStorage sync hook
    │   │   ├── use-debounce.ts         # Debounce utility
    │   │   ├── use-toast.ts            # Toast notifications
    │   │   └── use-modal.ts            # Modal state management
    │   │
    │   └── domain/                      # Business logic hooks
    │       ├── use-workout-timer.ts    # Rest timer functionality
    │       ├── use-1rm-calculator.ts   # One-rep max calculations
    │       ├── use-streak.ts           # Workout streak tracking
    │       └── use-filters.ts          # Generic filter state
    │
    └── features/                       # Feature modules (domain-driven)
        │
        ├── dashboard/                   # Dashboard feature
        │   ├── DashboardPage.tsx       # Page component
        │   ├── Dashboard.tsx           # Main container
        │   ├── components/
        │   │   ├── StatCard.tsx        # Dashboard stat cards
        │   │   ├── RecentWorkouts.tsx  # Recent workouts list
        │   │   ├── ActiveGoals.tsx     # Goals progress display
        │   │   ├── NutritionSummary.tsx # Daily nutrition overview
        │   │   └── PersonalRecords.tsx # Recent PRs display
        │   └── hooks/
        │       └── use-dashboard-data.ts # Dashboard data aggregation
        │
        ├── workouts/                    # Workout tracking feature
        │   ├── WorkoutsPage.tsx        # Page component (list view)
        │   ├── WorkoutDetailPage.tsx   # Single workout view
        │   ├── ActiveWorkoutPage.tsx   # In-progress workout session
        │   ├── components/
        │   │   ├── WorkoutList.tsx     # Workout history list
        │   │   ├── WorkoutCard.tsx     # Single workout summary
        │   │   ├── ExerciseLog.tsx     # Exercise entry form
        │   │   ├── SetEditor.tsx       # Set/reps/weight input
        │   │   ├── RestTimer.tsx       # Countdown timer component
        │   │   ├── WorkoutFilters.tsx  # Filter controls
        │   │   └── WorkoutSummary.tsx  # Completed workout summary
        │   └── hooks/
        │       ├── use-active-workout.ts # Active workout session state
        │       └── use-workout-filters.ts # Filter state management
        │
        ├── exercises/                   # Exercise library feature
        │   ├── ExercisesPage.tsx       # Page component
        │   ├── ExerciseDetailPage.tsx  # Exercise detail view
        │   ├── components/
        │   │   ├── ExerciseGrid.tsx    # Exercise library grid
        │   │   ├── ExerciseCard.tsx    # Single exercise card
        │   │   ├── ExerciseFilters.tsx # Filter by muscle group
        │   │   ├── CustomExerciseForm.tsx # Add custom exercise
        │   │   └── MuscleGroupBadge.tsx # Muscle group indicator
        │   └── hooks/
        │       └── use-exercise-library.ts # Exercise filtering/search
        │
        ├── routines/                    # Routine management feature
        │   ├── RoutinesPage.tsx        # Page component (routine list)
        │   ├── RoutineBuilderPage.tsx  # Create/edit routine
        │   ├── components/
        │   │   ├── RoutineList.tsx     # Saved routines list
        │   │   ├── RoutineCard.tsx     # Routine summary card
        │   │   ├── ExercisePicker.tsx  # Add exercises to routine
        │   │   └── RoutinePreview.tsx  # Routine overview before starting
        │   └── hooks/
        │       └── use-routine-builder.ts # Routine creation state
        │
        ├── progress/                    # Progress tracking feature
        │   ├── ProgressPage.tsx        # Page component
        │   ├── components/
        │   │   ├── ProgressCharts.tsx  # Progress visualization
        │   │   ├── PersonalRecords.tsx # PRs display
        │   │   ├── VolumeSummary.tsx   # Weekly/monthly volume
        │   │   ├── StreakDisplay.tsx   # Workout streak visualizer
        │   │   └── ExerciseStats.tsx   # Per-exercise statistics
        │   └── hooks/
        │       └── use-progress-stats.ts # Progress data calculations
        │
        ├── body-metrics/                # Body measurements feature
        │   ├── BodyMetricsPage.tsx     # Page component
        │   ├── components/
        │   │   ├── MetricLogger.tsx    # Log measurements form
        │   │   ├── MetricChart.tsx     # Measurement trends
        │   │   ├── MetricHistory.tsx   # Historical measurements list
        │   │   └── WeightTracker.tsx   # Weight-specific tracking
        │   └── hooks/
        │       └── use-metrics-chart.ts # Chart data preparation
        │
        ├── nutrition/                   # Nutrition tracking feature
        │   ├── NutritionPage.tsx       # Page component
        │   ├── components/
        │   │   ├── DailySummary.tsx    # Daily nutrition overview
        │   │   ├── MealLog.tsx         # Log meal form
        │   │   ├── MealList.tsx        # Daily meals list
        │   │   ├── MacroBreakdown.tsx  # Macro distribution chart
        │   │   ├── NutritionTargets.tsx # Set daily targets
        │   │   └── WeeklySummary.tsx   # Weekly nutrition chart
        │   └── hooks/
        │       ├── use-meal-log.ts      # Meal CRUD operations
        │       └── use-nutrition-targets.ts # Target management
        │
        ├── goals/                       # Goal setting feature
        │   ├── GoalsPage.tsx           # Page component
        │   ├── components/
        │   │   ├── GoalList.tsx        # All goals list
        │   │   ├── GoalCard.tsx        # Single goal with progress
        │   │   ├── GoalForm.tsx        # Create/edit goal
        │   │   ├── GoalProgress.tsx    # Progress visualization
        │   │   └── GoalTemplates.tsx   # Quick-start goal options
        │   └── hooks/
        │       └── use-goal-tracker.ts  # Goal progress calculations
        │
        └── settings/                    # Settings feature
            ├── SettingsPage.tsx        # Page component
            ├── components/
            │   ├── ProfileSettings.tsx # User preferences
            │   ├── DataExport.tsx      # Export all data
            │   ├── DataImport.tsx      # Import data from backup
            │   └── DangerZone.tsx      # Clear all data option
            └── hooks/
                └── use-data-export.ts  # Export/import logic
```

### 4.2 File Naming Conventions

| Pattern | Description | Examples |
|---------|-------------|----------|
| **PascalCase.tsx** | React components | `Dashboard.tsx`, `WorkoutCard.tsx` |
| **PascalCase.page.tsx** | Page/route components | `DashboardPage.tsx`, `WorkoutsPage.tsx` |
| **kebab-case.ts** | Utilities, hooks (non-React) | `formatters.ts`, `calculators.ts` |
| **use*.ts** | Custom React hooks | `use-workouts.ts`, `use-modal.ts` |
| ***.service.ts** | Service layer | `workouts.service.ts` |
| ***.types.ts** | Type definitions | `models.types.ts` |
| **index.ts** | Barrel exports | Export all public APIs from folder |

---

## 5. Component Hierarchy

### 5.1 Overall Component Tree

```
App (Root)
├── ErrorBoundary
├── ThemeProvider
├── AppProvider (Global State)
├── Router (React Router)
│   │
│   ├── Layout: MainLayout
│   │   ├── Navbar
│   │   │   ├── Logo
│   │   │   ├── NavLinks
│   │   │   └── MobileMenuButton
│   │   │
│   │   ├── Sidebar (Desktop)
│   │   │   ├── SidebarNav
│   │   │   └── SidebarFooter
│   │   │
│   │   ├── MobileNav (Bottom bar)
│   │   │   └── MobileNavLink items
│   │   │
│   │   └── Outlet (Page content)
│   │
│   ├── Route: / (Dashboard)
│   │   └── Dashboard
│   │       ├── StatCard (x4)
│   │       ├── RecentWorkouts
│   │       │   └── WorkoutCard (xN)
│   │       ├── ActiveGoals
│   │       │   └── GoalProgressCard (xN)
│   │       ├── NutritionSummary
│   │       │   └── MacroBarChart
│   │       └── PersonalRecords
│   │           └── RecordItem (xN)
│   │
│   ├── Route: /workouts
│   │   └── WorkoutsPage
│   │       ├── PageHeader
│   │       ├── WorkoutFilters
│   │       ├── WorkoutList
│   │       │   └── WorkoutCard (xN)
│   │       └── FloatingActionButton (Add workout)
│   │
│   ├── Route: /workouts/:id
│   │   └── WorkoutDetailPage
│   │       ├── PageHeader
│   │       ├── WorkoutSummary
│   │       ├── ExerciseList
│   │       │   └── ExerciseItem (xN)
│   │       │       └── SetList (xN)
│   │       └── ActionButtons (Edit/Delete)
│   │
│   ├── Route: /workouts/active
│   │   └── ActiveWorkoutPage
│   │       ├── WorkoutHeader (Start time, duration)
│   │       ├── ExerciseList
│   │       │   └── ExerciseLog (xN)
│   │       │       ├── SetEditor (xN)
│   │       │       └── AddSetButton
│   │       ├── AddExerciseButton
│   │       ├── RestTimer (Floating/Modal)
│   │       └── CompleteWorkoutButton
│   │
│   ├── Route: /exercises
│   │   └── ExercisesPage
│   │       ├── PageHeader
│   │       ├── ExerciseFilters
│   │       ├── ExerciseGrid
│   │       │   └── ExerciseCard (xN)
│   │       └── CreateExerciseButton
│   │
│   ├── Route: /exercises/:id
│   │   └── ExerciseDetailPage
│   │       ├── ExerciseHeader
│   │       ├── ExerciseInfo
│   │       ├── MuscleGroupVisual
│   │       └── ExerciseHistory
│   │           └── HistoryItem (xN)
│   │
│   ├── Route: /routines
│   │   └── RoutinesPage
│   │       ├── PageHeader
│   │       ├── RoutineList
│   │       │   └── RoutineCard (xN)
│   │       └── CreateRoutineButton
│   │
│   ├── Route: /routines/new
│   │   └── RoutineBuilderPage
│   │       ├── RoutineForm (Name input)
│   │       ├── ExercisePicker
│   │       │   ├── ExerciseSearch
│   │       │   ├── ExerciseList
│   │       │   │   └── ExercisePickerItem (xN)
│   │       │   └── SelectedExercises
│   │       │       └── ExerciseConfig (xN) - Set defaults
│   │       └── SaveRoutineButton
│   │
│   ├── Route: /routines/:id/start
│   │   └── ActiveWorkoutPage (Pre-populated from routine)
│   │
│   ├── Route: /progress
│   │   └── ProgressPage
│   │       ├── PageHeader
│   │       ├── PeriodSelector (Week/Month/Year)
│   │       ├── VolumeChart
│   │       ├── WorkoutFrequencyChart
│   │       ├── PersonalRecords
│   │       │   └── RecordCard (xN)
│   │       └── ExerciseSelect (Filter by exercise)
│   │
│   ├── Route: /body-metrics
│   │   └── BodyMetricsPage
│   │       ├── PageHeader
│   │       ├── MetricTabs (Weight/Measurements)
│   │       ├── MetricLogger
│   │       │   ├── DateInput
│   │       │   └── MeasurementInputs
│   │       ├── MetricChart
│   │       │   └── LineChart (Weight + measurements)
│   │       └── MetricHistory
│   │           └── HistoryItem (xN)
│   │
│   ├── Route: /nutrition
│   │   └── NutritionPage
│   │       ├── PageHeader
│   │       ├── DateSelector
│   │       ├── DailySummaryCard
│   │       │   ├── CalorieProgress
│   │       │   └── MacroBars
│   │       ├── MealList
│   │       │   └── MealCard (xN)
│   │       │       ├── MealInfo
│   │       │       └── MealActions (Edit/Delete)
│   │       ├── AddMealButton
│   │       └── WeeklyChart
│   │           └── WeeklyCalorieChart
│   │
│   ├── Route: /goals
│   │   └── GoalsPage
│   │       ├── PageHeader
│   │       ├── GoalTabs (Active/Completed)
│   │       ├── GoalList
│   │       │   └── GoalCard (xN)
│   │       │       ├── GoalInfo
│   │       │       ├── ProgressBar
│   │       │       └── GoalActions
│   │       ├── CreateGoalButton
│   │       └── GoalTemplates
│   │           └── TemplateCard (xN)
│   │
│   └── Route: /settings
│       └── SettingsPage
│           ├── PageHeader
│           ├── SettingsTabs
│           │   ├── ProfileSettings
│           │   ├── DataExport
│           │   │   ├── ExportButton
│           │   │   └── ImportButton
│           │   └── DangerZone
│           │       └── ClearDataButton
│           └── AppInfo
│
└── ToastContainer (Global notifications)
```

### 5.2 Component Classification

#### Classification by Responsibility

```
PRESENTATIONAL COMPONENTS
├── Pure UI (No business logic)
│   ├── Button, Card, Input, Select, Modal, Badge
│   ├── Spinner, ProgressBar, Tabs
│   └── EmptyState, ErrorBoundary
│
├── Domain Presentational (Display domain data)
│   ├── WorkoutCard, ExerciseCard, RoutineCard
│   ├── GoalCard, MealCard, StatCard
│   └── PersonalRecords, MetricChart

CONTAINER COMPONENTS
├── Page Containers (Route-level)
│   ├── DashboardPage, WorkoutsPage
│   ├── ExercisesPage, RoutinesPage
│   ├── ProgressPage, BodyMetricsPage
│   ├── NutritionPage, GoalsPage, SettingsPage
│
├── Feature Containers (Feature-specific state)
│   ├── ActiveWorkoutPage, RoutineBuilderPage
│   ├── WorkoutDetailPage, ExerciseDetailPage
│   └── All *Page components

LAYOUT COMPONENTS
├── Navbar, Sidebar, Footer
├── MainLayout, MobileNav
└── PageHeader, SectionHeader
```

### 5.3 Component Size Guidelines

| Component Type | Target LOC | Max LOC | Rationale |
|----------------|------------|---------|-----------|
| **Base UI** | 50-100 | 200 | Simple, focused primitives |
| **Shared Domain** | 100-200 | 300 | Reusable, self-contained |
| **Feature Components** | 150-250 | 400 | May contain sub-components |
| **Page Containers** | 100-200 | 300 | Orchestration, delegate to children |
| **Custom Hooks** | 50-150 | 250 | Single responsibility logic |

---

## 6. Routing Structure

### 6.1 Route Configuration

```typescript
// Route definitions with lazy loading
const routes = [
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
        handle: { title: 'Dashboard' }
      },
      {
        path: 'workouts',
        element: <WorkoutsPage />,
        handle: { title: 'Workouts' },
        children: [
          {
            path: 'active',
            element: <ActiveWorkoutPage />
          },
          {
            path: ':id',
            element: <WorkoutDetailPage />
          }
        ]
      },
      {
        path: 'exercises',
        element: <ExercisesPage />,
        handle: { title: 'Exercise Library' },
        children: [
          {
            path: ':id',
            element: <ExerciseDetailPage />
          }
        ]
      },
      {
        path: 'routines',
        element: <RoutinesPage />,
        handle: { title: 'Routines' },
        children: [
          {
            path: 'new',
            element: <RoutineBuilderPage />
          },
          {
            path: ':id/start',
            element: <ActiveWorkoutPage />
          }
        ]
      },
      {
        path: 'progress',
        element: <ProgressPage />,
        handle: { title: 'Progress' }
      },
      {
        path: 'body-metrics',
        element: <BodyMetricsPage />,
        handle: { title: 'Body Metrics' }
      },
      {
        path: 'nutrition',
        element: <NutritionPage />,
        handle: { title: 'Nutrition' }
      },
      {
        path: 'goals',
        element: <GoalsPage />,
        handle: { title: 'Goals' }
      },
      {
        path: 'settings',
        element: <SettingsPage />,
        handle: { title: 'Settings' }
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
];
```

### 6.2 Navigation Hierarchy

```
Primary Navigation (Top-level routes)
├── /                - Dashboard (Home)
├── /workouts        - Workout tracking
│   ├── /workouts/active    - Active workout session
│   └── /workouts/:id       - Workout detail
├── /exercises       - Exercise library
│   └── /exercises/:id      - Exercise detail
├── /routines        - Routine management
│   ├── /routines/new       - Create routine
│   └── /routines/:id/start - Start from routine
├── /progress        - Progress & statistics
├── /body-metrics    - Body measurements
├── /nutrition       - Nutrition tracking
├── /goals           - Goal setting
└── /settings        - Settings & data management
```

### 6.3 Route Guards & Redirects

```typescript
// Protected route pattern (for future expansion)
// Currently no authentication, but structure allows for it
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Future: Add auth check here
  return <>{children}</>;
};

// Example: Redirect from old routes
const redirects = [
  { from: '/history', to: '/workouts' },
  { from: '/stats', to: '/progress' }
];
```

### 6.4 Dynamic Route Parameters

| Route | Parameter | Type | Description |
|-------|-----------|------|-------------|
| `/workouts/:id` | `id` | string | Workout UUID |
| `/exercises/:id` | `id` | string | Exercise UUID |
| `/routines/:id/start` | `id` | string | Routine UUID |

---

## 7. State Management Approach

### 7.1 State Management Strategy

ClaudeFit uses a **hybrid state management approach** combining React Context for global state and local component state for UI-specific data.

```
STATE CLASSIFICATION
├── Global State (Context)
│   ├── User preferences
│   ├── Current active workout session
│   └── Application settings
│
├── Server State (Custom Hooks + Services)
│   ├── Workouts data
│   ├── Exercise library
│   ├── Routines
│   ├── Body metrics
│   ├── Nutrition logs
│   └── Goals
│
├── Local UI State
│   ├── Form inputs
│   ├── Modal open/close
│   ├── Filter selections
│   └── Accordion states
│
└── URL State
    ├── Search params
    ├── Route params
    └── Query filters
```

### 7.2 Global State Structure

```typescript
// Global application state
interface AppState {
  // User preferences
  preferences: {
    units: 'metric' | 'imperial';
    theme: 'dark' | 'light'; // Default: dark
    restTimerSeconds: number;
  };

  // Active workout session (persists across navigation)
  activeWorkout: {
    id: string | null;
    startTime: Date | null;
    exercises: ActiveExercise[];
    isComplete: boolean;
  } | null;

  // UI state (optional - could be local)
  ui: {
    sidebarOpen: boolean;
    mobileMenuOpen: boolean;
  };
}
```

### 7.3 State Update Patterns

#### Pattern 1: Data-fetching with Custom Hooks

```typescript
// Typical pattern for domain data
function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    workoutsService.getAll()
      .then(setWorkouts)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { workouts, loading, error, refetch: () => {/*...*/} };
}
```

#### Pattern 2: CRUD Operations

```typescript
function useWorkoutCRUD() {
  const queryClient = useQueryClient(); // Or simple setState refresher

  const create = useCallback(async (data: CreateWorkoutDTO) => {
    await workoutsService.create(data);
    // Trigger refetch or optimistic update
  }, [queryClient]);

  const update = useCallback(async (id: string, data: UpdateWorkoutDTO) => {
    await workoutsService.update(id, data);
  }, [queryClient]);

  const remove = useCallback(async (id: string) => {
    await workoutsService.delete(id);
  }, [queryClient]);

  return { create, update, remove };
}
```

#### Pattern 3: Active Session State

```typescript
// For complex cross-cutting state like active workout
function useActiveWorkout() {
  const context = useContext(AppContext);

  const startWorkout = useCallback((routineId?: string) => {
    const workout = routineId
      ? workoutsService.createFromRoutine(routineId)
      : workoutsService.createEmpty();

    context.setActiveWorkout(workout);
  }, [context]);

  const addExercise = useCallback((exerciseId: string) => {
    context.setActiveWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, { exerciseId, sets: [] }]
    }));
  }, [context]);

  const completeWorkout = useCallback(() => {
    const completed = workoutsService.finalize(context.activeWorkout);
    context.setActiveWorkout(null);
    return completed;
  }, [context]);

  return {
    activeWorkout: context.activeWorkout,
    startWorkout,
    addExercise,
    completeWorkout
  };
}
```

### 7.4 State Synchronization

```typescript
// localStorage sync hook pattern
function useLocalStorageSync<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  const setValue: Dispatch<SetStateAction<T>> = useCallback((value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    localStorage.setItem(key, JSON.stringify(valueToStore));
  }, [key, storedValue]);

  // Sync across tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
```

---

## 8. Service Layer Design

### 8.1 Service Layer Architecture

```
SERVICE LAYER
├── Generic Storage Service
│   ├── get<T>(key: string): T | null
│   ├── set<T>(key: string, value: T): void
│   ├── remove(key: string): void
│   ├── clear(): void
│   └── getAllKeys(): string[]
│
└── Domain Services
    ├── WorkoutsService
    ├── ExercisesService
    ├── RoutinesService
    ├── BodyMetricsService
    ├── NutritionService
    ├── GoalsService
    └── ExportService
```

### 8.2 Generic Storage Service

```typescript
// services/storage/storage.service.ts
interface IStorageService {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
  has(key: string): boolean;
}

class StorageService implements IStorageService {
  private readonly prefix = 'claufefit_';

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key));
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from storage: ${key}`, error);
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to storage: ${key}`, error);
      throw new Error('Storage quota exceeded or access denied');
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.getKey(key));
  }

  clear(): void {
    // Only clear app-specific keys
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
  }

  has(key: string): boolean {
    return localStorage.getItem(this.getKey(key)) !== null;
  }
}

export const storageService = new StorageService();
```

### 8.3 Domain Service Interface Pattern

```typescript
// Base CRUD interface for all domain services
interface CrudService<T, CreateInput, UpdateInput> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(input: CreateInput): Promise<T>;
  update(id: string, input: UpdateInput): Promise<T>;
  delete(id: string): Promise<void>;
}

// Example: Workouts Service
interface WorkoutsService
  extends CrudService<Workout, CreateWorkoutDTO, UpdateWorkoutDTO> {
  getByDateRange(start: Date, end: Date): Promise<Workout[]>;
  getByType(type: WorkoutType): Promise<Workout[]>;
  getByMuscleGroup(muscleGroup: MuscleGroup): Promise<Workout[]>;
  getPersonalRecords(exerciseId: string): Promise<PersonalRecord[]>;
}
```

### 8.4 Service Implementation Example

```typescript
// services/api/workouts.service.ts
import { storageService } from '../storage/storage.service';
import { STORAGE_KEYS } from '../storage/storage.keys';
import type { Workout, Exercise, WorkoutSet } from '@/types';

interface CreateWorkoutDTO {
  date: string;
  duration: number;
  exercises: Array<{
    exerciseId: string;
    sets: Omit<WorkoutSet, 'id'>[];
  }>;
}

interface UpdateWorkoutDTO extends Partial<CreateWorkoutDTO> {}

class WorkoutsService {
  private readonly storageKey = STORAGE_KEYS.WORKOUTS;

  async getAll(): Promise<Workout[]> {
    const data = storageService.get<Workout[]>(this.storageKey);
    return data || [];
  }

  async getById(id: string): Promise<Workout | null> {
    const workouts = await this.getAll();
    return workouts.find(w => w.id === id) || null;
  }

  async create(input: CreateWorkoutDTO): Promise<Workout> {
    const workouts = await this.getAll();

    const newWorkout: Workout = {
      id: crypto.randomUUID(),
      ...input,
      exercises: input.exercises.map((ex, idx) => ({
        exerciseId: ex.exerciseId,
        sets: ex.sets.map((set, setIdx) => ({
          id: `${idx}-${setIdx}-${Date.now()}`,
          ...set
        }))
      }))
    };

    workouts.push(newWorkout);
    storageService.set(this.storageKey, workouts);

    return newWorkout;
  }

  async update(id: string, input: UpdateWorkoutDTO): Promise<Workout> {
    const workouts = await this.getAll();
    const index = workouts.findIndex(w => w.id === id);

    if (index === -1) {
      throw new Error(`Workout not found: ${id}`);
    }

    const updated: Workout = {
      ...workouts[index],
      ...input,
      id // Preserve ID
    };

    workouts[index] = updated;
    storageService.set(this.storageKey, workouts);

    return updated;
  }

  async delete(id: string): Promise<void> {
    const workouts = await this.getAll();
    const filtered = workouts.filter(w => w.id !== id);
    storageService.set(this.storageKey, filtered);
  }

  async getByDateRange(start: Date, end: Date): Promise<Workout[]> {
    const workouts = await this.getAll();
    return workouts.filter(w => {
      const date = new Date(w.date);
      return date >= start && date <= end;
    });
  }

  // Additional domain methods...
}

export const workoutsService = new WorkoutsService();
```

### 8.5 Storage Key Constants

```typescript
// services/storage/storage.keys.ts
export const STORAGE_KEYS = {
  WORKOUTS: 'workouts',
  EXERCISES: 'exercises',
  ROUTINES: 'routines',
  BODY_METRICS: 'body_metrics',
  MEALS: 'meals',
  NUTRITION_TARGETS: 'nutrition_targets',
  GOALS: 'goals',
  PREFERENCES: 'preferences',
  ACTIVE_WORKOUT: 'active_workout'
} as const;
```

### 8.6 Data Export Service

```typescript
// services/api/export.service.ts
class ExportService {
  async exportAllData(): Promise<string> {
    const allData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      data: {
        workouts: await workoutsService.getAll(),
        exercises: await exercisesService.getAll(),
        routines: await routinesService.getAll(),
        bodyMetrics: await bodyMetricsService.getAll(),
        meals: await nutritionService.getAllMeals(),
        nutritionTargets: await nutritionService.getTargets(),
        goals: await goalsService.getAll()
      }
    };

    return JSON.stringify(allData, null, 2);
  }

  async importData(jsonString: string): Promise<void> {
    try {
      const imported = JSON.parse(jsonString);

      // Validate structure (basic)
      if (!imported.data) {
        throw new Error('Invalid import format');
      }

      // Import each domain
      await workoutsService.replaceAll(imported.data.workouts || []);
      await exercisesService.replaceAll(imported.data.exercises || []);
      // ... other domains

    } catch (error) {
      throw new Error(`Import failed: ${error.message}`);
    }
  }

  downloadAsFile(): void {
    this.exportAllData().then(json => {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `claufefit-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }
}

export const exportService = new ExportService();
```

---

## 9. Type System Design

### 9.1 Type Organization

```
types/
├── models.ts          # Domain entities
├── dtos.ts            # Data transfer objects (create/update)
├── api.ts             # API/service response types
├── ui.ts              # UI component prop types
├── enums.ts           # Enumerations and constants
└── index.ts           # Barrel export
```

### 9.2 Core Domain Types

```typescript
// types/models.ts

// === Enums ===
type WorkoutType = 'strength' | 'cardio' | 'flexibility';
type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core';
type GoalType = 'workouts' | 'calories' | 'bodyweight' | 'volume';
type GoalStatus = 'active' | 'completed' | 'missed';

// === Exercise ===
interface Exercise {
  id: string;
  name: string;
  muscleGroups: MuscleGroup[];
  equipment: string;
  type: WorkoutType;
  isCustom?: boolean; // User-added vs built-in
}

// === Workout Set ===
interface WorkoutSet {
  id: string; // Unique per set
  reps: number;
  weight: number;
  duration?: number; // For cardio
}

// === Workout Exercise Entry ===
interface WorkoutExercise {
  exerciseId: string;
  sets: WorkoutSet[];
}

// === Workout ===
interface Workout {
  id: string;
  date: string; // ISO date string
  duration: number; // Minutes
  exercises: WorkoutExercise[];
  notes?: string;
  routineId?: string; // If started from a routine
}

// === Routine ===
interface Routine {
  id: string;
  name: string;
  exercises: RoutineExercise[];
  createdAt: string;
}

interface RoutineExercise {
  exerciseId: string;
  defaultSets: number;
  defaultReps: number;
  defaultWeight: number;
}

// === Body Metrics ===
interface BodyMetric {
  id: string;
  date: string; // ISO date string
  weight?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
}

// === Meal ===
interface Meal {
  id: string;
  date: string; // ISO date string
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

// === Nutrition Targets ===
interface NutritionTargets {
  dailyCalories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// === Goal ===
interface Goal {
  id: string;
  type: GoalType;
  target: number;
  current: number;
  startDate: string; // ISO date
  endDate: string; // ISO date
  status: GoalStatus;
  title?: string; // Custom title override
}

// === Personal Record ===
interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  type: '1RM' | 'volume' | 'duration' | 'weight';
  value: number;
  date: string;
  unit: string;
}

// === Statistics ===
interface VolumeStats {
  weekly: number;
  monthly: number;
  byWeek: Array<{ week: string; volume: number }>;
}

interface StreakStats {
  current: number;
  longest: number;
  lastWorkoutDate: string | null;
}
```

### 9.3 DTO Types

```typescript
// types/dtos.ts

// === Create DTOs ===
interface CreateExerciseDTO {
  name: string;
  muscleGroups: MuscleGroup[];
  equipment: string;
  type: WorkoutType;
}

interface CreateWorkoutDTO {
  date: string;
  duration: number;
  exercises: Array<{
    exerciseId: string;
    sets: Omit<WorkoutSet, 'id'>[];
  }>;
  notes?: string;
}

interface CreateRoutineDTO {
  name: string;
  exercises: Array<{
    exerciseId: string;
    defaultSets: number;
    defaultReps: number;
    defaultWeight: number;
  }>;
}

interface CreateBodyMetricDTO {
  date: string;
  weight?: number;
  measurements?: Partial<BodyMetric['measurements']>;
}

interface CreateMealDTO {
  date: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType?: Meal['mealType'];
}

interface CreateGoalDTO {
  type: GoalType;
  target: number;
  startDate: string;
  endDate: string;
  title?: string;
}

// === Update DTOs (partial) ===
type UpdateExerciseDTO = Partial<CreateExerciseDTO>;
type UpdateWorkoutDTO = Partial<CreateWorkoutDTO>;
type UpdateRoutineDTO = Partial<CreateRoutineDTO>;
type UpdateBodyMetricDTO = Partial<CreateBodyMetricDTO>;
type UpdateMealDTO = Partial<CreateMealDTO>;
type UpdateGoalDTO = Partial<CreateGoalDTO>;
```

### 9.4 Utility Types

```typescript
// types/utils.ts

// Make all properties optional recursively
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Extract IDs from an array
type Ids<T extends { id: string }> = Array<T['id']>;

// Omit id from create operations
type WithoutId<T> = Omit<T, 'id'>;

// For select/autocomplete components
type SelectOption<T = string> = {
  value: T;
  label: string;
};

// API Response wrapper (for future expansion)
type ApiResponse<T> = {
  data: T;
  error?: string;
};
```

---

## 10. Performance Optimization

### 10.1 Performance Strategies

```
PERFORMANCE OPTIMIZATION AREAS
├── Bundle Size
│   ├── Route-based code splitting
│   ├── Lazy loading for heavy components (charts)
│   └── Tree shaking for unused exports
│
├── Rendering
│   ├── React.memo for expensive components
│   ├── useMemo for expensive calculations
│   └── useCallback for stable function references
│
├── Data Access
│   ├── Indexed localStorage reads
│   ├── Debounced search/filter inputs
│   └── Optimistic UI updates
│
└── User Experience
    ├── Skeleton loading states
    ├── Progressive image loading (if needed)
    └── Smooth transitions with CSS animations
```

### 10.2 Code Splitting Strategy

```typescript
// Lazy load routes with Suspense boundaries
import { lazy, Suspense } from 'react';

const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'));
const ProgressPage = lazy(() => import('@/features/progress/ProgressPage'));

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/progress" element={<ProgressPage />} />
      </Routes>
    </Suspense>
  );
}
```

### 10.3 Memoization Guidelines

```typescript
// When to use React.memo:
// 1. Components that re-render often with same props
// 2. Components with expensive render logic
// 3. Components in lists with many items

export const WorkoutCard = React.memo(({ workout }: { workout: Workout }) => {
  // Component implementation
}, (prev, next) => prev.workout.id === next.workout.id);

// When to use useMemo:
// 1. Expensive calculations (filtering large arrays, complex math)
// 2. Derived data that shouldn't change on every render

const filteredWorkouts = useMemo(() =>
  workouts.filter(w => w.type === selectedType),
  [workouts, selectedType]
);

// When to use useCallback:
// 1. Functions passed to memoized child components
// 2. Functions used as useEffect dependencies

const handleDelete = useCallback((id: string) => {
  workoutsService.delete(id);
  refetch();
}, [refetch]);
```

### 10.4 localStorage Optimization

```typescript
// Optimizations for localStorage operations:

// 1. Batch writes - collect changes and write once
class BatchStorageWriter {
  private batch: Map<string, any> = new Map();

  add<T>(key: string, value: T): void {
    this.batch.set(key, value);
  }

  flush(): void {
    // Single operation flush
    this.batch.forEach((value, key) => {
      storageService.set(key, value);
    });
    this.batch.clear();
  }
}

// 2. Index for quick lookups
interface WorkoutIndex {
  byId: Record<string, Workout>;
  byDate: Record<string, string[]>; // Date -> Workout IDs
  byType: Record<string, string[]>; // Type -> Workout IDs
}

// 3. Pagination for large datasets
interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

### 10.5 Virtual Scrolling (Future Enhancement)

For lists that may grow very large (e.g., workout history):

```typescript
// Consider adding virtual scrolling for long lists
// Libraries: react-window or react-virtuoso
// Apply to: WorkoutList, ExerciseList, MealList
```

---

## 11. Architecture Decision Records

### ADR-001: Feature-Based Folder Structure

**Status:** Accepted

**Context:**
The application has multiple distinct feature areas (workouts, nutrition, goals, etc.) that will be developed by potentially multiple team members. We need a scalable folder structure.

**Decision:**
Use a feature-based folder structure under `/src/features/` where each feature contains its own pages, components, and hooks. Shared components live under `/src/components/`.

**Consequences:**

*Positive:*
- Clear feature boundaries enable parallel development
- Easier to locate code for specific functionality
- Supports team scaling without merge conflicts
- Each feature can be understood in isolation

*Negative:*
- Some duplication may occur for similar patterns
- Shared components need clear ownership

**Implementation:**
See Section 4.1 for complete folder structure.

---

### ADR-002: React Context Over State Management Library

**Status:** Accepted

**Context:**
We need to manage global state for user preferences and active workout session. Options include: Redux, Zustand, Jotai, or React Context.

**Decision:**
Use React Context with custom hooks for state management. No external state management library.

**Consequences:**

*Positive:*
- No additional dependencies
- Adequate for localStorage-based data size
- Simple mental model for team onboarding
- Leverages React's built-in capabilities

*Negative:*
- No time-travel debugging
- Manual optimization for re-renders
- No built-in dev tools

**Mitigation:**
- Use React DevTools for state inspection
- Implement proper memoization patterns
- Keep context state minimal

---

### ADR-003: Service Layer for Data Access

**Status:** Accepted

**Context:**
Data is stored in localStorage. Components need to perform CRUD operations. We could access localStorage directly from components or create an abstraction layer.

**Decision:**
Create a service layer with dedicated classes for each domain (workouts, exercises, etc.) that encapsulate all data access logic.

**Consequences:**

*Positive:*
- Components remain presentation-focused
- Easy to swap storage implementation (e.g., migrate to IndexedDB)
- Centralized error handling for storage operations
- Easier unit testing with mock services

*Negative:*
- Additional abstraction layer to maintain
- Slightly more boilerplate code

**Implementation:**
See Section 8 for service layer design.

---

### ADR-004: Client-Side Only Architecture

**Status:** Accepted

**Context:**
The requirements specify no backend, all data in localStorage. The app must work offline.

**Decision:**
Design as a pure client-side SPA with no API calls. All data persistence via localStorage.

**Consequences:**

*Positive:*
- Zero infrastructure costs
- True offline capability
- Zero network latency
- Complete data ownership for users

*Negative:*
- Data limited to device
- No cross-device sync
- localStorage has size limits (~5-10MB)
- Data loss if browser cache is cleared

**Mitigation:**
- Provide data export/import functionality
- Warn users before clearing data
- Keep data structures efficient to stay within limits
- Consider IndexedDB for future if needed

---

### ADR-005: Route-Based Code Splitting

**Status:** Accepted

**Context:**
The app has multiple pages that users may not visit in a single session. Loading all JavaScript upfront is inefficient.

**Decision:**
Implement route-based code splitting using React.lazy() and Suspense. Each route page is loaded on-demand.

**Consequences:**

*Positive:*
- Smaller initial bundle size
- Faster first contentful paint
- Better perceived performance

*Negative:**
- Slight delay on first navigation to each route
- Additional code to handle loading states

**Mitigation:**
- Provide skeleton loading states
- Pre-fetch likely next routes

---

### ADR-006: TypeScript Strict Mode

**Status:** Accepted

**Context:**
Type safety is a priority. TypeScript offers multiple strictness levels.

**Decision:**
Enable `strict: true` in tsconfig.json with all additional strict flags enabled.

**Consequences:**

*Positive:*
- Catch more errors at compile time
- Better IDE autocomplete
- Self-documenting code
- Safer refactoring

*Negative:**
- Initial setup takes more time
- Some learning curve for team members

**Implementation:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  }
}
```

---

### ADR-007: CSS Variables for Design Tokens

**Status:** Accepted

**Context:**
The design system uses specific colors and themes. Need a maintainable way to manage design tokens across Tailwind and custom CSS.

**Decision:**
Define all design tokens as CSS variables, then reference them in Tailwind config.

**Consequences:**

*Positive:**
- Single source of truth for design tokens
- Runtime theme switching possible
- Design tokens accessible in vanilla CSS
- Clear separation of design values

*Negative:**
- Additional build step consideration

**Implementation:**
```css
:root {
  --background: #050505;
  --foreground: #f0f0f0;
  /* ... */
}
```

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      background: 'var(--background)',
      foreground: 'var(--foreground)',
      // ...
    }
  }
}
```

---

## Appendix: Implementation Checklist

### Phase 1: Foundation
- [ ] Initialize Vite + React + TypeScript project
- [ ] Configure Tailwind CSS with custom theme
- [ ] Set up folder structure
- [ ] Create base UI components (Button, Card, Input, Modal)
- [ ] Implement storage service
- [ ] Set up React Router

### Phase 2: Core Features
- [ ] Exercise library with pre-built data
- [ ] Workout CRUD operations
- [ ] Active workout session management
- [ ] Workout history and filtering

### Phase 3: Extended Features
- [ ] Routine templates
- [ ] Progress tracking with charts
- [ ] Body metrics logging
- [ ] Nutrition tracking
- [ ] Goal setting

### Phase 4: Polish
- [ ] Responsive design refinements
- [ ] Animations and transitions
- [ ] Data export/import
- [ ] Error handling
- [ ] Loading states

---

## Document Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2025-02-11 | Initial architecture document | Technical Architect |
