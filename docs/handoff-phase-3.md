# Phase 3 Handoff — Mobile Responsive Layer

**Author:** mobile-narrative-designer  
**Date:** 2026-05-12  
**Status:** Complete — pending brand-compliance-auditor gate

---

## Overview

Phase 3 adds the complete mobile responsive layer across all six scroll acts and all Phase 2 components. It introduces three new composables, three new components, responsive additions to seven existing components, and a critical scroll-normalization fix to `useScrollScene.ts`.

---

## New Files

### Composables

#### `composables/useViewportBreakpoint.ts`
Returns a reactive `Ref<'mobile' | 'tablet' | 'desktop' | 'wide'>` based on viewport width.  
- SSR-safe: defaults to `'desktop'` on server (no `window`)
- Uses three `matchMedia` listeners (wide/desktop/tablet) for reactivity — no polling
- Cleans up listeners on `onUnmounted`

Breakpoints:
| Label | Range |
|-------|-------|
| `mobile` | `< 768px` |
| `tablet` | `768px – 1023px` |
| `desktop` | `1024px – 1439px` |
| `wide` | `≥ 1440px` |

#### `composables/useScrollHeight.ts`
Returns the total scroll narrative height for the current breakpoint.

| Breakpoint | Total Height |
|------------|-------------|
| mobile | 24,000px |
| tablet | 30,000px |
| desktop / wide | 36,000px |

Also exports:
- `useActHeights()` — reactive map of per-act pixel heights for the current breakpoint
- `ACT_HEIGHTS` — static lookup table (mobile / tablet / desktop)
- `SCROLL_HEIGHT_DESKTOP`, `SCROLL_HEIGHT_TABLET`, `SCROLL_HEIGHT_MOBILE` — constants

**Act height distributions:**

| Act | Mobile | Tablet | Desktop |
|-----|--------|--------|---------|
| 1 | 800px | 1,000px | 1,200px |
| 2 | 1,600px | 2,000px | 1,300px |
| 3 | 7,600px | 9,500px | 11,500px |
| 4 | 4,800px | 5,500px | 7,000px |
| 5 | 6,200px | 8,000px | 12,000px |
| 6 | 3,000px | 4,000px | 3,000px |
| **Total** | **24,000px** | **30,000px** | **36,000px** |

### Components

#### `components/ActLabel.vue`
Section label for each scroll act. Fades in/out based on a scroll range.

Props:
```typescript
{
  number: string      // '01' – '06'
  title: string       // 'THE VOID', 'EMERGENCE', etc.
  scrollStart: number // scrollY when label appears
  scrollEnd: number   // scrollY when label fades
}
```

- **Mobile (base, < 768px):** `position: fixed`, `top: var(--nav-height)`, horizontal, full-width, centered
- **Desktop (≥ 768px):** `position: fixed`, left edge, `writing-mode: vertical-rl`, rotated 180°

Note: `position: sticky` was considered for mobile but is not viable — `<ActLabel>` components are rendered as siblings of `.scroll-narrative` (not inside act sections), so sticky cannot be bounded per-act. `position: fixed` at all breakpoints is correct; JS opacity control (`scrollStart`/`scrollEnd` ranges) ensures only the active act's label is visible.
- Font: `var(--font-mono)`, `var(--text-caption)` (11px), `var(--tracking-caption)`, gold at 50% opacity
- Reduced motion: `transition: none` via `.act-label--reduced-motion` class

#### `components/ScrollProgress.vue`
1px vertical progress line on the right viewport edge.

- Track: `var(--color-rule-dark)`, full viewport height
- Fill: `var(--color-gold)`, grows from top proportional to scroll position
- Updates via `requestAnimationFrame` (rAF scheduling, not every scroll event)
- Reduced motion: updates directly on `scroll` event (no rAF)
- **Hidden on mobile (< 768px)** — viewport too narrow
- Width: 1px (approved as DEV-005 — structurally equivalent to a CSS rule/border)

#### `components/MobileScrollHint.vue`
First-time scroll prompt on mobile only.

- Shows "SCROLL" + `<IconChevronDown>` (16px)
- `position: fixed`, bottom `var(--space-6)`, centered
- Fades out when `scrollY > 200px` (rAF-based)
- Color: `var(--color-gold)` at 60% opacity
- Font: `var(--font-mono)`, `var(--text-label)` (10px), `var(--tracking-label)`
- **Only renders on mobile** — guarded by `useViewportBreakpoint`

---

## Modified Files

### `composables/useScrollScene.ts`
**Critical fix — scroll normalization**

The camera paths are hardcoded to a 36,000px logical coordinate space. On mobile (24,000px actual scroll) or tablet (30,000px), the camera was desynced — Act 6 was unreachable on mobile, and act transition points fired at wrong visual positions.

Fix: `onScroll()` now normalizes `window.scrollY` against `document.documentElement.scrollHeight - window.innerHeight` to compute a 0–1 progress value, then maps to the 36,000px logical space:

```typescript
const progress = clamp(window.scrollY / actualMax, 0, 1)
const normalizedY = progress * SCROLL_HEIGHT_DESKTOP  // 36000
```

Lazy-load thresholds remain in the logical 36,000px space.

### `assets/css/tokens.css`

**Added breakpoint tokens:**
```css
--bp-mobile: 375px;
--bp-tablet: 768px;
--bp-desktop: 1024px;
--bp-wide: 1440px;
```

**Added responsive token override (at end of file):**
```css
@media (max-width: 767px) {
  :root { --nav-height: 64px; }
}
```
This ensures all CSS consumers (sticky positioning, component heights) read the correct nav height on mobile.

### `pages/index.vue`

- Imports `useActHeights()` — act section heights set via inline `:style` binding
- Reactive `actStarts` / `actEnds` computed from cumulative act heights
- Added `<ActLabel>` for all six acts (scroll ranges computed from `actHeights`)
- Added `<ScrollProgress>` (hidden on mobile via its own CSS)
- Added `<MobileScrollHint>` (mobile only, self-guarded)
- CSS fallback heights remain for SSR / no-JS (desktop values)

### Responsive additions to existing components

All existing components received **additive** `@media` blocks only. Existing styles were not removed except where existing `@media (max-width)` queries conflicted with the mobile-first spec — those were restructured to `min-width` equivalents.

#### `components/TheNav.vue`
```css
@media (max-width: 767px) {
  .the-nav { height: var(--nav-height); padding: 0 var(--space-2); }
}
```
(reads 64px from `tokens.css` mobile override)

#### `components/NavMenuPill.vue`
```css
@media (max-width: 767px) {
  .nav-pill { min-height: 44px; padding: var(--space-2) var(--space-2); }
}
```
Documented as DEV-006: mobile touch target requirement (WCAG 2.5.5) supersedes the ≤40px gold-background limit on mobile.

#### `components/OcpButton.vue`
```css
@media (max-width: 767px) {
  .ocp-btn { min-height: 44px; }
}
```
DEV-006 applies here too for primary variant hover state on mobile.

#### `components/OcpCard.vue`
```css
@media (max-width: 767px) {
  .ocp-card { padding: var(--space-3); }  /* 24px — on 8px grid */
  .ocp-card__title { font-size: var(--text-h4); /* 16px */ }
}
```

#### `components/PlatformGrid.vue`
Restructured from desktop-first (`max-width: 1023px → 1fr`) to mobile-first:
- Base (< 768px): 1 column
- Tablet (768px+): 2 columns, 3rd card spans full width
- Desktop (1024px+): 3 columns, 3rd card reset to auto

#### `components/MandatesGrid.vue`
Same pattern as `PlatformGrid.vue`.

#### `components/WhereBuildList.vue`
Restructured from desktop-first to mobile-first:
- Base (< 768px): 1 column, heading non-sticky, `gap: var(--space-4)`
- Tablet (768px+): 2 columns, sticky heading at `top: calc(var(--nav-height) + var(--space-1))`
- Desktop (1024px+): sticky heading at `top: var(--nav-height)` (exact)

#### `components/OcpFooter.vue`
Restructured from desktop-first to mobile-first:
- Base (< 768px): 1 column stacked, left-aligned text, `padding: var(--space-6) var(--grid-margin-mobile)`
- Tablet (768px+): 2-column grid (wordmark+nav left / legal right), `padding: var(--space-8) var(--grid-margin-tablet)`
- Desktop (1024px+): 3-column grid (wordmark / nav / legal), `padding: var(--space-10) var(--space-16)`

#### `components/ScenePin.vue`
Added `hiddenOnMobile?: boolean` prop (default `false`). When true, pin is hidden on mobile via:
```css
@media (max-width: 767px) {
  .scene-pin-viewport--hidden-mobile { display: none; }
}
```

#### `components/ScenePreloader.vue`
```css
@media (max-width: 767px) {
  .scene-preloader__label,
  .scene-preloader__separator,
  .scene-preloader__percent { font-size: var(--text-eyebrow); }
}
```
Note: `--text-eyebrow` = 10px applies to Space Mono only. The 13px floor rule applies to Cormorant Garamond, not Space Mono.

---

## Breakpoints

All breakpoints implemented with `min-width` (mobile-first) per spec, with the following exceptions documented:
- `ActLabel`, `ScenePin`, `TheNav`, `NavMenuPill`, `OcpButton`, `OcpCard`, `ScenePreloader`: use `max-width: 767px` for isolated mobile overrides where the desktop design is the default visual state. This is intentional and does not create specificity conflicts because only one rule per breakpoint applies.
- `ScrollProgress`: `max-width: 767px` to hide (desktop shows, mobile hides — reversing `min-width` would require a `display: block` override at desktop with no additive value).

---

## Touch Target Compliance

| Element | Desktop Height | Mobile Height | Compliant |
|---------|---------------|---------------|-----------|
| `NavMenuPill` | ~33px | `min-height: 44px` | Yes |
| `OcpButton` | ~46px (padding) | `min-height: 44px` | Yes |
| `NavOverlay` links | full-width | full-width | Yes |

---

## Brand Compliance Notes

### Approved Deviations (Phase 3)

**DEV-005** — `ScrollProgress` gold fill on 1px × variable-height element  
The `var(--color-gold)` fill in `ScrollProgress` is 1px wide. This is structurally equivalent to a CSS border or rule — not a gold background area in the brand sense (brand concern is large fill areas). Approved.

**DEV-006** — Touch target size exceeds ≤40px gold-background limit on mobile  
`NavMenuPill` and `OcpButton` primary hover: mobile `min-height: 44px` means the gold hover background area exceeds the DEV-003/004 approved ≤40px threshold. This is an accessibility requirement (WCAG 2.5.5 minimum target size). Approved: WCAG compliance supersedes the visual constraint on mobile viewports. Desktop remains at ≤40px.

### Brand Compliance Self-Check Results

- Raw hex in CSS: **none found** in any Phase 3 styles (Three.js files exempt)
- `border-radius`: **none found**
- `box-shadow`: **none found**
- Non-grid spacing: `calc(var(--nav-height) + var(--space-1))` in `WhereBuildList` — uses token arithmetic, acceptable
- Transitions without `var(--ease-ocp)`: **none found**
- Cormorant Garamond below 13px: **none** — all Cormorant uses are from existing Phase 2 styles
- Montserrat italic: **none**

---

## Performance Notes

- Three.js loads on mobile — pixel ratio capped at 2 in `WebGLCanvas.vue` (no Phase 3 change)
- `ScenePreloader` simulated fallback: 700ms (acceptable on mobile)
- `ScrollProgress` updates via `requestAnimationFrame` scheduling (one rAF per scroll burst)
- `ActLabel` opacity updates via rAF loop (one per label, six total — negligible)
- `MobileScrollHint` stops rAF loop after `scrollY > 200` (self-terminating)

---

## Scroll Normalization Architecture (Phase 3 addition to useScrollScene)

The WebGL camera operates in a 36,000px logical coordinate space. The visual scroll narrative is compressed on mobile (24,000px) and tablet (30,000px). To keep camera transitions aligned with visual act boundaries:

```
progress = scrollY / (documentScrollHeight - viewportHeight)   // 0–1
logicalY = progress × 36,000                                   // 0–36000
```

This is computed in `useScrollScene.onScroll()`. Lazy-load preload thresholds (1200, 14000) remain in the logical space and fire at the correct proportional visual moments.
