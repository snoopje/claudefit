# ClaudeFit — UI/UX Design System
## Dark Industrial Theme Component Library & Interface Specifications

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Design Tokens](#2-design-tokens)
3. [Component Library](#3-component-library)
4. [Navigation & Information Architecture](#4-navigation--information-architecture)
5. [Page Layouts](#5-page-layouts)
6. [Responsive Design](#6-responsive-design)
7. [Animation & Motion](#7-animation--motion)
8. [Accessibility](#8-accessibility)
9. [Interaction Patterns](#9-interaction-patterns)
10. [Data Visualization](#10-data-visualization)

---

## 1. Design Philosophy

### Core Principles

The ClaudeFit UI embodies a **Dark Industrial** aesthetic — brutalist, premium, and data-driven. The design speaks to serious athletes who value clean data presentation and minimal distraction.

**Key Principles:**
- **Data First:** Information hierarchy prioritizes clarity over decoration
- **Sharp Geometry:** No rounded corners — clipped, notched, and angular forms only
- **Controlled Contrast:** Near-black backgrounds with strategic lime/ember accents
- **Terminal Aesthetic:** Monospaced labels and metadata create a technical feel
- **Atmospheric Depth:** Subtle grain texture and ambient glows add richness without clutter

### Visual Personality

| Attribute | Description |
|-----------|-------------|
| **Tone** | Serious, athletic, technical, premium |
| **Mood** | Dark, focused, intense, controlled |
| **Voice** | Concise, precise, actionable |
| **Archetype** | The high-performance training facility |

---

## 2. Design Tokens

### 2.1 Color Tokens

```css
/* Base Backgrounds */
--background: #050505;           /* Primary page background */
--surface: #0a0a0a;              /* Card backgrounds */
--surface-hover: #111111;        /* Card on hover */
--surface-elevated: #0e0e0e;     /* Higher elevation surfaces */
--border: #1a1a1a;               /* Default border color */

/* Text Colors */
--foreground: #f0f0f0;           /* Primary text */
--text-secondary: #888888;       /* Secondary body text */
--text-muted: #666666;           /* Muted/tertiary text */
--text-dim: #555555;             /* Dim descriptions */
--text-ghost: #333333;           /* Decorative/watermark */
--text-invisible: #222222;       /* Copyright/metadata */

/* Accent Colors */
--lime: #c8ff00;                 /* Primary accent */
--lime-dim: #a3cc00;             /* Dimmed lime */
--lime-glow: rgba(200, 255, 0, 0.25);  /* Lime glow shadow */
--ember: #ff4d00;                /* Secondary accent */
--ember-dim: rgba(255, 77, 0, 0.2);    /* Dimmed ember */

/* Semantic Colors */
--success: #c8ff00;              /* Uses lime */
--warning: #ff4d00;              /* Uses ember */
--error: #ff3333;                /* Error red */
--info: #00d4ff;                 /* Info blue (rarely used) */

/* Border Utilities */
--border-subtle: rgba(255, 255, 255, 0.04);
--border-visible: rgba(255, 255, 255, 0.08);
--border-accent: rgba(200, 255, 0, 0.3);
```

### 2.2 Typography Tokens

```css
/* Font Families */
--font-body: 'Outfit', sans-serif;
--font-display: 'Bebas Neue', cursive;
--font-mono: 'JetBrains Mono', monospace;

/* Font Sizes - Fluid */
--text-xs: clamp(0.625rem, 1vw, 0.75rem);     /* 10-12px - Mono labels */
--text-sm: clamp(0.75rem, 1.2vw, 0.875rem);   /* 12-14px - Small body */
--text-base: clamp(0.875rem, 1.5vw, 1rem);    /* 14-16px - Base body */
--text-lg: clamp(1rem, 2vw, 1.125rem);        /* 16-18px - Large body */
--text-xl: clamp(1.25rem, 2.5vw, 1.5rem);     /* 20-24px - Subheadings */

/* Display Sizes - Bebas Neue */
--display-sm: clamp(2rem, 5vw, 3rem);         /* Section subheads */
--display-md: clamp(2.5rem, 6vw, 4rem);       /* Section heads */
--display-lg: clamp(3rem, 8vw, 5rem);         /* Page headings */
--display-xl: clamp(4rem, 10vw, 6.5rem);      /* Hero headings */

/* Font Weights */
--weight-light: 300;
--weight-normal: 400;
--weight-medium: 500;
--weight-semibold: 600;
--weight-bold: 700;
--weight-display: 400;   /* Bebas Neue only has 400 */

/* Line Heights */
--leading-tight: 0.95;    /* Display headings */
--leading-snug: 1.25;     /* Headings */
--leading-normal: 1.5;    /* Body text */
--leading-relaxed: 1.75;  /* Long-form content */

/* Letter Spacing */
--tracking-tight: 0.02em;      /* Display headings */
--tracking-normal: 0em;        /* Body text */
--tracking-wide: 0.1em;        /* Uppercase labels */
--tracking-wider: 0.2em;       /* Mono labels */
--tracking-widest: 0.3em;      /* Wide mono labels */
```

### 2.3 Spacing Tokens

```css
/* Base Unit: 4px */
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-24: 6rem;      /* 96px */
--space-32: 8rem;      /* 128px */

/* Component-Specific Spacing */
--padding-input: var(--space-3) var(--space-4);
--padding-card: var(--space-6) var(--space-8);
--padding-card-lg: var(--space-8) var(--space-10);
--padding-nav: var(--space-4) var(--space-6);
```

### 2.4 Easing & Duration Tokens

```css
/* Easing Curves */
--ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-sharp: cubic-bezier(0.22, 1, 0.36, 1);

/* Durations */
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--duration-slower: 900ms;
```

### 2.5 Border Radius Tokens

```css
/* Sharp Geometry - No rounded corners */
--radius-none: 0;
--radius-sm: 0;           /* Override: still sharp */
--radius-md: 0;           /* Override: still sharp */
--radius-lg: 0;           /* Override: still sharp */
```

---

## 3. Component Library

### 3.1 Button Components

#### Primary Button (CTA)

**Visual Specification:**
- Background: `--lime` (#c8ff00)
- Text: `--background` (#050505)
- Font: `--font-body`, weight 700
- Size: 13px text, uppercase
- Letter spacing: 0.1em
- Padding: 14px 28px
- Border radius: 0 (sharp corners)
- Border: none

**States:**

| State | Background | Transform | Shadow | Additional |
|-------|-----------|-----------|---------|------------|
| Default | Lime | none | none | - |
| Hover | Lime | translateY(-2px) | 0 0 30px lime-glow | Diagonal stripe overlay |
| Active | Lime | scale(0.97) | reduced glow | - |
| Disabled | `--text-muted` | none | none | 50% opacity |

**Usage:** Primary actions — "Start Workout", "Save Exercise", "Create Routine"

#### Secondary Button (Ghost)

**Visual Specification:**
- Background: transparent
- Border: 1px solid `--border` (#1a1a1a)
- Text: `--text-muted` (#666666)
- Font: `--font-body`, weight 500
- Size: 13px text, uppercase
- Letter spacing: 0.1em
- Padding: 14px 28px
- Border radius: 0

**States:**

| State | Border | Text Color | Background |
|-------|--------|------------|------------|
| Default | #1a1a1a | #666666 | transparent |
| Hover | #333333 | #f0f0f0 | white/[0.04] |
| Active | #333333 | #f0f0f0 | white/[0.08] |

**Usage:** Secondary actions — "Cancel", "Edit", "Filter"

#### Text Button

**Visual Specification:**
- Background: transparent
- Border: none
- Text: `--lime` or `--text-muted`
- Font: `--font-mono`
- Size: 11px text, uppercase
- Letter spacing: 0.2em
- Padding: 8px 0
- Border-bottom: 1px solid transparent

**States:**

| State | Border Bottom | Text Color |
|-------|---------------|------------|
| Default | transparent | --text-muted |
| Hover | lime | --lime |

**Usage:** Inline actions — "Delete", "View Details", "Share"

#### Icon Button

**Visual Specification:**
- Size: 40x40px (medium), 32x32px (small)
- Background: transparent
- Border: 1px solid `--border`
- Icon color: `--text-muted`
- Border radius: 0

**Hover States:**
- Background: `white/[0.04]`
- Icon color: `--lime`
- Border: `--lime` (30% opacity)

**Usage:** Toolbar actions, contextual actions

#### Destructive Button

**Visual Specification:**
- Background: transparent
- Border: 1px solid `--error` (#ff3333)
- Text: `--error`
- Same typography as Secondary Button

**Hover:**
- Background: `--error` at 10% opacity
- Text: `--error`

**Usage:** "Delete Workout", "Remove Exercise", "Clear Data"

#### Button Sizes

| Size | Height | Padding | Font Size | Icon Size |
|------|--------|---------|-----------|-----------|
| xs | 28px | 0 12px | 11px | 12px |
| sm | 36px | 0 16px | 12px | 14px |
| md | 48px | 0 24px | 13px | 16px |
| lg | 56px | 0 32px | 14px | 20px |

---

### 3.2 Input Components

#### Text Input

**Visual Specification:**
- Background: `--surface` (#0a0a0a)
- Border: 1px solid `--border` (#1a1a1a)
- Border radius: 0
- Padding: 14px 16px
- Font: `--font-body`, weight 400
- Size: 16px text
- Text color: `--foreground`
- Placeholder color: `--text-dim` (#555555)

**States:**

| State | Border | Background | Shadow |
|-------|--------|------------|--------|
| Default | #1a1a1a | #0a0a0a | none |
| Focus | lime | #0a0a0a | 0 0 0 2px lime-glow |
| Error | --error | #0a0a0a | 0 0 0 2px error-glow |
| Disabled | #1a1a1a | #050505 | none |

**Labels:**
- Font: `--font-mono`
- Size: 11px, uppercase
- Letter spacing: 0.2em
- Color: `--text-muted`
- Margin-bottom: 8px
- Prefix with `/` (e.g., "/ EXERCISE NAME")

#### Number Input

**Same as Text Input**, with additional controls:
- Increment/decrement buttons on right side
- Buttons: 32x40px, sharp corners
- Button background: `--surface-hover` on hover
- Center divider line: 1px solid `--border`

#### Select Dropdown

**Visual Specification:**
- Container: Same as Text Input
- Dropdown menu:
  - Background: `--surface-elevated`
  - Border: 1px solid `--border`
  - Box shadow: 0 10px 40px rgba(0,0,0,0.5)
  - Max height: 300px
  - Overflow: auto

**Options:**
- Padding: 12px 16px
- Hover background: `white/[0.04]`
- Selected: background `lime-glow` at 10%, text `--lime`
- Selected checkmark: small dot or square in lime color

#### Checkbox

**Visual Specification:**
- Size: 20x20px
- Border: 1px solid `--border`
- Border radius: 0
- Background: `--surface`

**States:**

| State | Fill | Border |
|-------|------|--------|
| Unchecked | transparent | #1a1a1a |
| Checked | lime | lime |
| Indeterminate | lime | lime |

**Animation:**
- Check mark draws from bottom-left to top-right
- 200ms duration, spring easing

#### Radio Button

**Visual Specification:**
- Size: 20x20px (outer circle)
- Border: 1px solid `--border`
- Border radius: 50% (only exception to sharp corners)
- Inner dot: 8px diameter, lime color

**States:**
- Unchecked: transparent center
- Checked: lime dot with subtle glow
- Focus: outer border becomes lime

#### Slider

**Visual Specification:**
- Track height: 2px
- Track background: `--border`
- Fill track: lime color
- Thumb: 16x16px square (sharp corners)
- Thumb background: `--foreground`
- Thumb border: 2px solid lime

**Interaction:**
- Thumb grows to 18x18px on hover
- Lime glow appears on thumb when dragging
- Track animates fill width

#### Text Area

**Visual Specification:**
- Same styling as Text Input
- Min height: 120px
- Resize: vertical only
- Line height: 1.6

#### Search Input

**Visual Specification:**
- Text Input with search icon on left
- Icon padding: 16px left, 40px right (for clear button)
- Clear button appears on typing (X icon)
- Icon color: `--text-dim`

---

### 3.3 Card Components

#### Base Card

**Visual Specification:**
- Background: `--surface` (#0a0a0a)
- Border: 1px solid `--border` (or use grid gap technique)
- Border radius: 0
- Padding: 32px (mobile), 40px (desktop)
- Box shadow: none

**Hover Effect:**
- Transform: translateY(-6px)
- Background: `--surface-hover` (#111111)
- Left border: 3px solid lime (animates from 0 to full height)
- Box shadow: 0 20px 40px rgba(0,0,0,0.3)

#### Stat Card

**Structure:**
```
+------------------+
| [LABEL]          |  <- Mono, uppercase, 11px, text-dim
|                  |
| 245,892          |  <- Bebas Neue, display-lg, lime or white
| TOTAL VOLUME     |  <- Body text, text-muted
+------------------+
```

**Variants:**
- Default: White stat number
- Accent: Lime stat number
- Ember: Ember stat number (for special metrics)

**Trend Indicator:**
- Small arrow icon + percentage
- Green (lime) for positive trend
- Ember for negative trend
- Mono font, 10px

#### Workout Card

**Structure:**
```
+----------------------------------+
| / STRENGTH          [DOT]        |  <- Mono label, status dot
|                                  |
| UPPER BODY POWER                 |  <- Bebas Neue, display-sm
|                                  |
| Nov 15, 2024  |  67 min          |  <- Body text, text-secondary
| 12 exercises   |  8,420 lbs      |  <- Mono labels
+----------------------------------+
```

**Status Dots:**
- Completed: lime fill
- In progress: lime outline (pulsing)
- Missed: ember fill

#### Exercise Card

**Structure:**
```
+----------------------------------+
| BARBELL BENCH PRESS              |  <- Body text, font-semibold
| chest / triceps / strength       |  <- Mono, lowercase, 11px, lime
|                                  |
| [SET] [REPS] [WEIGHT]            |  <- Column headers
| 1      12      135 lbs           |  <- Data rows
| 2      10      145 lbs           |
| 3       8      155 lbs           |
+----------------------------------+
```

#### Goal Card

**Structure:**
```
+----------------------------------+
| WEEKLY WORKOUTS                  |  <- Bebas Neue
| 4 / 5 completed                  |  <- Body text
|                                  |
| [==========.....] 80%            |  <- Progress bar
|                                  |
| 2 days remaining                 |  <- Mono, text-dim
+----------------------------------+
```

**Progress Bar:**
- Track: `--border` color, 4px height
- Fill: lime gradient (`--lime` to `--lime-dim`)
- Sharp corners
- Optional: diagonal stripe pattern overlay

#### Routine Card

**Structure:**
```
+----------------------------------+
| PUSH DAY                         |  <- Bebas Neue
| 8 exercises  |  ~45 min          |  <- Meta info
|                                  |
| Bench Press                      |  <- Exercise list
| Overhead Press                   |  <- (first 3 shown)
| Lateral Raises                   |
| ... +5 more                      |
|                                  |
| [START] [EDIT]                   |  <- Action buttons
+----------------------------------+
```

#### Notch Card (Step/Process)

**Visual Specification:**
- Clip-path: `polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)`
- L-shaped accent in top-left (two thin divs)
- Large faded number in ember (20% opacity)
- Positioned absolute, display font, very large

**Usage:** Onboarding, workout steps, process indicators

---

### 3.4 Navigation Components

#### Top Navigation Bar

**Desktop (1024px+):**
```
+----------------------------------------------------------+
| CLAUDEfit  [Dashboard] [Workouts] [History] [Goals]  [+NEW]|
|            Lime on active                               |
+----------------------------------------------------------+
```

**Specifications:**
- Fixed position, top
- Full width
- Height: 72px
- Background: `--background` with 80% opacity
- Backdrop blur: 20px, saturate 160%
- Border-bottom: 1px solid `--border-subtle`
- Padding: 0 32px

**Logo:**
- Font: `--font-display`
- Size: 24px
- "CLAUDE" in foreground, "fit" in lime

**Nav Links:**
- Font: `--font-body`, weight 500
- Size: 13px
- Color: `--text-muted`
- Uppercase, 0.1em letter spacing
- Hover: background `white/[0.04]`, rounded-full
- Active: text `--lime`

**Mobile (< 1024px):**
- Logo left, hamburger menu right
- Full-screen drawer when opened
- Drawer: `--surface-elevated` background
- Links stack vertically, large touch targets

#### Bottom Navigation (Mobile Only)

**Visible below 768px:**
```
+------------------------------------------------+
| [DASH] [WORK] [HIST] [GOALS] [MORE]           |
|  Lime dot on active                            |
+------------------------------------------------+
```

**Specifications:**
- Fixed position, bottom
- Height: 64px
- Background: `--surface-elevated` with backdrop blur
- Border-top: 1px solid `--border-subtle`
- 5 items evenly distributed
- Icon + label stacked
- Active: icon + label in lime

#### Breadcrumb

**Visual Specification:**
- Font: `--font-mono`
- Size: 11px
- Separator: `/` in lime color
- Color: `--text-dim`
- Hoverable links become `--text-secondary`

```
Dashboard / Workouts / Upper Body Power
```

#### Tabs

**Visual Specification:**
- Container: border-bottom, `--border`
- Tab: padding 12px 24px
- Font: `--font-body`, weight 500, uppercase
- Size: 13px, letter spacing 0.1em
- Color: `--text-muted`

**States:**
- Default: text `--text-muted`, border-bottom 2px solid transparent
- Active: text `--foreground`, border-bottom 2px solid lime
- Hover: text `--foreground`

**Usage:** Filter tabs (All/Strength/Cardio), view toggles

---

### 3.5 Feedback Components

#### Modal / Dialog

**Visual Specification:**
- Overlay: `rgba(5, 5, 5, 0.8)` backdrop blur 10px
- Container:
  - Background: `--surface-elevated`
  - Border: 1px solid `--border`
  - Max width: 560px
  - Padding: 40px
  - Border radius: 0
  - Box shadow: 0 40px 80px rgba(0,0,0,0.5)

**Structure:**
```
+------------------------------------------+
| [X]                                       |  <- Close button, top-right
|                                          |
| / CONFIRM                                 |  <- Mono label
|                                          |
| DELETE WORKOUT?                           |  <- Bebas Neue heading
|                                          |
| This action cannot be undone...           |  <- Body text
|                                          |
| [CANCEL] [DELETE]                         |  <- Action buttons
+------------------------------------------+
```

**Animation:**
- Enter: Fade in + scale from 0.95 to 1
- Exit: Fade out + scale to 0.95
- Duration: 200ms, spring easing

#### Toast / Notification

**Visual Specification:**
- Background: `--surface-elevated`
- Border: 1px solid `--border`
- Border-left: 3px solid lime
- Padding: 16px 20px
- Min-width: 320px, max-width: 480px
- Box shadow: 0 10px 40px rgba(0,0,0,0.4)

**Variants:**
- Success: lime border
- Error: ember border
- Info: blue border

**Animation:**
- Enter: Slide in from right (translateX + fade)
- Exit: Slide out to right
- Auto-dismiss after 4 seconds

#### Alert / Banner

**Visual Specification:**
- Full-width or contained
- Padding: 16px 20px
- Border-left: 4px solid accent
- Background: accent at 5% opacity

**Usage:** Page-level notifications, warnings

#### Loading States

**Spinner:**
- 32x32px square with rotating border
- Border: 2px solid `--border`
- Top border: lime color
- Animation: rotate 360deg, 1s infinite, linear

**Skeleton:**
- Background: linear-gradient(
    90deg,
    var(--surface) 0%,
    var(--surface-hover) 50%,
    var(--surface) 100%
  )
- Animation: shimmer translateX, 1.5s infinite
- Height matches expected content

#### Progress Bar

**Visual Specification:**
- Track: 4px height, `--border` color
- Fill: lime gradient, 4px height
- Border radius: 0
- Optional: percentage label above (mono font)

**Animated variant:**
- Stripe pattern moves horizontally
- Animation: translateX, 1s infinite

---

### 3.6 Data Display Components

#### Table

**Visual Specification:**
- Border-collapse: separate
- Border-spacing: 0 4px
- Width: 100%

**Headers:**
- Font: `--font-mono`, 11px, uppercase
- Letter spacing: 0.2em
- Color: `--text-dim`
- Text-align: left
- Padding: 12px 16px
- Border-bottom: 1px solid `--border`

**Rows:**
- Background: `--surface`
- Padding: 16px
- Border-bottom: 1px solid `--border`
- Hover: background `--surface-hover`

**Cells:**
- Body font, 14px
- Color: `--foreground`
- Numeric cells: `--font-mono`, tabular-ums

#### Metric/Stat Display

**Variants:**

1. **Large Stat:**
   ```
   245,892             <- Bebas Neue, 64px, lime
   LBS LIFTED          <- Mono, 11px, uppercase, text-dim
   ```

2. **Compact Stat:**
   ```
   8,420 / 10,000      <- Body font, 18px, semibold
   lbs                 <- Mono, 11px, text-muted
   [=====.....]        <- Mini progress bar
   ```

3. **Trend Stat:**
   ```
   12                  <- Bebas Neue, 48px
   workouts            <- Body font, text-muted
   [▲ 15%]             <- Trend indicator
   this month          <- Mono, 11px, text-dim
   ```

#### Badge/Tag

**Visual Specification:**
- Font: `--font-mono`, 10px, uppercase
- Letter spacing: 0.2em
- Padding: 6px 12px
- Border radius: 0

**Variants:**

| Variant | Background | Text |
|---------|------------|------|
| Default | transparent | text-muted |
| Lime | lime-glow 20% | lime |
| Ember | ember-dim | ember |
| Outline | transparent | foreground (border: border) |

**Usage:** Exercise types, muscle groups, categories

#### List Item

**Visual Specification:**
- Padding: 16px 20px
- Border-bottom: 1px solid `--border`
- Display: flex, align-center
- Min-height: 64px

**Hover:**
- Background: `white/[0.02]`
- Border-left: 2px solid lime

#### Timeline

**Visual Specification:**
- Left border: 1px solid `--border`
- Items: 20px left padding
- Dot: 8x8px square (lime) on border line

**Usage:** Workout history, activity feed

---

### 3.7 Overlay & Container Components

#### Drawer / Slide-over

**Visual Specification:**
- Fixed position, right side
- Width: 400px (desktop), 100% (mobile)
- Height: 100vh
- Background: `--surface-elevated`
- Border-left: 1px solid `--border`
- Box shadow: -20px 0 40px rgba(0,0,0,0.4)

**Animation:**
- Enter: translateX from 100% to 0
- Exit: translateX from 0 to 100%
- Duration: 300ms, spring easing

#### Tooltip

**Visual Specification:**
- Background: `--surface-elevated`
- Border: 1px solid `--border`
- Padding: 8px 12px
- Font: `--font-body`, 13px
- Max width: 200px
- Arrow: sharp triangle (no curves)

#### Popover / Dropdown Menu

**Visual Specification:**
- Background: `--surface-elevated`
- Border: 1px solid `--border`
- Box shadow: 0 10px 40px rgba(0,0,0,0.5)
- Min-width: 180px
- Padding: 8px

**Menu Items:**
- Padding: 10px 16px
- Font: `--font-body`, 14px
- Hover: background `white/[0.04]`
- Destructive items: `--error` text

---

### 3.8 Specialized Components

#### Rest Timer

**Visual Specification:**
- Circular progress indicator
- Center: large countdown display (Bebas Neue)
- Size: 200x200px
- Stroke: lime, 4px width
- Track: `--border`, 4px width

**Controls:**
- [+10s] [-10s] buttons below
- [PAUSE] [SKIP] buttons

**Animation:**
- Smooth countdown, 100ms updates
- Pulse effect when under 10 seconds
- Lime glow intensifies

#### Set Logger

**Structure:**
```
+--------------------------------------------------+
| SET 1                                [COMPLETE]  |
|                                                  |
| [REPS] [WEIGHT]                    [LOG SET]     |
|   12      135                                     |
|                                                  |
| [X]                                              |
+--------------------------------------------------+
```

**Visual States:**
- Current set: lime border, elevated
- Completed: dimmed, checkmark
- Upcoming: reduced opacity

#### Exercise Picker

**Structure:**
```
+--------------------------------------------------+
| / SEARCH EXERCISE                                |
| [__________________]                             |
|                                                  |
| / FILTER                       [CLEAR]           |
| [CHEST] [BACK] [LEGS] [SHOULDERS]                |
|                                                  |
| BARBELL BENCH PRESS                      [+]     |
| chest / triceps / strength                       |
|                                                  |
| INCLINE DUMBBELL PRESS                   [+]     |
| chest / strength                                |
+--------------------------------------------------+
```

**Features:**
- Real-time search filtering
- Muscle group filter chips
- Quick add button on each item

#### Calendar Widget

**Visual Specification:**
- Grid: 7 columns
- Day cells: 40x40px
- Today: lime border
- Selected: lime background, dark text
- Has data: small dot indicator (lime)
- Header: mono labels for day names

#### Chart Container

**Structure:**
```
+--------------------------------------------------+
| / VOLUME OVER TIME                  [WEEK/MONTH] |
+--------------------------------------------------+
|                                                  |
|     [Line/Area Chart]                            |
|                                                  |
+--------------------------------------------------+
| J | F | M | A | M | J | J | A | S | O | N | D    |
+--------------------------------------------------+
```

**Specifications:**
- Header row: mono label, optional view toggle
- Chart area: 300px height minimum
- X-axis: mono labels, `--text-dim`
- Y-axis: mono labels, `--text-dim`
- Grid lines: `--border-subtle`
- Data line: lime, 2px stroke
- Fill: lime gradient, 10-20% opacity
- Points: 4px squares (lime), optional hover states

---

## 4. Navigation & Information Architecture

### 4.1 Site Map

```
ClaudeFit
├── Dashboard (Home)
│   ├── Quick Actions
│   ├── Today's Summary
│   ├── Active Goals
│   ├── Recent Activity
│   └── Personal Records Feed
│
├── Workout (Active Session)
│   ├── Exercise Selection
│   ├── Set Logging
│   ├── Rest Timer
│   └── Workout Complete
│
├── History
│   ├── Workout List (Filtered)
│   ├── Workout Detail
│   └── Date Picker View
│
├── Exercises
│   ├── Exercise Library
│   ├── Exercise Detail
│   └── Custom Exercise Creator
│
├── Routines
│   ├── Routine List
│   ├── Routine Detail
│   └── Routine Builder
│
├── Progress
│   ├── Overview Charts
│   ├── Exercise Statistics
│   ├── Personal Records
│   └── Body Metrics
│
├── Nutrition
│   ├── Daily Log
│   ├── Meal Editor
│   ├── Weekly Summary
│   └── Target Settings
│
└── Goals
    ├── Active Goals
    ├── Goal Creator
    └── Goal History
```

### 4.2 Navigation Patterns

**Primary Navigation (Desktop - Top Bar):**
- Logo (left)
- Main nav links (center)
- Quick action button (right)

**Main Nav Items:**
1. Dashboard
2. Workouts (starts new workout)
3. History
4. Exercises
5. Progress
6. Nutrition

**Mobile Navigation (Bottom Bar):**
1. Dashboard
2. Workouts (quick start)
3. History
4. More (expands to Exercises, Progress, Nutrition, Goals)

**Secondary Navigation:**
- Breadcrumbs for deep pages
- Back buttons for modal flows
- Tabs for filtering (e.g., All/Strength/Cardio)

### 4.3 User Flows

#### Start Workout Flow
```
1. Dashboard → [Start Workout] button
   OR
   Top Nav → [Workouts] → [New Workout]
   OR
   Routines → Select Routine → [Start]

2. Exercise Picker
   - Search/Select exercises
   - Or load from routine

3. Active Workout Session
   - Log sets for each exercise
   - Use rest timer between sets
   - Reorder/remove exercises

4. Workout Complete
   - Summary view
   - Save to history
   - View details/share
```

#### Create Routine Flow
```
Routines → [Create Routine]
  → Enter routine name
  → Add exercises (search or browse)
  → Set default reps/sets/weight
  → Save routine
```

#### Log Nutrition Flow
```
Nutrition → [Add Meal]
  → Enter meal name
  → Enter calories
  → Enter macros (protein/carbs/fat)
  → Save
  → Update daily summary
```

---

## 5. Page Layouts

### 5.1 Dashboard Layout

**Grid Structure:**
```
+----------------------------------------------------------+
| HEADER:                                                   |
| Welcome back, Athlete                    [NEW WORKOUT]    |
| / DASHBOARD                                               |
+----------------------------------------------------------+
|                                                          |
| QUICK STATS (Row of 4):                                  |
| [Streak] [This Week] [Volume] [Body Weight]              |
|                                                          |
+----------------------------------------------------------+
|                                                          |
| TODAY'S SUMMARY (Split 2:1):                             |
| |                                                  |      |
| | Mini Calendar / Activity                      | Goals |
| |                                            |      |
| |                                            |      |
+----------------------------------------------------------+
|                                                          |
| ACTIVE GOALS (Horizontal Scroll or Grid):                |
| [Goal Card 1] [Goal Card 2] [Goal Card 3]                |
|                                                          |
+----------------------------------------------------------+
|                                                          |
| NUTRITION SUMMARY (Split 2:1:1):                         |
| |                    |                |                  |
| | Progress Bars     | Quick Add      | Weekly Chart     |
| | (Cal/Pro/Carb/Fat)|                |                  |
+----------------------------------------------------------+
|                                                          |
| RECENT PERSONAL RECORDS (List):                          |
| [PR Card 1]                                              |
| [PR Card 2]                                              |
+----------------------------------------------------------+
```

**Section Spacing:**
- Vertical rhythm: 64px between major sections
- Section headers with mono labels

### 5.2 Active Workout Layout

**Structure:**
```
+----------------------------------------------------------+
| HEADER:                                                   |
| UPPER BODY POWER                      [FINISH] [X]       |
| Started 2:34 PM  |  3/8 exercises  |  23:45 elapsed     |
+----------------------------------------------------------+
|                                                          |
| CURRENT EXERCISE (Card):                                 |
|                                                          |
| BARBELL BENCH PRESS                         [EDIT] [DEL] |
| chest / triceps / strength                               |
|                                                          |
| + [ADD SET]                                              |
|                                                          |
| SET 1                                    [LOGGED]        |
| 12 reps × 135 lbs                                       |
|                                                          |
| SET 2                                    [LOGGED]        |
| 10 reps × 145 lbs                                       |
|                                                          |
| SET 3                                    [ACTIVE]        |
| [Reps: __] [Weight: ___ lbs]               [LOG SET]     |
|                                                          |
| [REST TIMER: 1:30]                                      |
|                                                          |
+----------------------------------------------------------+
| UPCOMING:                                                |
| [Incline DB Press] [Flyes] ...                    |
+----------------------------------------------------------+
```

**Sticky Elements:**
- Header (always visible)
- Current exercise card (sticks below header on scroll)

### 5.3 History Layout

**Structure:**
```
+----------------------------------------------------------+
| FILTERS:                                                  |
| [All] [Strength] [Cardio] [Flexibility]                  |
|                                                          |
| Date Range: [Nov 1 - Nov 30]                    [CLEAR]  |
+----------------------------------------------------------+
|                                                          |
| WORKOUT LIST:                                            |
|                                                          |
| Nov 15, 2024                                             |
| [Upper Body Power]                   [→]                |
| 12 exercises  |  67 min  |  8,420 lbs                   |
|                                                          |
| Nov 14, 2024                                             |
| [Lower Body Hypertrophy]              [→]                |
| 10 exercises  |  72 min  | 12,100 lbs                   |
|                                                          |
| ...                                                      |
+----------------------------------------------------------+
```

**Filter Bar:**
- Sticky below header
- Horizontal scroll on mobile

### 5.4 Exercise Library Layout

**Structure:**
```
+----------------------------------------------------------+
| SEARCH:                                                   |
| [______________________]                    [+ NEW]      |
|                                                          |
| FILTER BY MUSCLE GROUP:                                   |
| [ALL] [CHEST] [BACK] [LEGS] [SHOULDERS] [ARMS] [CORE]    |
+----------------------------------------------------------+
|                                                          |
| EXERCISE GRID (2-3 columns):                             |
|                                                          |
| [Barbell Bench Press]                     [DETAILS] [+] |
| chest / triceps / strength                               |
| Equipment: Barbell, Bench                                |
|                                                          |
| [Deadlift]                               [DETAILS] [+]   |
| back / legs / posterior chain                            |
| Equipment: Barbell                                       |
|                                                          |
| ...                                                      |
+----------------------------------------------------------+
```

### 5.5 Progress/Stats Layout

**Structure:**
```
+----------------------------------------------------------+
| TIME RANGE:                                               |
| [Week] [Month] [3 Month] [Year] [All Time]               |
+----------------------------------------------------------+
|                                                          |
| OVERVIEW CARDS (4 columns):                              |
| [Total Workouts] [Volume] [PRs Set] [Streak]            |
|                                                          |
+----------------------------------------------------------+
|                                                          |
| VOLUME OVER TIME (Chart):                                |
| [Line/Area Chart with selectable time range]            |
+----------------------------------------------------------+
|                                                          |
| EXERCISE PROGRESS:                                       |
|                                                          |
| Select Exercise: [Bench Press ▼]                        |
|                                                          |
| [Chart: Weight × Reps over time]                         |
|                                                          |
| PERSONAL RECORDS:                                        |
| [Est 1RM: 225 lbs] [Max Vol: 8,420] [Best Set...]       |
+----------------------------------------------------------+
|                                                          |
| BODY METRICS (Tabbed section):                           |
| [Weight] [Measurements]                                  |
|                                                          |
| [Chart: Body weight trend]                               |
+----------------------------------------------------------+
```

### 5.6 Nutrition Layout

**Structure:**
```
+----------------------------------------------------------+
| DAILY SUMMARY (Top card):                                |
|                                                          |
| [CALORIES]                          [Target: 2,500]      |
| 1,847 / 2,500                                            |
| [==============..] 74%                                   |
|                                                          |
| [PROTEIN] [CARBS] [FAT]                                  |
| 142g / 180g  |  180g / 250g  |  62g / 80g               |
|                                                          |
+----------------------------------------------------------+
|                                                          |
| TODAY'S MEALS:                                           |
|                                                          |
| [+ ADD MEAL]                                             |
|                                                          |
| Breakfast - 8:30 AM                     [EDIT] [DEL]     |
| Oatmeal with berries                                     |
| 420 cal  |  18g protein  |  62g carbs  |  12g fat        |
|                                                          |
| Lunch - 12:45 PM                         [EDIT] [DEL]     |
| Grilled chicken salad                                    |
| 680 cal  |  54g protein  |  22g carbs  |  38g fat        |
|                                                          |
| ...                                                      |
+----------------------------------------------------------+
|                                                          |
| WEEKLY CHART:                                            |
| [Bar chart: Daily calories vs target]                   |
+----------------------------------------------------------+
```

### 5.7 Goals Layout

**Structure:**
```
+----------------------------------------------------------+
| [+ CREATE NEW GOAL]                                       |
+----------------------------------------------------------+
|                                                          |
| ACTIVE GOALS:                                            |
|                                                          |
| [WEEKLY WORKOUTS]                        [EDIT]          |
| 4 / 5 completed                                          |
| [============] 80%                                       |
| 2 days remaining                                         |
|                                                          |
| [DAILY CALORIES]                          [EDIT]         |
| On track (5 day streak)                                  |
| All 5 days under target                                  |
|                                                          |
| [TARGET BODYWEIGHT]                       [EDIT]         |
| 182 / 180 lbs                                            |
| [-2 lbs to go]                                           |
|                                                          |
+----------------------------------------------------------+
|                                                          |
| COMPLETED GOALS (Collapsible):                           |
| [▼ Last Month]                                           |
| - October 2024: All goals achieved                       |
+----------------------------------------------------------+
```

---

## 6. Responsive Design

### 6.1 Breakpoints

| Breakpoint | Min Width | Target Devices | Layout Changes |
|------------|-----------|----------------|----------------|
| `mobile`   | 0px       | Phones portrait | Single column, bottom nav, stacked cards |
| `sm`       | 640px     | Phones landscape, small tablets | 2-column grids, larger text |
| `md`       | 768px     | Tablets portrait | 3-column grids, top nav appears |
| `lg`       | 1024px    | Tablets landscape, laptops | Full layout, side-by-side content |
| `xl`       | 1280px    | Desktops | Max content width (1280px), centered |
| `2xl`      | 1536px    | Large desktops | Same, more horizontal space |

### 6.2 Layout Adaptations

**Dashboard:**
- Mobile (< 768px):
  - Single column, all sections stacked
  - Quick stats: 2x2 grid
  - Bottom navigation visible
  - Hamburger menu for additional options
- Tablet (768px - 1024px):
  - Quick stats: 4 columns
  - Today's summary: side-by-side with goals
  - Bottom navigation becomes top navigation
- Desktop (1024px+):
  - Full grid layout
  - Max width 1280px centered
  - Ambient glow blobs positioned

**Active Workout:**
- Mobile:
  - Header with essential info only
  - Current exercise card takes full width
  - Upcoming exercises in horizontal scroll
  - Sticky timer always visible at bottom
- Tablet+:
  - Two-panel layout (current + upcoming)
  - Timer inline in current exercise card

**Exercise Library:**
- Mobile: Single column, full-width cards
- Tablet: 2-column grid
- Desktop: 3-column grid

**Charts:**
- Mobile: 100% width, simplified x-axis labels
- Tablet+: Fixed height (300px), full labels
- All: Touch-friendly tooltips, pinch to zoom (if supported)

### 6.3 Typography Scaling

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Hero Display | clamp(2.5rem, 8vw, 4rem) | clamp(3rem, 8vw, 5rem) | clamp(4rem, 10vw, 6.5rem) |
| Section Head | 2rem | 2.5rem | 3rem |
| Body Text | 16px | 16px | 16px |
| Mono Labels | 10px | 11px | 11px |

### 6.4 Touch Targets

- Minimum size: 44x44px (Apple HIG)
- Buttons: Minimum 48px height
- Navigation icons: 48x48px tap area
- Form inputs: Minimum 48px height
- Spacing between tap targets: Minimum 8px

### 6.5 Mobile-Specific Patterns

**Bottom Sheet (Mobile):**
- Used for secondary actions, filters, options
- Drag handle at top
- Scrolls within sheet, not page behind
- Back button or drag down to dismiss

**Swipe Actions:**
- Workout list items: Swipe left for [Delete]
- Exercise cards: Swipe right for [Edit]
- Visual indicator appears on swipe start

**Pull to Refresh:**
- Available on all list views (History, Exercises)
- Lime spinner appears
- Haptic feedback on refresh complete

---

## 7. Animation & Motion

### 7.1 Easing Curves

```css
/* Primary easing - Spring-like */
--ease-spring: cubic-bezier(0.16, 1, 0.3, 1);

/* Secondary easing - Smooth */
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);

/* Sharp easing - snappy */
--ease-sharp: cubic-bezier(0.22, 1, 0.36, 1);
```

### 7.2 Animation Library

| Class | Effect | Duration | Delay | Usage |
|-------|--------|----------|-------|-------|
| `.anim-fade-in` | Fade from 0 to 1 opacity | 300ms | 0 | General reveal |
| `.anim-up` | Fade + slide up 40px | 600ms | 0 | Section entry |
| `.anim-down` | Fade + slide down 40px | 600ms | 0 | Dropdowns |
| `.anim-left` | Fade + slide from left 60px | 700ms | 0 | Side panels |
| `.anim-right` | Fade + slide from right 60px | 700ms | 0 | Side panels |
| `.anim-scale-in` | Fade + scale 0.9 to 1 | 400ms | 0 | Modals |
| `.anim-stagger-1` | Inherits parent, +120ms delay | - | 120ms | Staggered items |
| `.anim-stagger-2` | Inherits parent, +240ms delay | - | 240ms | Staggered items |
| `.anim-stagger-3` | Inherits parent, +360ms delay | - | 360ms | Staggered items |
| `.anim-stagger-4` | Inherits parent, +480ms delay | - | 480ms | Staggered items |
| `.anim-stagger-5` | Inherits parent, +600ms delay | - | 600ms | Staggered items |

### 7.3 Micro-Interactions

**Button Hover:**
1. Border/Background color: 150ms, smooth
2. Transform: 300ms, spring
3. Shadow: 300ms, spring (slight delay after transform)

**Card Hover:**
1. Background color: 200ms
2. Transform: 400ms, spring
3. Border animation: 400ms (slight delay)

**Input Focus:**
1. Border color: 150ms
2. Shadow: 200ms (slight delay)
3. Label float (if present): 200ms

**Link Hover:**
1. Color: 150ms
2. Underline slide: 300ms

### 7.4 Page Transitions

**Route Changes:**
- Fade out current page: 200ms
- Fade in new page: 300ms
- Stagger content: 120ms increments

**Modal Open/Close:**
- Backdrop: 200ms fade
- Modal: 300ms fade + scale
- Content: Staggered after modal

### 7.5 Loading States

**Skeleton Pulse:**
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
/* 1.5s infinite, linear */
```

**Spinner:**
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
/* 1s infinite, linear */
```

**Progress Bar Fill:**
```css
@keyframes fill {
  from { width: 0%; }
  to { width: var(--target); }
}
/* 600ms, spring easing */
```

### 7.6 Gesture Feedback

**Tap:**
- Active state: scale(0.97)
- Duration: 100ms
- Haptic feedback (if supported)

**Long Press:**
- After 500ms: Visual cue (lime glow pulse)
- At 700ms: Haptic, context menu appears

**Swipe:**
- Real-time visual feedback
- Threshold: 100px for action
- Bounce back if threshold not met

---

## 8. Accessibility

### 8.1 Color Contrast

All combinations meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text):

| Foreground | Background | Ratio | Pass/Fail |
|------------|------------|-------|-----------|
| #f0f0f0 | #050505 | 16.1:1 | AAA |
| #c8ff00 | #050505 | 13.2:1 | AAA |
| #888888 | #050505 | 7.1:1 | AAA |
| #666666 | #050505 | 5.3:1 | AA |
| #f0f0f0 | #c8ff00 | 1.47:1 | FAIL (avoid, use #050505 text on lime) |

**Note:** Lime buttons use dark text (#050505) for proper contrast.

### 8.2 Focus States

**Visible Focus Indicator:**
- 2px solid lime outline
- 4px offset from element
- Box shadow: 0 0 0 4px lime-glow (10% opacity)
- Applies to: links, buttons, inputs, interactive elements

**Focus Order:**
- Logical tab order follows visual layout
- Skip to main content link (hidden until focused)
- Focus trap in modals

### 8.3 Screen Reader Support

**Semantic HTML:**
- Proper heading hierarchy (h1 → h2 → h3)
- Nav and landmark elements (header, nav, main, footer)
- Aria labels for icon-only buttons
- Aria-live regions for dynamic content (toasts, timers)

**Labels:**
- All form inputs have associated labels
- Custom components have aria-labels
- Status updates use aria-live="polite"
- Alerts use aria-live="assertive"

**Example:**
```html
<button aria-label="Start new workout">
  <Icon name="plus" />
</button>

<div role="status" aria-live="polite">
  Workout saved successfully
</div>
```

### 8.4 Keyboard Navigation

**Shortcuts:**
| Key | Action |
|-----|--------|
| Tab | Move focus forward |
| Shift + Tab | Move focus backward |
| Enter / Space | Activate focused element |
| Escape | Close modal/drawer |
| Arrow Keys | Navigate lists, adjust sliders |
| Home / End | Jump to start/end of list |
| / | Focus search input (when not typing) |

### 8.5 Touch Accessibility

- Minimum 44x44px touch targets
- Spacing between interactive elements
- No hover-only content critical to functionality
- Tap targets extend beyond visible bounds

### 8.6 Motion Preferences

**Respects `prefers-reduced-motion`:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

When reduced motion is enabled:
- Disable all decorative animations
- Keep essential transitions (instant, no animation)
- Remove hover effects (use focus styles instead)

### 8.7 Text Alternatives

- All icons have aria-labels
- Charts have text alternatives (data tables)
- Images have alt text (if user-generated)
- Color is never the only indicator (use icons + color)

---

## 9. Interaction Patterns

### 9.1 Empty States

**Template:**
```
+----------------------------------------------------------+
|                                                          |
|                   [Large Icon]                           |
|                                                          |
| NO WORKOUTS YET                                          |
|                                                          |
| Start tracking your fitness journey by logging your      |
| first workout.                                           |
|                                                          |
| [START FIRST WORKOUT]                                    |
|                                                          |
+----------------------------------------------------------+
```

**Visual Specification:**
- Icon: 64x64px, `--text-ghost` color
- Heading: Bebas Neue, `--text-muted`
- Body: `--text-dim`, max-width 400px, centered
- Button: Primary CTA

### 9.2 Error States

**Form Errors:**
```css
.error-input {
  border-color: var(--error);
  box-shadow: 0 0 0 2px var(--error-glow);
}

.error-message {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--error);
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.error-message::before {
  content: "!";
  display: inline-flex;
  width: 16px;
  height: 16px;
  background: var(--error);
  color: var(--background);
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
```

**Global Errors:**
- Full-width banner at top of page
- Ember accent (not lime, to avoid confusion)
- Dismissible
- Contains error message + action button

### 9.3 Confirmation Patterns

**Destructive Actions:**
1. First click: Opens confirmation modal
2. Modal: Clear warning text, ember accent
3. Requires button click to confirm
4. Optional: "Don't ask again" checkbox

**Non-Destructive Actions:**
1. Direct action (no confirmation)
2. Toast notification on completion
3. Undo button in toast (if applicable)

### 9.4 Search & Filter Patterns

**Search Input:**
- Real-time filtering (no submit button)
- Clear button appears after 2 characters
- Recent searches dropdown (on focus, if empty)
- Keyboard navigation in results

**Filter Chips:**
- Horizontal scroll container
- Active state: lime background, dark text
- Clear all button (when filters applied)
- Pill-shaped (exception: 4px border-radius for readability)

### 9.5 Infinite Scroll vs Pagination

**Workout History:**
- Initial: 20 items
- Load more: 20 items on scroll to 80% of viewport
- Loading indicator at bottom
- Maximum: 100 items, then "Load more" button
- Filter/search resets to pagination

### 9.6 Edit Modes

**Inline Edit:**
- Click to edit icon
- Field becomes input
- Save/Cancel buttons appear
- Escape to cancel, Enter to save

**Full Edit Mode:**
- Opens drawer or modal
- All fields editable
- Form validation
- Save/Cancel at bottom (sticky)

### 9.7 Drag & Drop (Exercise Reordering)

**Visual Feedback:**
- Dragged item: 90% opacity, elevated
- Drop target: 4px lime border
- Insert indicator: 4px lime line between items
- Other items: animate to make space

**Touch Support:**
- Long press to initiate drag (500ms)
- Haptic feedback on drag start
- Visual lift effect
- Scroll when dragging near edge

---

## 10. Data Visualization

### 10.1 Chart Design Principles

**Color:**
- Primary data: Lime
- Secondary data: White
- Comparison data: Ember
- Grid/axes: `--border-subtle`
- Labels: `--text-dim`

**Typography:**
- All labels: `--font-mono`, 10-11px, uppercase
- Values: `--font-body` or `--font-display` for large numbers
- Letter spacing: 0.2em for mono labels

**Grid:**
- Horizontal lines only (cleaner)
- 4-6 lines maximum
- `--border-subtle` color
- Dashed for secondary grids

### 10.2 Chart Types

#### Line Chart (Progress Over Time)

**Usage:** Weight lifted, body weight, volume trends

**Visual:**
- 2px stroke width
- Lime color
- Area fill: lime gradient, 10% opacity at bottom
- Points: 4px squares (lime)
- Hover: 8px square with tooltip

**Y-Axis:**
- 4-5 ticks
- Mono labels
- Min/max padding (10%)

**X-Axis:**
- Dates or time periods
- Mono labels
- Adaptive labels (show fewer on mobile)

#### Bar Chart (Weekly Comparisons)

**Usage:** Weekly volume, workout frequency

**Visual:**
- Bars: Lime background
- Hover: Brighten to `--lime`
- Width: 60% of available space
- Gap: 40%
- Sharp corners (no radius)

**Multi-series:**
- Side-by-side bars
- Lime and ember colors
- Legend above chart

#### Area Chart (Cumulative Volume)

**Usage:** Total volume over time

**Visual:**
- Similar to line chart
- Higher opacity fill (20-30%)
- No stroke (edge only)

#### Progress Bar Charts (Goal Progress)

**Usage:** Daily/weekly goal tracking

**Visual:**
- Horizontal bars
- Left-aligned labels
- Value text right-aligned or inline
- Lime fill, `--border` track
- Optional: diagonal stripe pattern

### 10.3 Small Screen Charts

**Adaptations:**
- Reduce grid lines to 3-4
- Simplify x-axis labels (show every nth)
- Larger touch targets for interactive points
- Legend: horizontal scroll or stacked
- Minimum height: 200px

### 10.4 Chart Tooltips

**Visual Specification:**
- Background: `--surface-elevated`
- Border: 1px solid `--border`
- Padding: 12px 16px
- Box shadow: 0 10px 30px rgba(0,0,0,0.4)
- Border radius: 0

**Content:**
- Date/Label: Mono, 11px, `--text-dim`
- Value: Bebas Neue, 24px, lime
- Additional info: Body, 14px, `--text-secondary`

**Position:**
- Follow cursor with offset
- Prevent clipping at edges
- Tap to dismiss on mobile

### 10.5 Stat Cards (Mini Charts)

**Sparkline:**
- 32px height
- No grid, no axes
- Lime stroke only
- Last point highlighted

**Progress Ring:**
- 64px diameter
- 4px stroke
- Lime fill
- Center: percentage in mono

---

## 11. Design Implementation Notes

### 11.1 Tailwind Configuration

**Custom Colors:**
```js
colors: {
  background: '#050505',
  surface: '#0a0a0a',
  'surface-hover': '#111111',
  'surface-elevated': '#0e0e0e',
  border: '#1a1a1a',
  foreground: '#f0f0f0',
  lime: '#c8ff00',
  'lime-dim': '#a3cc00',
  ember: '#ff4d00',
  muted: '#666666',
  'text-secondary': '#888888',
  'text-dim': '#555555',
  'text-ghost': '#333333',
  'text-invisible': '#222222',
}
```

**Custom Fonts:**
```js
fontFamily: {
  sans: ['Outfit', 'sans-serif'],
  display: ['Bebas Neue', 'cursive'],
  mono: ['JetBrains Mono', 'monospace'],
}
```

**Custom Border Radius:**
```js
borderRadius: {
  none: '0',
  // All other values set to 0 for sharp corners
}
```

### 11.2 Global Styles

**Noise Overlay:**
```css
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,...");
}
```

**Selection:**
```css
::selection {
  background-color: var(--lime);
  color: var(--background);
}
```

**Scrollbar:**
```css
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--surface);
}

::-webkit-scrollbar-thumb {
  background: var(--border);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-dim);
}
```

### 11.3 Component Organization

**Folder Structure:**
```
src/
├── components/
│   ├── ui/              # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── ...
│   ├── layout/          # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── ...
│   ├── features/        # Feature-specific components
│   │   ├── workout/
│   │   ├── exercises/
│   │   ├── progress/
│   │   └── ...
│   └── charts/          # Data visualization
│       ├── LineChart.tsx
│       ├── BarChart.tsx
│       └── ...
├── styles/
│   ├── globals.css
│   └── tokens.css       # Design tokens
└── utils/
    └── cn.ts            # Class name utility (clsx + tailwind-merge)
```

---

## 12. Component Checklist

### Complete Component Inventory

- [ ] Button (Primary)
- [ ] Button (Secondary/Ghost)
- [ ] Button (Destructive)
- [ ] Button (Icon)
- [ ] Button (Text)
- [ ] Input (Text)
- [ ] Input (Number)
- [ ] Input (Search)
- [ ] Textarea
- [ ] Select/Dropdown
- [ ] Checkbox
- [ ] Radio Button
- [ ] Slider
- [ ] Switch/Toggle
- [ ] Date Picker
- [ ] Time Picker
- [ ] Card (Base)
- [ ] Card (Stat)
- [ ] Card (Workout)
- [ ] Card (Exercise)
- [ ] Card (Goal)
- [ ] Card (Routine)
- [ ] Card (Notched)
- [ ] Modal/Dialog
- [ ] Drawer/Slide-over
- [ ] Toast/Notification
- [ ] Alert/Banner
- [ ] Tooltip
- [ ] Popover
- [ ] Dropdown Menu
- [ ] Navigation Bar (Desktop)
- [ ] Bottom Navigation (Mobile)
- [ ] Breadcrumbs
- [ ] Tabs
- [ ] Pagination
- [ ] Progress Bar
- [ ] Spinner/Loader
- [ ] Skeleton
- [ ] Badge/Tag
- [ ] Avatar
- [ ] Table
- [ ] Timeline
- [ ] Calendar Widget
- [ ] Rest Timer
- [ ] Set Logger
- [ ] Exercise Picker
- [ ] Quick Add Fab (Mobile)
- [ ] Empty State
- [ ] Error State
- [ ] Line Chart
- [ ] Bar Chart
- [ ] Area Chart
- [ ] Progress Chart
- [ ] Sparkline
- [ ] Progress Ring

---

## Appendix A: CSS Variables Reference

```css
:root {
  /* Colors */
  --color-background: #050505;
  --color-surface: #0a0a0a;
  --color-surface-hover: #111111;
  --color-surface-elevated: #0e0e0e;
  --color-border: #1a1a1a;
  --color-foreground: #f0f0f0;
  --color-lime: #c8ff00;
  --color-lime-dim: #a3cc00;
  --color-ember: #ff4d00;
  --color-muted: #666666;
  --color-text-secondary: #888888;
  --color-text-dim: #555555;
  --color-text-ghost: #333333;
  --color-text-invisible: #222222;
  --color-success: #c8ff00;
  --color-warning: #ff4d00;
  --color-error: #ff3333;
  --color-info: #00d4ff;

  /* Typography */
  --font-body: 'Outfit', sans-serif;
  --font-display: 'Bebas Neue', cursive;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  --space-32: 8rem;

  /* Easing */
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-sharp: cubic-bezier(0.22, 1, 0.36, 1);

  /* Duration */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 900ms;

  /* Layout */
  --max-width: 80rem; /* 1280px */
  --nav-height: 72px;
  --mobile-nav-height: 64px;
}
```

---

## Appendix B: Animation Classes Reference

```css
.anim-fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-smooth);
}

.anim-up {
  animation: slideUp var(--duration-slow) var(--ease-spring);
}

.anim-down {
  animation: slideDown var(--duration-slow) var(--ease-spring);
}

.anim-left {
  animation: slideLeft 700ms var(--ease-spring);
}

.anim-right {
  animation: slideRight 700ms var(--ease-spring);
}

.anim-scale-in {
  animation: scaleIn 400ms var(--ease-spring);
}

.anim-stagger-1 { animation-delay: 120ms; }
.anim-stagger-2 { animation-delay: 240ms; }
.anim-stagger-3 { animation-delay: 360ms; }
.anim-stagger-4 { animation-delay: 480ms; }
.anim-stagger-5 { animation-delay: 600ms; }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-40px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideLeft {
  from { opacity: 0; transform: translateX(-60px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slideRight {
  from { opacity: 0; transform: translateX(60px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

---

**Document Version:** 1.0
**Last Updated:** 2025-02-11
**Designer:** Claude (UX/UI Agent)
**Project:** ClaudeFit Fitness Tracker
