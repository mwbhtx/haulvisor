# Cross-Platform Theme Tokens Design

**Date:** 2026-03-29
**Status:** Draft

## Overview

Extract all hardcoded colors from the haulvisor web app into a cross-platform token system defined in `@mwbhtx/haulvisor-core`. Both the web app (CSS vars) and future React Native app (direct TS import) consume from the same source of truth.

## Goals

1. Define a `Theme` interface and dark/light theme objects in `haulvisor-core`
2. Generate CSS var blocks from the theme objects (build-time, no runtime adapter)
3. Replace every hardcoded color in the web app with theme tokens
4. React Native can import theme objects directly — no additional tooling needed
5. Adding a new theme = add a new TS object in `haulvisor-core`

## Non-Goals

- Runtime theme switching beyond dark/light/system (custom theme builder is future work)
- React Native implementation (just needs to be consumable, not consumed yet)
- Refactoring component structure — only changing color references

## Architecture

```
haulvisor-core/src/themes/
  ├── types.ts         ← Theme interface
  ├── dark.ts          ← dark theme values
  ├── light.ts         ← light theme values
  ├── index.ts         ← re-exports
  └── generate-css.ts  ← script: reads theme objects, outputs CSS var blocks

haulvisor (web):
  globals.css          ← @theme inline (Tailwind mapping) + generated .dark/.light blocks

Future React Native:
  import { dark, light } from '@mwbhtx/haulvisor-core/themes'
  → use values directly in StyleSheet.create()
```

### What lives where

**In `haulvisor-core` (source of truth):**
- `Theme` type definition
- All color and radius values for each theme
- A build script that generates CSS from the theme objects

**In `globals.css` (web consumer):**
- `@theme inline` block — maps CSS vars to Tailwind utility classes (e.g., `--color-brand: var(--brand)`)
- `:root` — shared non-color tokens (safe-area, font families)
- `.dark` / `.light` blocks — generated from `haulvisor-core` theme objects
- Animations, scrollbar styling, base layer rules

**In React Native (future consumer):**
- Direct import of theme objects, used in `StyleSheet.create()`

### Build flow

1. Edit a theme in `haulvisor-core/src/themes/dark.ts`
2. Run `npm run build` in `haulvisor-core` (includes CSS generation)
3. Output: `haulvisor-core/dist/themes/themes.css` containing `.dark { ... }` and `.light { ... }` blocks
4. Web app imports this CSS file in `globals.css` via `@import`
5. Restart dev server — done

## Token Schema

```ts
export interface Theme {
  // Brand
  brand: string;
  brandForeground: string;

  // Core UI
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  accentAlt: string;
  accentAltForeground: string;
  destructive: string;
  border: string;
  input: string;
  ring: string;

  // Surfaces (layered depth)
  surfaceDeep: string;
  surfaceElevated: string;
  surfaceOverlay: string;
  surfaceMuted: string;
  surfaceMutedHover: string;

  // Semantic status
  positive: string;
  negative: string;
  warning: string;

  // Charts
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  chartCyan: string;
  chartPurple: string;
  chartRed: string;

  // Text variants
  textSecondary: string;
  textTertiary: string;
  textSubtle: string;
  textBody: string;

  // Sidebar
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;

  // Layout
  radius: string;
}
```

## Token Values

### Dark Theme

| Token | Value | Usage |
|-------|-------|-------|
| `brand` | `#ff5601` | Brand orange — flame icons, feature icons, focus rings |
| `brandForeground` | `#ffffff` | Text on brand backgrounds |
| `background` | `#000000` | App background |
| `foreground` | `oklch(0.985 0 0)` | Primary text |
| `card` | `#111111` | Card backgrounds, route list containers |
| `cardForeground` | `oklch(0.985 0 0)` | Text on cards |
| `popover` | `oklch(0.13 0 0)` | Popover backgrounds |
| `popoverForeground` | `oklch(0.985 0 0)` | Popover text |
| `primary` | `#ff5601` | Primary buttons, active nav |
| `primaryForeground` | `oklch(1 0 0)` | Text on primary |
| `secondary` | `oklch(0.18 0 0)` | Secondary surfaces |
| `secondaryForeground` | `oklch(0.985 0 0)` | Text on secondary |
| `muted` | `oklch(0.18 0 0)` | Muted backgrounds |
| `mutedForeground` | `oklch(0.708 0 0)` | Muted text |
| `accent` | `oklch(0.18 0 0)` | Accent surfaces |
| `accentForeground` | `oklch(0.985 0 0)` | Text on accent |
| `accentAlt` | `#fbff00` | Alt accent (yellow) |
| `accentAltForeground` | `oklch(0 0 0)` | Text on alt accent |
| `destructive` | `oklch(0.704 0.191 22.216)` | Destructive actions |
| `border` | `oklch(1 0 0 / 10%)` | Borders |
| `input` | `oklch(1 0 0 / 12%)` | Input borders |
| `ring` | `oklch(0.556 0 0)` | Focus rings |
| `surfaceDeep` | `#0b090c` | Landing page, login bg |
| `surfaceElevated` | `#161616` | Route card rows, segment rows |
| `surfaceOverlay` | `#1f1f1f` | Cost breakdown, expandable panels |
| `surfaceMuted` | `#303030` | Collapsed panels, chevron bg |
| `surfaceMutedHover` | `#3a3a3a` | Hover on muted surfaces |
| `positive` | `#22c55e` | Profit, success indicators |
| `negative` | `#ff6969` | Loss, deadhead cost text |
| `warning` | `rgba(245,158,11,0.7)` | High deadhead % |
| `chart1` | `oklch(0.87 0 0)` | Chart series 1 |
| `chart2` | `oklch(0.556 0 0)` | Chart series 2 |
| `chart3` | `oklch(0.439 0 0)` | Chart series 3 |
| `chart4` | `oklch(0.371 0 0)` | Chart series 4 |
| `chart5` | `oklch(0.269 0 0)` | Chart series 5 |
| `chartCyan` | `#06b6d4` | Order history chart line |
| `chartPurple` | `#8b5cf6` | Chart purple series |
| `chartRed` | `#ef4444` | Chart red series |
| `textSecondary` | `rgba(205,205,205,0.5)` | Route card labels ($/Day, Profit, etc.) |
| `textTertiary` | `rgba(205,205,205,0.4)` | Sub-labels (days est., gross) |
| `textSubtle` | `rgba(205,205,205,0.3)` | Segment headers |
| `textBody` | `#cdcdcd` | Route card body text |
| `sidebar` | `oklch(0.13 0 0)` | Sidebar bg |
| `sidebarForeground` | `oklch(0.985 0 0)` | Sidebar text |
| `sidebarPrimary` | `oklch(0.488 0.243 264.376)` | Sidebar primary |
| `sidebarPrimaryForeground` | `oklch(0.985 0 0)` | Text on sidebar primary |
| `sidebarAccent` | `oklch(0.18 0 0)` | Sidebar accent |
| `sidebarAccentForeground` | `oklch(0.205 0 0)` | Text on sidebar accent |
| `sidebarBorder` | `oklch(1 0 0 / 10%)` | Sidebar borders |
| `sidebarRing` | `oklch(0.556 0 0)` | Sidebar focus rings |
| `radius` | `0.625rem` | Border radius base |

### Light Theme

| Token | Value |
|-------|-------|
| `brand` | `#ff5601` |
| `brandForeground` | `#ffffff` |
| `background` | `oklch(1 0 0)` |
| `foreground` | `oklch(0.145 0 0)` |
| `card` | `#dfdfdf` |
| `cardForeground` | `oklch(0.145 0 0)` |
| `popover` | `oklch(1 0 0)` |
| `popoverForeground` | `oklch(0.145 0 0)` |
| `primary` | `oklch(0.205 0 0)` |
| `primaryForeground` | `oklch(0.985 0 0)` |
| `secondary` | `oklch(0.97 0 0)` |
| `secondaryForeground` | `oklch(0.205 0 0)` |
| `muted` | `oklch(0.97 0 0)` |
| `mutedForeground` | `oklch(0.556 0 0)` |
| `accent` | `oklch(0.97 0 0)` |
| `accentForeground` | `oklch(0.205 0 0)` |
| `accentAlt` | `#fbff00` |
| `accentAltForeground` | `oklch(0 0 0)` |
| `destructive` | `oklch(0.577 0.245 27.325)` |
| `border` | `oklch(0.922 0 0)` |
| `input` | `oklch(0.922 0 0)` |
| `ring` | `oklch(0.708 0 0)` |
| `surfaceDeep` | `oklch(0.97 0 0)` |
| `surfaceElevated` | `#e8e8e8` |
| `surfaceOverlay` | `#ebebeb` |
| `surfaceMuted` | `#d5d5d5` |
| `surfaceMutedHover` | `#cccccc` |
| `positive` | `#16a34a` |
| `negative` | `#dc2626` |
| `warning` | `rgba(217,119,6,0.85)` |
| `chart1` | `oklch(0.87 0 0)` |
| `chart2` | `oklch(0.556 0 0)` |
| `chart3` | `oklch(0.439 0 0)` |
| `chart4` | `oklch(0.371 0 0)` |
| `chart5` | `oklch(0.269 0 0)` |
| `chartCyan` | `#0891b2` |
| `chartPurple` | `#7c3aed` |
| `chartRed` | `#dc2626` |
| `textSecondary` | `rgba(0,0,0,0.45)` |
| `textTertiary` | `rgba(0,0,0,0.35)` |
| `textSubtle` | `rgba(0,0,0,0.25)` |
| `textBody` | `oklch(0.3 0 0)` |
| `sidebar` | `oklch(0.985 0 0)` |
| `sidebarForeground` | `oklch(0.145 0 0)` |
| `sidebarPrimary` | `oklch(0.205 0 0)` |
| `sidebarPrimaryForeground` | `oklch(0.985 0 0)` |
| `sidebarAccent` | `oklch(0.97 0 0)` |
| `sidebarAccentForeground` | `oklch(0.205 0 0)` |
| `sidebarBorder` | `oklch(0.922 0 0)` |
| `sidebarRing` | `oklch(0.708 0 0)` |
| `radius` | `0.625rem` |

## CSS Integration

### `@theme inline` block additions

New Tailwind utility mappings added to the existing `@theme inline` block:

```css
--color-brand: var(--brand);
--color-brand-foreground: var(--brand-foreground);
--color-surface-deep: var(--surface-deep);
--color-surface-elevated: var(--surface-elevated);
--color-surface-overlay: var(--surface-overlay);
--color-surface-muted: var(--surface-muted);
--color-surface-muted-hover: var(--surface-muted-hover);
--color-positive: var(--positive);
--color-negative: var(--negative);
--color-warning: var(--warning);
--color-chart-cyan: var(--chart-cyan);
--color-chart-purple: var(--chart-purple);
--color-chart-red: var(--chart-red);
--color-text-secondary: var(--text-secondary);
--color-text-tertiary: var(--text-tertiary);
--color-text-subtle: var(--text-subtle);
--color-text-body: var(--text-body);
```

This enables Tailwind classes like `bg-brand`, `text-positive`, `bg-surface-elevated`, `text-text-secondary`, etc.

### Generated CSS import

```css
/* globals.css */
@import "@mwbhtx/haulvisor-core/themes/themes.css";
```

This replaces the handwritten `.dark { ... }` and `.light { ... }` blocks.

## CSS Generation Script

`haulvisor-core/src/themes/generate-css.ts`:

Reads the dark and light theme objects, converts camelCase keys to kebab-case CSS var names, and outputs a CSS file:

```css
/* Auto-generated from haulvisor-core theme definitions. Do not edit manually. */
.dark {
  --brand: #ff5601;
  --brand-foreground: #ffffff;
  --background: #000000;
  /* ... */
}

.light {
  --brand: #ff5601;
  --brand-foreground: #ffffff;
  --background: oklch(1 0 0);
  /* ... */
}
```

This script runs as part of `npm run build` in `haulvisor-core`. Output goes to `dist/themes/themes.css`.

## Web App Replacements

Every hardcoded color in the web app gets replaced with the corresponding theme token. Key files:

| File | Hardcoded values | Replacement tokens |
|------|-----------------|-------------------|
| `location-sidebar.tsx` | `#111111`, `#161616`, `#1f1f1f`, `#303030`, `#3a3a3a`, `#cdcdcd`, `rgba(205,205,205,*)`, `#ff6969`, `#ff5601` | `card`, `surface-elevated`, `surface-overlay`, `surface-muted`, `surface-muted-hover`, `text-body`, `text-secondary/tertiary/subtle`, `negative`, `brand` |
| `page.tsx` (landing) | `#ff5601`, `#0b090c`, `#0f0d0f`, `#d6d6d6` | `brand`, `surface-deep`, `surface-deep`, `text-body` |
| `login/page.tsx` | `#0b090c`, `#ff5601` | `surface-deep`, `brand` |
| `route-inspector.tsx` | `#111111`, `#ff5601` | `card`, `brand` |
| `route-map.tsx` | `#22c55e`, `#ffffff` | `positive`, `foreground` (map-specific colors may stay hardcoded if they're Mapbox paint properties) |
| `search-form.tsx` | `#ff5601`, `#ff7a33` | `brand` (border-beam gradient colors) |
| `order-history-chart.tsx` | `#06b6d4`, `#8b5cf6`, `#ef4444` | `chart-cyan`, `chart-purple`, `chart-red` |
| `top-cities-chart.tsx` | `#22c55e` | `positive` |
| `desktop-routes-view.tsx` | already converted to `bg-card` | done |

## Adding a Future Theme

1. Create `haulvisor-core/src/themes/midnight.ts` implementing `Theme`
2. Add it to the CSS generation script
3. Add `"midnight"` to the `next-themes` config's `themes` array
4. Add the option to the theme selector component
5. Run `npm run build` in `haulvisor-core`

Both web and React Native pick up the new theme with no structural changes.

## Files Changed

### haulvisor-core (new files)

| File | Action |
|------|--------|
| `src/themes/types.ts` | Create — `Theme` interface |
| `src/themes/dark.ts` | Create — dark theme values |
| `src/themes/light.ts` | Create — light theme values |
| `src/themes/index.ts` | Create — re-exports |
| `src/themes/generate-css.ts` | Create — build script |
| `package.json` | Modify — add build step for CSS generation |

### haulvisor (web app modifications)

| File | Action |
|------|--------|
| `src/app/globals.css` | Modify — import generated CSS, add new `@theme inline` mappings, remove handwritten `.dark`/`.light` blocks |
| `src/features/routes/views/desktop/location-sidebar.tsx` | Modify — replace all hardcoded colors |
| `src/app/page.tsx` | Modify — replace hardcoded colors |
| `src/app/login/page.tsx` | Modify — replace hardcoded colors |
| `src/features/routes/components/route-inspector.tsx` | Modify — replace hardcoded colors |
| `src/features/routes/components/search-form.tsx` | Modify — replace hardcoded colors |
| `src/features/dashboard/components/order-history-chart.tsx` | Modify — replace hardcoded colors |
| `src/features/dashboard/components/top-cities-chart.tsx` | Modify — replace hardcoded colors |
