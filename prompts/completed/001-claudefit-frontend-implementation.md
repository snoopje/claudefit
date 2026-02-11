<objective>
Implement ClaudeFit, a comprehensive fitness tracker web application with a "Dark Industrial" design theme. This is a client-side only application using React + Vite + TypeScript + Tailwind CSS, with all data persisted in browser localStorage.

The application must be visually striking with a premium, minimal aesthetic inspired by brutalist web design and high-end fitness brands. Key visual characteristics: near-black backgrounds, lime/chartreuse accent (#c8ff00), sharp geometry (no rounded corners), monospace labels, and subtle noise texture overlay.
</objective>

<context>
@docs/requirements.md - Complete product requirements document
@docs/architecture.md - System architecture (created by systems-architect)
@docs/data-layer-design.md - Data models and service layer (created by backend dev)
@docs/ui-ux-design-system.md - Complete UI/UX specifications (created by UX/UI designer)

Tech Stack:
- React 18+ with TypeScript in strict mode
- Vite as build tool
- Tailwind CSS for styling
- React Router for routing
- Recharts for data visualization
- localStorage for data persistence

The design team has created comprehensive specifications. Your job is to translate these into working, production-ready code.
</context>

<requirements>
Implement the following features as specified in the requirements:

1. DASHBOARD (Route: /)
   - Recent workouts list (last 5)
   - Current workout streak display
   - Weekly volume summary
   - Active goals with progress bars
   - Today's nutrition vs targets
   - Recent personal records

2. WORKOUT TRACKING (Route: /workouts)
   - Start new workout (blank or from routine)
   - In-progress workout session with:
     - Exercise list with add/remove
     - Set logger (reps, weight, duration)
     - Configurable rest timer
     - Exercise notes
   - Complete workout to save

3. WORKOUT HISTORY (Route: /workouts/history)
   - Chronological list of all workouts
   - Filter by date range, type, muscle group
   - View workout detail
   - Delete workout

4. EXERCISE LIBRARY (Route: /exercises)
   - Pre-built exercises (seed data)
   - Categorized by muscle group
   - Search and filter
   - Add custom exercises

5. ROUTINES (Route: /routines)
   - Create/edit/delete workout templates
   - Start workout from routine
   - Routine list with usage stats

6. PROGRESS (Route: /progress)
   - Charts: weight over time per exercise
   - Personal records (1RM, max volume, etc.)
   - Weekly/monthly volume summaries
   - Workout frequency and streak

7. BODY METRICS (Route: /body-metrics)
   - Log bodyweight and measurements
   - Chart trends over time

8. NUTRITION (Route: /nutrition)
   - Log meals with calories and macros
   - Set daily targets
   - Daily/weekly summaries
   - Quick-add common foods

9. GOALS (Route: /goals)
   - Create weekly/monthly goals
   - Track progress with visual indicators
   - Mark goals as completed/missed

10. SETTINGS (Route: /settings)
    - Data export (JSON)
    - Data import (missing from requirements - MUST add)
    - Clear all data
    - User preferences (units, theme, rest timer default)
</requirements>

<design_system>
STRICTLY ADHERE TO THE "DARK INDUSTRIAL" THEME:

COLOR PALETTE (use CSS variables):
- --background: #050505 (page background)
- --foreground: #f0f0f0 (primary text)
- --lime: #c8ff00 (primary accent - CTAs, highlights, active states)
- --lime-dim: #a3cc00 (dimmed lime)
- --ember: #ff4d00 (secondary accent)
- --surface: #0e0e0e (card backgrounds)
- --surface-elevated: #1a1a1a (borders, hover states)
- --muted: #666666 (tertiary text)
- --text-secondary: #888888
- --text-dim: #555555
- --text-ghost: #333333
- --text-invisible: #222222

TYPOGRAPHY (import from Google Fonts):
- Outfit (300-900): Body text, navigation, UI labels
- Bebas Neue (400): Large headings, DISPLAY ONLY, always uppercase
- JetBrains Mono (400-600): Small labels, tags, metadata, always uppercase, wide letter-spacing (0.2em)

COMPONENT RULES:
- NO rounded corners on buttons or cards (rounded-none or max 1px)
- Sharp rectangles with clipped/notched corners where appropriate
- Monospace category tags with "/" prefix (e.g., "/ WORKOUTS")
- Lime accent used sparingly - never for large backgrounds
- Hover: translateY(-2px to -6px) with lime glow
- Selection: lime background with dark text

VISUAL EFFECTS:
- Grain/noise overlay: body::before with SVG feTurbulence at 3.5% opacity, z-index: 9999, pointer-events: none
- Ambient glow blobs: large colored divs with blur-130px to blur-150px, opacity 0.03-0.04
- Grid overlay on some sections: linear-gradient grid lines at 0.03 opacity

ANIMATION EASING:
- Always use: cubic-bezier(0.16, 1, 0.3, 1) - spring-like curve
- Staggered entry: 0.12s increments between elements

RESPONSIVE:
- Mobile-first approach
- Max content width: max-w-7xl (1280px)
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
</design_system>

<implementation>
PROJECT STRUCTURE:
```
/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── vite-env.d.ts
    ├── types/
    │   ├── exercise.ts
    │   ├── workout.ts
    │   ├── routine.ts
    │   ├── bodyMetrics.ts
    │   ├── nutrition.ts
    │   ├── goal.ts
    │   └── index.ts
    ├── services/
    │   ├── storage.ts
    │   ├── exercises.ts
    │   ├── workouts.ts
    │   ├── routines.ts
    │   ├── bodyMetrics.ts
    │   ├── nutrition.ts
    │   ├── goals.ts
    │   └── export.ts
    ├── hooks/
    │   ├── useLocalStorage.ts
    │   ├── useExercises.ts
    │   ├── useWorkouts.ts
    │   ├── useRoutines.ts
    │   ├── useBodyMetrics.ts
    │   ├── useNutrition.ts
    │   └── useGoals.ts
    ├── components/
    │   ├── ui/
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── Card.tsx
    │   │   ├── Modal.tsx
    │   │   ├── Badge.tsx
    │   │   └── index.ts
    │   ├── layout/
    │   │   ├── Navigation.tsx
    │   │   ├── BottomNav.tsx
    │   │   └── MainLayout.tsx
    │   └── charts/
    │       ├── LineChart.tsx
    │       ├── BarChart.tsx
    │       └── ProgressChart.tsx
    ├── features/
    │   ├── dashboard/
    │   ├── workouts/
    │   ├── exercises/
    │   ├── routines/
    │   ├── progress/
    │   ├── body-metrics/
    │   ├── nutrition/
    │   ├── goals/
    │   └── settings/
    └── styles/
        └── global.css
```

CRITICAL IMPLEMENTATION NOTES:

1. DATA IMPORT: The requirements mention export but NOT import. You MUST implement both for data portability.

2. localStorage QUOTA: Implement quota detection and graceful degradation. Use a try-catch wrapper for localStorage operations.

3. STORAGE EVENTS: Listen to 'storage' events to sync state across browser tabs.

4. ID GENERATION: Use crypto.randomUUID() or a simple timestamp-based ID generator.

5. DATE HANDLING: Store all dates as ISO strings. Use UTC for consistency, display in local timezone.

6. VALIDATION: Implement input validation for all forms (positive numbers for weight/reps, reasonable ranges).

7. SEED DATA: Include pre-built exercises for the exercise library.

8. PERFORMANCE:
   - Use React.lazy() for route-based code splitting
   - Memoize expensive computations
   - Use virtual scrolling for long lists if needed

9. ACCESSIBILITY:
   - All interactive elements must be keyboard navigable
   - Use semantic HTML
   - Include aria-labels where needed
   - Focus management in modals

10. TESTING: Create test files for key components and services.
</implementation>

<output>
Create the following files:

**Project Setup:**
- package.json - All dependencies
- vite.config.ts - Vite configuration
- tsconfig.json - TypeScript strict config
- tailwind.config.js - Tailwind with Dark Industrial theme
- postcss.config.js
- index.html - With Google Fonts imports

**Core Application:**
- src/main.tsx - Entry point
- src/App.tsx - Root with Router
- src/index.css - Global styles with CSS variables, grain overlay
- src/vite-env.d.ts

**Types:** (Use interfaces from data-layer-design.md)
- src/types/exercise.ts
- src/types/workout.ts
- src/types/routine.ts
- src/types/bodyMetrics.ts
- src/types/nutrition.ts
- src/types/goal.ts
- src/types/index.ts

**Services:** (Implement localStorage abstraction)
- src/services/storage.ts - Base storage service
- src/services/exercises.ts
- src/services/workouts.ts
- src/services/routines.ts
- src/services/bodyMetrics.ts
- src/services/nutrition.ts
- src/services/goals.ts
- src/services/export.ts - Export/Import functionality

**Hooks:**
- src/hooks/useLocalStorage.ts
- src/hooks/useExercises.ts
- src/hooks/useWorkouts.ts
- src/hooks/useRoutines.ts
- src/hooks/useBodyMetrics.ts
- src/hooks/useNutrition.ts
- src/hooks/useGoals.ts

**UI Components:**
- src/components/ui/Button.tsx - Primary, Secondary, Ghost variants
- src/components/ui/Input.tsx - Text, Number, Select, Textarea
- src/components/ui/Card.tsx - Base card with hover effects
- src/components/ui/Modal.tsx - With backdrop and focus trap
- src/components/ui/Badge.tsx - Monospace style tags
- src/components/ui/ProgressBar.tsx - Lime accent progress
- src/components/ui/RestTimer.tsx - Configurable countdown
- src/components/ui/index.ts

**Layout:**
- src/components/layout/Navigation.tsx - Top nav (desktop)
- src/components/layout/BottomNav.tsx - Bottom nav (mobile)
- src/components/layout/MainLayout.tsx - Layout wrapper

**Charts:**
- src/components/charts/LineChart.tsx - Recharts wrapper
- src/components/charts/BarChart.tsx - Recharts wrapper

**Features:** (Implement each route)
- src/features/dashboard/Dashboard.tsx
- src/features/dashboard/DashboardStats.tsx
- src/features/workouts/WorkoutList.tsx
- src/features/workouts/ActiveWorkout.tsx
- src/features/workouts/WorkoutDetail.tsx
- src/features/exercises/ExerciseLibrary.tsx
- src/features/exercises/ExerciseCard.tsx
- src/features/routines/RoutineList.tsx
- src/features/routines/RoutineForm.tsx
- src/features/progress/ProgressView.tsx
- src/features/progress/ChartsSection.tsx
- src/features/body-metrics/BodyMetricsLog.tsx
- src/features/body-metrics/MetricsChart.tsx
- src/features/nutrition/NutritionLog.tsx
- src/features/nutrition/MealForm.tsx
- src/features/nutrition/DailySummary.tsx
- src/features/goals/GoalsList.tsx
- src/features/goals/GoalForm.tsx
- src/features/settings/SettingsView.tsx
- src/features/settings/DataExport.tsx
- src/features/settings/DataImport.tsx

**Styles:**
- src/styles/global.css - Theme-specific styles, animations
</output>

<verification>
Before declaring complete, verify:

1. All dependencies are correctly specified in package.json
2. Tailwind config includes all Dark Industrial colors as CSS variables
3. Google Fonts are imported (Outfit, Bebas Neue, JetBrains Mono)
4. Grain overlay is implemented in global.css
5. All routes are accessible and render without errors
6. localStorage operations have error handling
7. Data export AND import are functional
8. Responsive design works on mobile and desktop
9. All forms have validation
10. Rest timer functions correctly

Test the application:
- Run `npm run dev`
- Navigate through all routes
- Create a workout and complete it
- Add a custom exercise
- Create a routine
- Log nutrition
- Set a goal
- Export and import data
- Check responsive behavior at different screen sizes
</verification>

<success_criteria>
- Application starts without errors
- All 10 routes are functional
- Dark Industrial theme is consistently applied
- Data persists across page refreshes
- Export/Import works correctly
- Mobile and desktop layouts work
- All forms validate input
- Charts render with data
- Accessibility: keyboard navigation works, focus management in modals
- No console errors or warnings
</success_criteria>
