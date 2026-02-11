# Fitness Tracker App — Product Requirements Document

## 1. Overview

A modern fitness tracker application for logging workouts, tracking progress, managing nutrition, and setting goals. All data is persisted in browser local storage — there is no backend server and no authentication. The app is fully functional as a standalone client-side application.

## 2. Core Features

### 2.1 Workout Tracking

- Log exercises with sets, reps, weight, and duration
- Support three workout types: strength training, cardio, and flexibility
- Add custom exercises on the fly
- In-progress workout view with a configurable rest timer (user sets duration)

### 2.2 Exercise Library

- Pre-built catalogue of common exercises
- Categorized by muscle group: chest, back, legs, shoulders, arms, core
- Each exercise includes:
  - Name
  - Target muscle group(s)
  - Equipment needed
  - Type (strength / cardio / flexibility)
- Users can add custom exercises to the library

### 2.3 Workout History

- Chronological list of all completed workouts
- Filter by date range, workout type, and muscle group
- View a detailed breakdown of any past workout
- Delete past workouts

### 2.4 Progress Tracking & Statistics

- Charts showing weight lifted over time per exercise
- Personal records: estimated 1RM, max volume, longest duration
- Weekly and monthly volume summaries
- Workout frequency and streak tracking

### 2.5 Routine Management

- Create and save workout templates (routines)
- Start a workout from a saved routine (pre-populates exercises, sets, reps, and weight)
- Edit and delete routines

### 2.6 Body Metrics

- Log bodyweight over time
- Log body measurements: chest, waist, hips, arms, thighs
- Chart trends over time for all metrics

### 2.7 Nutrition Tracking

- Log daily meals with calories and macros (protein, carbs, fat)
- Set daily calorie and macro targets
- View daily and weekly nutrition summaries
- Quick-add for common foods

### 2.8 Goal Setting

- Set weekly or monthly goals (e.g., workouts per week, calories per day, target bodyweight)
- Track progress toward each goal
- Visual progress indicators (progress bars)

### 2.9 Dashboard

- At-a-glance summary: recent workouts, current streak, weekly volume
- Active goals with progress indicators
- Today's nutrition summary compared to targets
- Recent personal records

## 3. Data Model

### Exercise

| Field        | Type     | Description                            |
| ------------ | -------- | -------------------------------------- |
| id           | string   | Unique identifier                      |
| name         | string   | Exercise name                          |
| muscleGroups | string[] | Targeted muscle groups                 |
| equipment    | string   | Required equipment (or "none")         |
| type         | string   | "strength", "cardio", or "flexibility" |

### Workout

| Field     | Type   | Description                 |
| --------- | ------ | --------------------------- |
| id        | string | Unique identifier           |
| date      | string | ISO date of the workout     |
| duration  | number | Total duration in minutes   |
| exercises | array  | List of exercises performed |

Each entry in `exercises`:

| Field      | Type   | Description            |
| ---------- | ------ | ---------------------- |
| exerciseId | string | Reference to Exercise  |
| sets       | array  | List of sets performed |

Each entry in `sets`:

| Field    | Type   | Description                  |
| -------- | ------ | ---------------------------- |
| reps     | number | Number of repetitions        |
| weight   | number | Weight used (in user units)  |
| duration | number | Duration in seconds (cardio) |

### Routine

| Field     | Type   | Description                |
| --------- | ------ | -------------------------- |
| id        | string | Unique identifier          |
| name      | string | Routine name               |
| exercises | array  | List of exercise templates |

Each entry in `exercises`:

| Field         | Type   | Description              |
| ------------- | ------ | ------------------------ |
| exerciseId    | string | Reference to Exercise    |
| defaultSets   | number | Suggested number of sets |
| defaultReps   | number | Suggested reps per set   |
| defaultWeight | number | Suggested weight         |

### BodyMetric

| Field        | Type   | Description                                          |
| ------------ | ------ | ---------------------------------------------------- |
| id           | string | Unique identifier                                    |
| date         | string | ISO date of the measurement                          |
| weight       | number | Bodyweight                                           |
| measurements | object | `{ chest, waist, hips, arms, thighs }` (all numbers) |

### MealEntry

| Field    | Type   | Description            |
| -------- | ------ | ---------------------- |
| id       | string | Unique identifier      |
| date     | string | ISO date               |
| name     | string | Meal or food name      |
| calories | number | Total calories         |
| protein  | number | Grams of protein       |
| carbs    | number | Grams of carbohydrates |
| fat      | number | Grams of fat           |

### NutritionTarget

| Field         | Type   | Description              |
| ------------- | ------ | ------------------------ |
| dailyCalories | number | Daily calorie target     |
| protein       | number | Daily protein target (g) |
| carbs         | number | Daily carbs target (g)   |
| fat           | number | Daily fat target (g)     |

### Goal

| Field     | Type   | Description                                                |
| --------- | ------ | ---------------------------------------------------------- |
| id        | string | Unique identifier                                          |
| type      | string | Goal category (e.g., "workouts", "calories", "bodyweight") |
| target    | number | Target value                                               |
| current   | number | Current progress value                                     |
| startDate | string | ISO start date                                             |
| endDate   | string | ISO end date                                               |
| status    | string | "active", "completed", or "missed"                         |

## 4. Tech Stack

- **Framework:** React (with Vite as the build tool)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Storage:** Browser local storage (no backend)
- **Charting:** Recharts (lightweight, React-native charting library)
- **Routing:** React Router

**Important:** Initialize the project in the root of the repository. Do not create a subfolder for the app.

## 5. Non-Functional Requirements

- **Responsive, mobile-first design** — usable on phones, tablets, and desktops
- **Works offline** — all data stored in browser local storage; no network requests required
- **Fast** — zero network latency; all reads and writes are local
- **Data export** — users can export all data as JSON for backup and portability

---

## 6. UI Style Guide — "Dark Industrial" Theme

This section describes the exact visual design system in enough detail that any developer or AI agent can faithfully recreate the look and feel in a new project.

### 6.1 Design Philosophy

The aesthetic is **dark, industrial, and minimal** — inspired by high-end fitness brands, brutalist web design, and terminal/hacker culture. The overall feel is premium, restrained, and editorial. Key principles:

- **Near-black backgrounds** with almost no white — the UI breathes through negative space, not brightness.
- **One bold accent colour (lime/chartreuse)** used sparingly for emphasis, CTAs, and data highlights.
- **A secondary warm accent (ember/orange-red)** used for secondary sections (e.g. "How it Works" steps) to break monotony without fighting the primary accent.
- **Sharp geometry** — no rounded corners on cards or buttons (use `rounded-none` or very small radii). Corners are clipped, notched, or accented with small L-shaped borders.
- **Monospaced labels** for metadata, categories, and small UI annotations to give a data/terminal feel.
- **Subtle texture** — a noise/grain overlay sits on top of the entire page at very low opacity. Background "glow" blobs float behind content to add depth without distraction.

### 6.2 Colour Palette

| Token                | Hex       | Usage                                                      |
| -------------------- | --------- | ---------------------------------------------------------- |
| `--background`       | `#050505` | Page background (near-black, not pure black)               |
| `--foreground`       | `#f0f0f0` | Primary text (off-white, not pure white)                   |
| `--lime`             | `#c8ff00` | Primary accent — CTAs, highlights, active states, glow     |
| `--lime-dim`         | `#a3cc00` | Dimmed lime for gradient endpoints and secondary lime uses |
| `--ember`            | `#ff4d00` | Secondary accent — step numbers, alternate section headers |
| `--surface`          | `#0e0e0e` | Card and elevated surface backgrounds                      |
| `--surface-elevated` | `#1a1a1a` | Borders, dividers, and higher-elevation surfaces           |
| `--muted`            | `#666666` | Muted/tertiary text (nav links, descriptions)              |
| `--text-secondary`   | `#888888` | Secondary body text                                        |
| `--text-dim`         | `#555555` | Dimmer descriptive text                                    |
| `--text-ghost`       | `#333333` | Ghost text — numbering, watermarks, decorative labels      |
| `--text-invisible`   | `#222222` | Near-invisible text for copyright and metadata             |

**Key colour rules:**

- Backgrounds step up in brightness: `#050505` → `#0a0a0a` → `#0e0e0e` → `#111111` (on hover).
- Borders are always `#1a1a1a` or `white` at very low opacity (`white/[0.04]`).
- The lime accent (`#c8ff00`) should never be used for large surfaces — only for text highlights, small icons, thin borders, indicator dots, and buttons.
- Text selection colour is lime background with dark text.

### 6.3 Typography

Three font families are used, each with a distinct role:

| Font               | Import                         | Role                                                                                                                                                                                      |
| ------------------ | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Outfit**         | Google Fonts — weights 300–900 | Primary body font (sans-serif). Used for all body text, navigation, descriptions, and UI labels.                                                                                          |
| **Bebas Neue**     | Google Fonts — weight 400      | Display/heading font. Used exclusively for large hero headings, section titles, and stat numbers. Always `uppercase`, tight line-height (`0.95`), slight letter-spacing (`0.02em`).       |
| **JetBrains Mono** | Google Fonts — weights 400–600 | Monospace font for small labels, category tags, metadata annotations, footer links, and data readouts. Always `uppercase`, wide letter-spacing (`0.2em–0.3em`), small size (`10px–11px`). |

**Font size approach:**

- Hero headings use `clamp(3rem, 8vw, 6.5rem)` for fluid responsive sizing.
- Section headings use `clamp(2.5rem, 6vw, 5rem)`.
- Body text is `base` (16px) or `lg` (18px).
- Small labels and monospace annotations are `10px–13px`.
- All headings and labels are `uppercase`.

### 6.4 Spacing & Layout

- **Max content width:** `max-w-7xl` (80rem / 1280px), centred with `mx-auto`.
- **Horizontal padding:** `px-6` on mobile, `lg:px-8` on desktop.
- **Section vertical padding:** `py-32` (8rem) for major sections — generous whitespace between sections.
- **Grid gaps:** `gap-4` to `gap-6` between grid items; `gap-[1px]` with a coloured background (`bg-[#1a1a1a]`) for "border-separated" grid layouts (the feature card grid uses this technique).
- **Cards:** Use `p-8` to `p-10` inner padding; `sm:p-10` to `sm:p-16` on larger screens.
- **Navigation:** Fixed to top, `py-4` vertical padding, `border-b border-white/[0.04]`.

### 6.5 Component Patterns

#### Navigation Bar

- Fixed position, full-width, blurred background (`backdrop-filter: blur(20px) saturate(160%)`).
- Semi-transparent background: `bg-[#050505]/80`.
- Very subtle bottom border: `border-white/[0.04]`.
- Logo on left (brand text with lime accent on second word), centred nav links (desktop), CTA button on right.
- Nav links: `text-[13px]`, `font-medium`, `text-[#666]`, `rounded-full` hover background at `white/[0.04]`.

#### Buttons (CTAs)

- **Primary:** Lime background (`bg-[#c8ff00]`), dark text (`text-[#050505]`), `font-bold`, `uppercase`, wide `tracking-wider`, `text-[13px]`. **No border-radius** (`rounded-none` — sharp rectangular).
- On hover: upward lift (`translateY(-2px)`), lime glow shadow (`box-shadow: 0 0 30px rgba(200,255,0,0.25)`), diagonal stripe overlay appears.
- On active: slight scale down (`scale-[0.97]`).
- **Secondary/Ghost:** Transparent with `border border-[#1a1a1a]`, same text sizing, `text-[#666]`, border brightens on hover.

#### Cards (Feature Cards)

- Background: `#0a0a0a`, no border-radius.
- On hover: lifts up (`translateY(-6px)`), background brightens to `#111`, a thin lime left-border animates from 0 to full height, subtle lime box-shadow appears.
- Card grid uses a `gap-[1px] bg-[#1a1a1a]` parent to create thin border lines between cards (instead of individual card borders).

#### Step/Process Cards

- Clipped corner via `clip-path: polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)` — top-right corner is "notched".
- Small L-shaped accent borders in the top-left corner (two thin `div`s — one horizontal, one vertical — in the accent colour at low opacity).
- Large faded step number in display font at low opacity (`text-[#ff4d00]/20`).

#### Section Headers

- Monospace category tag above the heading: `font-mono text-[11px] tracking-[0.3em] uppercase` in the accent colour, prefixed with `/ ` (e.g., `/ Capabilities`).
- Display heading below in Bebas Neue, fluid size, with a coloured period/full-stop at the end of the heading as a design detail.
- Optional body paragraph beneath: `text-[#666]`, `max-w-lg`, `leading-relaxed`.

#### Stat Numbers

- Bebas Neue display font, fluid `clamp()` sizing.
- `font-variant-numeric: tabular-nums` for alignment.
- Alternate between lime and white colouring for visual rhythm.
- Small monospace label beneath in `text-[#555]`.

### 6.6 Visual Effects & Textures

#### Grain/Noise Overlay

A full-page fixed `::before` pseudo-element on `<body>` with an inline SVG `feTurbulence` noise pattern at `opacity: 0.035`. This adds a subtle film-grain texture over the entire UI. It sits at `z-index: 9999` and is `pointer-events: none`.

#### Ambient Background Glows

Large, soft, coloured blobs positioned with `position: absolute/fixed`, very large `blur` values (`blur-[130px]` to `blur-[150px]`), and extremely low opacity (`0.03–0.04`). These create a moody atmospheric depth without drawing attention. Colours used: lime and ember.

#### Diagonal Stripe Pattern

A subtle `repeating-linear-gradient` at `-45deg` with the lime accent at `0.03` opacity, used as a background pattern on alternate sections (e.g., stat bars).

#### Grid Overlay on Images

A CSS grid pattern overlaid on hero images using `linear-gradient` lines at `0.03` opacity in the lime colour, with a `40px` grid cell size. Creates a data/surveillance aesthetic.

#### Scrolling Marquee

A horizontal strip of monospace text labels separated by `/` dividers, animated with `translateX` to scroll infinitely. Text is `text-[#333]`, dividers are `text-[#c8ff00]/30`.

### 6.7 Animations & Motion

All animations use a **spring-like easing** curve: `cubic-bezier(0.16, 1, 0.3, 1)` — fast start, gentle overshoot, smooth settle.

| Animation Class                     | Effect                          | Duration | Delay                        |
| ----------------------------------- | ------------------------------- | -------- | ---------------------------- |
| `.anim-up`                          | Fade in + slide up 40px         | 0.9s     | 0s                           |
| `.anim-up-d1` through `.anim-up-d5` | Same as above                   | 0.9s     | 0.12s increments (staggered) |
| `.anim-right`                       | Fade in + slide from right 60px | 1.0s     | 0.3s                         |
| `.anim-scale`                       | Fade in + scale from 0.9 to 1   | 0.8s     | 0.2s                         |

- **Staggered entry:** Hero elements use incrementally delayed animations (`.anim-up-d1`, `-d2`, etc.) so content cascades in from top to bottom.
- **Hover transitions:** Cards and buttons use `0.4s–0.5s` transitions with the same spring easing.
- **Pulse bars:** Small decorative audio-visualiser bars animate with a `scaleY` pulse at `1s` infinite, staggered per bar.
- **CTA glow:** On hover, lime buttons gain a pulsing `box-shadow` glow.

### 6.8 Responsive Behaviour

- **Mobile-first** — single column layouts stack vertically, centred text.
- **`sm:` (640px+):** Two-column grids for stats, side-by-side CTA buttons.
- **`md:` (768px+):** Navigation centre links become visible.
- **`lg:` (1024px+):** Hero switches to side-by-side layout (text left, image right), text aligns left, three-column feature grid.
- **Fluid typography** via `clamp()` ensures headings scale smoothly between mobile and desktop.

### 6.9 Quick-Start Checklist for Recreating This Theme

1. **Import fonts:** Outfit (300–900), Bebas Neue, JetBrains Mono (400–600) from Google Fonts.
2. **Set CSS variables** for the colour palette listed above.
3. **Set body** to `background: #050505; color: #f0f0f0; font-family: 'Outfit', sans-serif;`.
4. **Add grain overlay** via a `body::before` pseudo-element with an SVG `feTurbulence` filter at ~3.5% opacity.
5. **Use Tailwind CSS** with the custom theme tokens mapped to the CSS variables.
6. **All headings** use Bebas Neue, uppercase, tight line-height (0.95).
7. **All small labels/tags** use JetBrains Mono, uppercase, wide letter-spacing (0.2em+).
8. **Buttons and cards** have no border-radius (sharp rectangles).
9. **Accent colour** is `#c8ff00` — use it for CTAs, highlights, indicator dots, and glowing text. Never for large background areas.
10. **Add ambient glow blobs** behind content with large blur and ~3–4% opacity.
11. **Use `clamp()`** for heading font sizes to ensure fluid responsiveness.
12. **Animation easing:** always `cubic-bezier(0.16, 1, 0.3, 1)` for a premium spring feel.
13. **Borders** are `#1a1a1a` or `white` at 4% opacity — never visible enough to feel heavy.
14. **Text hierarchy:** `#f0f0f0` → `#888` → `#666` → `#555` → `#333` → `#222` (brightest to dimmest).
