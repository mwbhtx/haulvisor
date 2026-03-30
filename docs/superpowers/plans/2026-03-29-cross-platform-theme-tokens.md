# Cross-Platform Theme Tokens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move all color tokens to `haulvisor-core` as the cross-platform source of truth, generate CSS from them, and replace every hardcoded color in the web app with theme tokens.

**Architecture:** Theme objects defined as TS in `haulvisor-core/src/themes/`. A build script generates `.dark`/`.light` CSS blocks. Web imports the generated CSS. React Native imports the TS objects directly. The existing `design-tokens.ts` in core gets superseded by the new theme system.

**Tech Stack:** TypeScript, Tailwind CSS v4, `@mwbhtx/haulvisor-core`

**Spec:** `docs/superpowers/specs/2026-03-29-cross-platform-theme-tokens-design.md`

---

### Task 1: Create Theme Type and Theme Objects in haulvisor-core

**Files:**
- Create: `/Users/matthewbennett/Documents/GitHub/haulvisor-core/src/themes/types.ts`
- Create: `/Users/matthewbennett/Documents/GitHub/haulvisor-core/src/themes/dark.ts`
- Create: `/Users/matthewbennett/Documents/GitHub/haulvisor-core/src/themes/light.ts`
- Create: `/Users/matthewbennett/Documents/GitHub/haulvisor-core/src/themes/index.ts`
- Modify: `/Users/matthewbennett/Documents/GitHub/haulvisor-core/src/index.ts`

- [ ] **Step 1: Create the Theme interface**

Create `/Users/matthewbennett/Documents/GitHub/haulvisor-core/src/themes/types.ts`:

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

- [ ] **Step 2: Create the dark theme**

Create `/Users/matthewbennett/Documents/GitHub/haulvisor-core/src/themes/dark.ts`:

```ts
import type { Theme } from './types.js';

export const dark: Theme = {
  brand: '#ff5601',
  brandForeground: '#ffffff',

  background: '#000000',
  foreground: 'oklch(0.985 0 0)',
  card: '#111111',
  cardForeground: 'oklch(0.985 0 0)',
  popover: 'oklch(0.13 0 0)',
  popoverForeground: 'oklch(0.985 0 0)',
  primary: '#ff5601',
  primaryForeground: 'oklch(1 0 0)',
  secondary: 'oklch(0.18 0 0)',
  secondaryForeground: 'oklch(0.985 0 0)',
  muted: 'oklch(0.18 0 0)',
  mutedForeground: 'oklch(0.708 0 0)',
  accent: 'oklch(0.18 0 0)',
  accentForeground: 'oklch(0.985 0 0)',
  accentAlt: '#fbff00',
  accentAltForeground: 'oklch(0 0 0)',
  destructive: 'oklch(0.704 0.191 22.216)',
  border: 'oklch(1 0 0 / 10%)',
  input: 'oklch(1 0 0 / 12%)',
  ring: 'oklch(0.556 0 0)',

  surfaceDeep: '#0b090c',
  surfaceElevated: '#161616',
  surfaceOverlay: '#1f1f1f',
  surfaceMuted: '#303030',
  surfaceMutedHover: '#3a3a3a',

  positive: '#22c55e',
  negative: '#ff6969',
  warning: 'rgba(245,158,11,0.7)',

  chart1: 'oklch(0.87 0 0)',
  chart2: 'oklch(0.556 0 0)',
  chart3: 'oklch(0.439 0 0)',
  chart4: 'oklch(0.371 0 0)',
  chart5: 'oklch(0.269 0 0)',
  chartCyan: '#06b6d4',
  chartPurple: '#8b5cf6',
  chartRed: '#ef4444',

  textSecondary: 'rgba(205,205,205,0.5)',
  textTertiary: 'rgba(205,205,205,0.4)',
  textSubtle: 'rgba(205,205,205,0.3)',
  textBody: '#cdcdcd',

  sidebar: 'oklch(0.13 0 0)',
  sidebarForeground: 'oklch(0.985 0 0)',
  sidebarPrimary: 'oklch(0.488 0.243 264.376)',
  sidebarPrimaryForeground: 'oklch(0.985 0 0)',
  sidebarAccent: 'oklch(0.18 0 0)',
  sidebarAccentForeground: 'oklch(0.205 0 0)',
  sidebarBorder: 'oklch(1 0 0 / 10%)',
  sidebarRing: 'oklch(0.556 0 0)',

  radius: '0.625rem',
};
```

- [ ] **Step 3: Create the light theme**

Create `/Users/matthewbennett/Documents/GitHub/haulvisor-core/src/themes/light.ts`:

```ts
import type { Theme } from './types.js';

export const light: Theme = {
  brand: '#ff5601',
  brandForeground: '#ffffff',

  background: 'oklch(1 0 0)',
  foreground: 'oklch(0.145 0 0)',
  card: '#dfdfdf',
  cardForeground: 'oklch(0.145 0 0)',
  popover: 'oklch(1 0 0)',
  popoverForeground: 'oklch(0.145 0 0)',
  primary: 'oklch(0.205 0 0)',
  primaryForeground: 'oklch(0.985 0 0)',
  secondary: 'oklch(0.97 0 0)',
  secondaryForeground: 'oklch(0.205 0 0)',
  muted: 'oklch(0.97 0 0)',
  mutedForeground: 'oklch(0.556 0 0)',
  accent: 'oklch(0.97 0 0)',
  accentForeground: 'oklch(0.205 0 0)',
  accentAlt: '#fbff00',
  accentAltForeground: 'oklch(0 0 0)',
  destructive: 'oklch(0.577 0.245 27.325)',
  border: 'oklch(0.922 0 0)',
  input: 'oklch(0.922 0 0)',
  ring: 'oklch(0.708 0 0)',

  surfaceDeep: 'oklch(0.97 0 0)',
  surfaceElevated: '#e8e8e8',
  surfaceOverlay: '#ebebeb',
  surfaceMuted: '#d5d5d5',
  surfaceMutedHover: '#cccccc',

  positive: '#16a34a',
  negative: '#dc2626',
  warning: 'rgba(217,119,6,0.85)',

  chart1: 'oklch(0.87 0 0)',
  chart2: 'oklch(0.556 0 0)',
  chart3: 'oklch(0.439 0 0)',
  chart4: 'oklch(0.371 0 0)',
  chart5: 'oklch(0.269 0 0)',
  chartCyan: '#0891b2',
  chartPurple: '#7c3aed',
  chartRed: '#dc2626',

  textSecondary: 'rgba(0,0,0,0.45)',
  textTertiary: 'rgba(0,0,0,0.35)',
  textSubtle: 'rgba(0,0,0,0.25)',
  textBody: 'oklch(0.3 0 0)',

  sidebar: 'oklch(0.985 0 0)',
  sidebarForeground: 'oklch(0.145 0 0)',
  sidebarPrimary: 'oklch(0.205 0 0)',
  sidebarPrimaryForeground: 'oklch(0.985 0 0)',
  sidebarAccent: 'oklch(0.97 0 0)',
  sidebarAccentForeground: 'oklch(0.205 0 0)',
  sidebarBorder: 'oklch(0.922 0 0)',
  sidebarRing: 'oklch(0.708 0 0)',

  radius: '0.625rem',
};
```

- [ ] **Step 4: Create the themes index**

Create `/Users/matthewbennett/Documents/GitHub/haulvisor-core/src/themes/index.ts`:

```ts
export type { Theme } from './types.js';
export { dark } from './dark.js';
export { light } from './light.js';
```

- [ ] **Step 5: Export themes from main index**

In `/Users/matthewbennett/Documents/GitHub/haulvisor-core/src/index.ts`, add at the end:

```ts
export * from './themes/index.js';
```

- [ ] **Step 6: Commit**

```bash
cd /Users/matthewbennett/Documents/GitHub/haulvisor-core
git add src/themes/ src/index.ts
git commit -m "feat: add cross-platform Theme type with dark and light theme objects"
```

---

### Task 2: Create CSS Generation Script in haulvisor-core

**Files:**
- Create: `/Users/matthewbennett/Documents/GitHub/haulvisor-core/src/themes/generate-css.ts`
- Modify: `/Users/matthewbennett/Documents/GitHub/haulvisor-core/package.json`

- [ ] **Step 1: Create the CSS generation script**

Create `/Users/matthewbennett/Documents/GitHub/haulvisor-core/src/themes/generate-css.ts`:

```ts
import * as fs from 'fs';
import * as path from 'path';
import { dark } from './dark.js';
import { light } from './light.js';
import type { Theme } from './types.js';

/** Convert camelCase to kebab-case */
function toKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/** Generate a CSS class block from a Theme object */
function themeToCSS(className: string, theme: Theme): string {
  const lines = Object.entries(theme).map(
    ([key, value]) => `  --${toKebab(key)}: ${value};`
  );
  return `.${className} {\n${lines.join('\n')}\n}`;
}

const css = [
  '/* Auto-generated from haulvisor-core theme definitions. Do not edit manually. */',
  themeToCSS('dark', dark),
  '',
  themeToCSS('light', light),
  '',
].join('\n');

const outDir = path.resolve(import.meta.dirname, '../../dist/themes');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'themes.css'), css, 'utf-8');

console.log('✓ Generated dist/themes/themes.css');
```

- [ ] **Step 2: Add generate-css script to package.json**

In `/Users/matthewbennett/Documents/GitHub/haulvisor-core/package.json`, update the scripts:

```json
"scripts": {
  "build": "tsc && node dist/themes/generate-css.js",
  "prepublishOnly": "npm run build"
},
```

Also add `"dist/themes/themes.css"` isn't needed separately since `"dist"` is already in the `files` array.

- [ ] **Step 3: Build and verify CSS output**

```bash
cd /Users/matthewbennett/Documents/GitHub/haulvisor-core
npm run build
cat dist/themes/themes.css
```

Expected: a CSS file with `.dark { --brand: #ff5601; --brand-foreground: #ffffff; ... }` and `.light { ... }` blocks, all keys in kebab-case.

- [ ] **Step 4: Commit**

```bash
cd /Users/matthewbennett/Documents/GitHub/haulvisor-core
git add src/themes/generate-css.ts package.json
git commit -m "feat: add CSS generation script for theme tokens"
```

---

### Task 3: Update globals.css to Import Generated Themes and Add New Token Mappings

**Files:**
- Modify: `/Users/matthewbennett/Documents/GitHub/haulvisor/src/app/globals.css`

- [ ] **Step 1: Replace .dark and .light blocks with generated CSS import**

In `src/app/globals.css`, remove the entire `.light { ... }` block (lines 70–104) and the entire `.dark { ... }` block (lines 106–137). Replace both with a single import after the `:root` block:

```css
@import "@mwbhtx/haulvisor-core/dist/themes/themes.css";
```

Keep `:root` as-is (just `--safe-area-bottom` and `--radius`). Note: `--radius` is now also in the generated CSS, but having it in `:root` as a fallback is fine — the `.dark`/`.light` class values will override it.

- [ ] **Step 2: Add new token mappings to @theme inline**

Add these lines inside the existing `@theme inline { }` block, after the existing color mappings:

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

- [ ] **Step 3: Verify the app still works**

```bash
cd /Users/matthewbennett/Documents/GitHub/haulvisor
npm run dev
```

Open the app — it should look identical to before. The generated CSS provides the same values that were previously handwritten. Toggle light/dark in settings to confirm both work.

- [ ] **Step 4: Commit**

```bash
cd /Users/matthewbennett/Documents/GitHub/haulvisor
git add src/app/globals.css
git commit -m "feat: import generated theme CSS from haulvisor-core, add new token mappings"
```

---

### Task 4: Replace Hardcoded Colors in location-sidebar.tsx

**Files:**
- Modify: `/Users/matthewbennett/Documents/GitHub/haulvisor/src/features/routes/views/desktop/location-sidebar.tsx`

This file has the most hardcoded colors. Every replacement below is a direct string substitution.

- [ ] **Step 1: Replace route card backgrounds**

Line 411 — replace:
```tsx
isSelected ? "bg-[#111111]" : "rounded-xl bg-[#111111] hover:bg-[#161616]"
```
With:
```tsx
isSelected ? "bg-card" : "rounded-xl bg-card hover:bg-surface-elevated"
```

- [ ] **Step 2: Replace metric label colors (style props)**

Replace all instances of `style={{ color: "rgba(205,205,205,0.5)" }}` with `className` additions. There are 6 instances (lines 417, 424, 431, 440, 461, 484).

For each, remove the `style` prop and add `text-text-secondary` to the element's `className`.

Line 417 — replace:
```tsx
<p className="text-sm uppercase tracking-wide" style={{ color: "rgba(205,205,205,0.5)" }}>$/Day</p>
```
With:
```tsx
<p className="text-sm uppercase tracking-wide text-text-secondary">$/Day</p>
```

Line 424 — replace:
```tsx
<p className="text-sm uppercase tracking-wide" style={{ color: "rgba(205,205,205,0.5)" }}>Profit</p>
```
With:
```tsx
<p className="text-sm uppercase tracking-wide text-text-secondary">Profit</p>
```

Line 431 — replace:
```tsx
<p className="text-sm uppercase tracking-wide" style={{ color: "rgba(205,205,205,0.5)" }}>Net/mi</p>
```
With:
```tsx
<p className="text-sm uppercase tracking-wide text-text-secondary">Net/mi</p>
```

Line 440 — replace:
```tsx
<p className="text-sm uppercase tracking-wide" style={{ color: "rgba(205,205,205,0.5)" }}>Miles</p>
```
With:
```tsx
<p className="text-sm uppercase tracking-wide text-text-secondary">Miles</p>
```

Line 461 — replace:
```tsx
<span className="text-sm" style={{ color: "rgba(205,205,205,0.5)" }}>{dateRange}</span>
```
With:
```tsx
<span className="text-sm text-text-secondary">{dateRange}</span>
```

Line 484 — replace:
```tsx
className="flex items-center gap-1.5 text-sm transition-colors w-full px-4 py-2.5" style={{ color: "rgba(205,205,205,0.5)" }}
```
With:
```tsx
className="flex items-center gap-1.5 text-sm transition-colors w-full px-4 py-2.5 text-text-secondary"
```

- [ ] **Step 3: Replace metric sub-label colors (tertiary text)**

Replace all instances of `style={{ color: "rgba(205,205,205,0.4)" }}` with `text-text-tertiary`. There are 4 instances (lines 421, 428, 436, and the non-warning part of 442).

Line 421 — replace:
```tsx
<p className="text-xs tabular-nums mt-0.5" style={{ color: "rgba(205,205,205,0.4)" }}>{chain.estimated_days.toFixed(1)} days est.</p>
```
With:
```tsx
<p className="text-xs tabular-nums mt-0.5 text-text-tertiary">{chain.estimated_days.toFixed(1)} days est.</p>
```

Line 428 — replace:
```tsx
<p className="text-xs tabular-nums mt-0.5" style={{ color: "rgba(205,205,205,0.4)" }}>{formatCurrency(chain.total_pay)} gross</p>
```
With:
```tsx
<p className="text-xs tabular-nums mt-0.5 text-text-tertiary">{formatCurrency(chain.total_pay)} gross</p>
```

Line 436 — replace:
```tsx
<p className="text-xs tabular-nums mt-0.5" style={{ color: "rgba(205,205,205,0.4)" }}>${avgLoadedRpm.toFixed(2)}/mi loaded</p>
```
With:
```tsx
<p className="text-xs tabular-nums mt-0.5 text-text-tertiary">${avgLoadedRpm.toFixed(2)}/mi loaded</p>
```

Line 442 — replace:
```tsx
<p className="text-xs tabular-nums mt-0.5" style={{ color: chain.deadhead_pct > 30 ? "rgba(245,158,11,0.7)" : "rgba(205,205,205,0.4)" }}>{chain.deadhead_pct.toFixed(0)}% DH</p>
```
With:
```tsx
<p className={`text-xs tabular-nums mt-0.5 ${chain.deadhead_pct > 30 ? "text-warning" : "text-text-tertiary"}`}>{chain.deadhead_pct.toFixed(0)}% DH</p>
```

- [ ] **Step 4: Replace segment header text**

Line 504 — replace:
```tsx
<p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(205,205,205,0.3)" }}>Segments</p>
```
With:
```tsx
<p className="text-xs font-semibold uppercase tracking-widest text-text-subtle">Segments</p>
```

- [ ] **Step 5: Replace surface backgrounds**

Line 479 — replace `bg-[#1f1f1f]` with `bg-surface-overlay`
Line 481 — replace `bg-[#111111]` with `bg-card`

Lines 509, 528, 618 — replace `bg-[#161616]` with `bg-surface-elevated` (3 instances in segment row containers)
Lines 512, 531, 621 — replace `bg-[#161616]` in the circle dots with `bg-surface-elevated` (3 instances)

Line 640 — replace `bg-[#161616] hover:bg-[#1e1e1e]` with `bg-surface-elevated hover:bg-surface-overlay`
Line 660 — replace `bg-[#303030] hover:bg-[#3a3a3a]` with `bg-surface-muted hover:bg-surface-muted-hover`
Line 666 — replace `bg-[#303030]` with `bg-surface-muted`

- [ ] **Step 6: Replace text-body colors (style props)**

Replace all `style={{ color: "#cdcdcd" }}` with `text-text-body` in className. There are 6 instances (lines 491, 516, 535, 589, 602, 625).

Line 491 — replace:
```tsx
style={{ color: "#cdcdcd" }}
```
Remove the style prop and add `text-text-body` to the className.

Apply the same pattern to lines 516, 535, 589, 602, 625.

- [ ] **Step 7: Replace negative (deadhead cost) colors**

Lines 517, 538, 626 — replace `style={{ color: "#ff6969" }}` by removing the style prop and adding `text-negative` to className.

- [ ] **Step 8: Replace brand color and speculative text**

Line 570 — replace `text-[#ff5601]` with `text-brand`
Line 583 — replace `text-[#cdcdcd]` with `text-text-body`
Line 643 — replace `text-[#cdcdcd]` with `text-text-body`
Line 663 — replace `text-[#cdcdcd]` with `text-text-body`

- [ ] **Step 9: Commit**

```bash
cd /Users/matthewbennett/Documents/GitHub/haulvisor
git add src/features/routes/views/desktop/location-sidebar.tsx
git commit -m "feat: replace all hardcoded colors in location-sidebar with theme tokens"
```

---

### Task 5: Replace Hardcoded Colors in route-inspector.tsx

**Files:**
- Modify: `/Users/matthewbennett/Documents/GitHub/haulvisor/src/features/routes/components/route-inspector.tsx`

- [ ] **Step 1: Replace backgrounds and brand colors**

Line 39 — replace `bg-[#111111]` with `bg-card`
Line 167 — replace `text-[#ff5601]/60` with `text-brand/60`
Line 168 — replace `text-[#ff5601]/70` with `text-brand/70`

- [ ] **Step 2: Commit**

```bash
cd /Users/matthewbennett/Documents/GitHub/haulvisor
git add src/features/routes/components/route-inspector.tsx
git commit -m "feat: replace hardcoded colors in route-inspector with theme tokens"
```

---

### Task 6: Replace Hardcoded Colors in Landing Page and Login

**Files:**
- Modify: `/Users/matthewbennett/Documents/GitHub/haulvisor/src/app/page.tsx`
- Modify: `/Users/matthewbennett/Documents/GitHub/haulvisor/src/app/login/page.tsx`

- [ ] **Step 1: Update page.tsx**

Line 64 — replace `bg-[#ff5601]` with `bg-brand`
Line 120 — replace `!bg-[#0b090c]` with `!bg-surface-deep`
Line 122 — replace `text-[#d6d6d6]` with `text-text-body`
Line 133 — replace `bg-[#0f0d0f]` with `bg-surface-deep`
Line 139 — replace `text-[#ff5601]` with `text-brand`
Line 172 — replace `bg-[#0b090c]` with `bg-surface-deep`

Note: The ShaderGradient color props (lines 77–79: `color1="#ff6a1a"`, `color2="#c73c00"`, `color3="#FD4912"`) are WebGL shader inputs — leave these hardcoded as they are visual effect parameters, not UI tokens.

- [ ] **Step 2: Update login/page.tsx**

Line 83 — replace `bg-[#0b090c]` with `bg-surface-deep`
Lines 97, 98, 104, 105 — replace `focus-visible:!border-[#ff5601] focus-visible:!ring-[#ff5601]/50` with `focus-visible:!border-brand focus-visible:!ring-brand/50` (4 Input elements)
Line 100 — replace `bg-[#0b090c]` with `bg-surface-deep`

- [ ] **Step 3: Commit**

```bash
cd /Users/matthewbennett/Documents/GitHub/haulvisor
git add src/app/page.tsx src/app/login/page.tsx
git commit -m "feat: replace hardcoded colors in landing page and login with theme tokens"
```

---

### Task 7: Replace Hardcoded Colors in Chart Components

**Files:**
- Modify: `/Users/matthewbennett/Documents/GitHub/haulvisor/src/features/dashboard/components/order-history-chart.tsx`
- Modify: `/Users/matthewbennett/Documents/GitHub/haulvisor/src/features/dashboard/components/top-cities-chart.tsx`

- [ ] **Step 1: Update order-history-chart.tsx**

These chart configs use hardcoded hex colors. Replace the config color values with CSS var references using `hsl(var(...))` syntax — but since these are recharts configs (not Tailwind classes), they need raw CSS var values.

Replace the chart configs to use CSS custom property values. Since recharts needs actual color strings and can't resolve CSS vars at config time, use the `var()` syntax in the inline color values:

Line 30 — replace `color: "#06b6d4"` with `color: "var(--chart-cyan)"`
Line 37 — replace `color: "#8b5cf6"` with `color: "var(--chart-purple)"`
Line 41 — replace `color: "#ef4444"` with `color: "var(--chart-red)"`

Lines 123–124 — replace `stopColor="#06b6d4"` with `stopColor="var(--chart-cyan)"` (2 instances)
Line 142 — replace `stroke="#06b6d4"` with `stroke="var(--chart-cyan)"`
Lines 176–177 — replace `stopColor="#8b5cf6"` with `stopColor="var(--chart-purple)"` (2 instances)
Lines 180–181 — replace `stopColor="#ef4444"` with `stopColor="var(--chart-red)"` (2 instances)

- [ ] **Step 2: Update top-cities-chart.tsx**

Line 22 — replace `color: "#22c55e"` with `color: "var(--positive)"`

- [ ] **Step 3: Commit**

```bash
cd /Users/matthewbennett/Documents/GitHub/haulvisor
git add src/features/dashboard/components/order-history-chart.tsx src/features/dashboard/components/top-cities-chart.tsx
git commit -m "feat: replace hardcoded chart colors with theme tokens"
```

---

### Task 8: Replace Hardcoded Colors in search-form.tsx

**Files:**
- Modify: `/Users/matthewbennett/Documents/GitHub/haulvisor/src/features/routes/components/search-form.tsx`

- [ ] **Step 1: Replace border-beam brand colors**

Line 381 — replace `colorFrom="#ff5601"` with `colorFrom="var(--brand)"`
Line 382 — replace `colorTo="#ff7a33"` with `colorTo="var(--brand)"`

- [ ] **Step 2: Commit**

```bash
cd /Users/matthewbennett/Documents/GitHub/haulvisor
git add src/features/routes/components/search-form.tsx
git commit -m "feat: replace hardcoded brand colors in search-form with theme tokens"
```

---

### Task 9: Build Check and Final Verification

**Files:**
- None new — verification only

- [ ] **Step 1: Rebuild haulvisor-core**

```bash
cd /Users/matthewbennett/Documents/GitHub/haulvisor-core
npm run build
```

Expected: Build succeeds, `dist/themes/themes.css` is generated.

- [ ] **Step 2: Build haulvisor web app**

```bash
cd /Users/matthewbennett/Documents/GitHub/haulvisor
npm run build
```

Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 3: Search for remaining hardcoded colors**

```bash
cd /Users/matthewbennett/Documents/GitHub/haulvisor
grep -rn '#[0-9a-fA-F]\{3,8\}\|rgba\?\(' src/ --include='*.tsx' --include='*.ts' --include='*.css' | grep -v node_modules | grep -v 'globals.css' | grep -v 'ShaderGradient\|color1\|color2\|color3\|setPaintProperty\|circle-color\|circle-stroke\|fillStyle\|strokeStyle\|addColorStop\|topo-background'
```

Review any remaining hardcoded colors. Canvas/WebGL/Mapbox colors are excluded from this pass (they operate outside the DOM CSS system).

- [ ] **Step 4: Commit any remaining fixes**

```bash
cd /Users/matthewbennett/Documents/GitHub/haulvisor
git add -A
git commit -m "fix: cleanup remaining hardcoded color references"
```
