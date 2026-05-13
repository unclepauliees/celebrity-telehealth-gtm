# Phase 1 Handoff — nuxt-shell-architect

**Agent:** `nuxt-shell-architect`
**Date:** 2026-05-12
**Build status:** PASS — `npm run build` clean, 12/12 Playwright tests passing
**Hands off to:** `brand-compliance-auditor` (Phase 1 audit), then `webgl-scene-engineer` (Phase 2)

---

## How to run

```bash
# Install dependencies
npm install

# Run type generation (required before dev/build)
./node_modules/.bin/nuxt prepare

# Development server (SSR)
npm run dev         # → http://localhost:3000

# Production build
npm run build       # → .output/

# Preview production build
npm run preview     # Runs node .output/server/index.mjs

# Run Playwright tests (requires production build)
npm run build && npm test

# Bundle analysis
npm run analyze
```

---

## Font files — manual placement required

All `@font-face` declarations are in `/assets/css/fonts.css`. The font files must be placed in `/public/fonts/` before the fonts render. The build passes without them (fonts fall back gracefully per DEV-002), but production requires them.

### Files to place in `/public/fonts/`

**Cormorant Garamond** (download from https://fonts.google.com/specimen/Cormorant+Garamond or https://gwfh.mranftl.com/fonts/cormorant-garamond):

| File | Weight | Style |
|---|---|---|
| `cormorant-garamond-v22-latin-300.woff2` | 300 | normal |
| `cormorant-garamond-v22-latin-300.woff` | 300 | normal |
| `cormorant-garamond-v22-latin-regular.woff2` | 400 | normal |
| `cormorant-garamond-v22-latin-regular.woff` | 400 | normal |
| `cormorant-garamond-v22-latin-italic.woff2` | 400 | italic |
| `cormorant-garamond-v22-latin-italic.woff` | 400 | italic |
| `cormorant-garamond-v22-latin-600.woff2` | 600 | normal |
| `cormorant-garamond-v22-latin-600.woff` | 600 | normal |

**Montserrat** (download from https://fonts.google.com/specimen/Montserrat or https://gwfh.mranftl.com/fonts/montserrat):
> Montserrat is NEVER italic — no italic font file is loaded.

| File | Weight |
|---|---|
| `montserrat-v26-latin-300.woff2` | 300 |
| `montserrat-v26-latin-300.woff` | 300 |
| `montserrat-v26-latin-regular.woff2` | 400 |
| `montserrat-v26-latin-regular.woff` | 400 |
| `montserrat-v26-latin-500.woff2` | 500 |
| `montserrat-v26-latin-500.woff` | 500 |
| `montserrat-v26-latin-600.woff2` | 600 |
| `montserrat-v26-latin-600.woff` | 600 |
| `montserrat-v26-latin-700.woff2` | 700 |
| `montserrat-v26-latin-700.woff` | 700 |

**Space Mono** (download from https://fonts.google.com/specimen/Space+Mono or https://gwfh.mranftl.com/fonts/space-mono):

| File | Weight |
|---|---|
| `space-mono-v13-latin-regular.woff2` | 400 |
| `space-mono-v13-latin-regular.woff` | 400 |

### Preloaded fonts (declared in nuxt.config.ts)
- `/fonts/cormorant-garamond-v22-latin-300.woff2` — Cormorant 300 (display, wordmark)
- `/fonts/montserrat-v26-latin-300.woff2` — Montserrat 300 (nav, captions)
- `/fonts/montserrat-v26-latin-600.woff2` — Montserrat 600 (labels, eyebrows, buttons)

---

## CSS Custom Properties

All 83 tokens defined on `:root` in `/assets/css/tokens.css`. Complete list:

### Colors (12)
```css
--color-obsidian: #0A0A0A
--color-parchment: #F5F2EE
--color-gold: #B8965A
--color-gold-light: #D4AF78
--color-forge-steel: #1C2535
--color-ember: #C4883A
--color-rule-dark: #2A2A2A
--color-mid-gray: #6B6B6B
--color-status-green: #2D5C3D
--color-status-amber: #7A5A1E
--color-status-burgundy: #5C2D2D
--color-gold-active: #9A7A45
```

### Typography — Families (3)
```css
--font-serif: 'Cormorant Garamond', Georgia, serif
--font-sans: 'Montserrat', system-ui, sans-serif
--font-mono: 'Space Mono', monospace
```

### Typography — Scale (13)
```css
--text-display: 80px
--text-h1: 56px
--text-h2: 40px
--text-h3: 20px
--text-h4: 16px
--text-body-lg: 18px
--text-body: 15px
--text-body-sm: 13px
--text-caption: 11px
--text-label: 10px
--text-eyebrow: 10px
--text-data: 14px
--text-pull-quote: 28px
```

### Typography — Tracking (13)
```css
--tracking-display: -0.02em
--tracking-h1: -0.01em
--tracking-h2: 0
--tracking-h3: 0.05em
--tracking-h4: 0.07em
--tracking-body: 0.02em
--tracking-body-sm: 0.01em
--tracking-caption: 0.08em
--tracking-label: 0.15em
--tracking-eyebrow: 0.32em
--tracking-wordmark: 0.15em
--tracking-wordmark-sub: 0.4em
--tracking-nav: 0.06em
```

### Typography — Line Heights (11)
```css
--lh-display: 1.0
--lh-h1: 1.1
--lh-h2: 1.2
--lh-h3: 1.3
--lh-h4: 1.4
--lh-body-lg: 1.8
--lh-body: 1.75
--lh-body-sm: 1.6
--lh-caption: 1.5
--lh-data: 1.5
--lh-pull-quote: 1.45
```

### Spacing (11)
```css
--space-1: 8px
--space-2: 16px
--space-3: 24px
--space-4: 32px
--space-5: 40px
--space-6: 48px
--space-8: 64px
--space-10: 80px
--space-12: 96px
--space-16: 128px
--space-24: 192px
```

### Grid (6)
```css
--grid-columns: 12
--grid-gutter: 24px
--grid-max-width: 1280px
--grid-margin-desktop: 80px
--grid-margin-tablet: 48px
--grid-margin-mobile: 24px
```

### Motion (8)
```css
--ease-ocp: cubic-bezier(0.25, 0.46, 0.45, 0.94)
--duration-micro: 150ms
--duration-standard: 300ms
--duration-section: 500ms
--duration-cinematic-min: 800ms
--duration-cinematic-max: 1200ms
--duration-active: 100ms
--duration-stagger: 60ms
```

### Surfaces (4)
```css
--surface-primary: var(--color-obsidian)
--surface-secondary: #1A1A1A
--surface-steel: var(--color-forge-steel)
--surface-parchment: var(--color-parchment)
```

### Borders (3)
```css
--border-rule: 1px solid var(--color-rule-dark)
--border-gold: 1px solid var(--color-gold)
--border-gold-faint: 1px solid rgba(184, 150, 90, 0.4)
```

### Focus (2)
```css
--focus-ring: 1px solid var(--color-gold)
--focus-ring-offset: 2px
```

### Nav (2)
```css
--nav-height: 80px
--nav-logo-min-width: 120px
```

---

## Composable Signatures

### `useReducedMotion` — `/composables/useReducedMotion.ts`
```typescript
export const useReducedMotion = (): Ref<boolean>
```
- Returns `true` when `prefers-reduced-motion: reduce` is active
- SSR-safe: defaults to `false` on server
- Updates reactively via `MediaQueryList` event listener
- Cleans up listener via `onUnmounted`
- Usage: all GSAP tweens and Three.js animations check this before starting

### `useScrolled` — `/composables/useScrolled.ts`
```typescript
export const useScrolled = (): Ref<boolean>
```
- Returns `true` when `window.scrollY > 80` (nav height)
- SSR-safe: defaults to `false` on server
- Passive scroll listener, `onUnmounted` cleanup
- Usage: `TheNav` applies scrolled-state background

### `useSectionTheme` — `/composables/useSectionTheme.ts`
```typescript
export type SectionTheme = 'dark' | 'light' | 'gold'

// Called once in the layout root to establish the provider:
export const provideSectionTheme = (): {
  theme: Ref<SectionTheme>,
  registerSection: (el: Ref<HTMLElement | null>, theme: SectionTheme) => void
}

// Called by consumers (TheNav, etc.) to read the current theme:
export const useSectionTheme = (): {
  theme: Ref<SectionTheme>,
  registerSection: (el: Ref<HTMLElement | null>, theme: SectionTheme) => void
}
```
- `provideSectionTheme()` called in `layouts/default.vue` — establishes Vue `provide()` context
- `useSectionTheme()` called in `TheNav.vue` — reads via Vue `inject()`
- Scroll sections call `registerSection(sectionRef, 'dark' | 'light' | 'gold')` to register their background context
- IntersectionObserver fires when a section enters the top region of the viewport (rootMargin: `'-0px 0px -80% 0px'`)
- `TheNav` maps theme → wordmark color: `dark→'light'`, `light→'dark'`, `gold→'gold'`

---

## Component Tree with Props/Emits Interface

### `TheWordmark.vue`
```typescript
Props: { color?: 'light' | 'dark' | 'gold' }  // default: 'light'
Emits: none
Exposes: nothing
```

### `NavMenuPill.vue`
```typescript
Props: { isOpen: boolean }
Emits: { toggle: [] }
Exposes: { focus: () => void }  // for focus restoration after overlay close
```

### `NavOverlay.vue`
```typescript
Props: {
  isOpen: boolean,
  triggerFocus?: (() => void) | null   // callback to restore focus on close
}
Emits: { close: [] }
```

### `TheNav.vue`
```typescript
Props: none
Emits: none
```
Internal refs: `pillRef` (NavMenuPill instance), `menuOpen` (boolean)

---

## Vite Chunk Names for webgl-scene-engineer

All configured in `nuxt.config.ts` `vite.build.rollupOptions.output.manualChunks`:

| Chunk | Match pattern | Purpose |
|---|---|---|
| `three` | `node_modules/three` | Three.js — lazy load |
| `gsap` | `node_modules/gsap` | GSAP — lazy load |
| `scene-obsidian` | `scene-obsidian` OR `scene1` in path | Act 1 GLB scene |
| `scene-capital-chain` | `scene-capital-chain` OR `scene2` in path | Act 3 GLB scene |
| `scene-platforms` | `scene-platforms` OR `scene3` in path | Act 5 GLB scene |
| `webgl-canvas` | `components/WebGLCanvas` in path | Canvas wrapper component |

**Integration point:** `<div id="webgl-canvas-mount">` in `layouts/default.vue` is where the WebGL canvas mounts. It is `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none`. The Three.js renderer goes inside this div.

**Scroll input:** `window.scrollY` — native, not proxied. A `useScrollScene` composable can read `window.scrollY` directly and drive GSAP tweens.

**Reduced motion:** Read `useReducedMotion()` before starting any Three.js animation loop. When true, serve a static scene (freeze camera) rather than scroll-driven movement.

---

## Deviations Filed (Phase 1)

| # | Title | Status |
|---|---|---|
| DEV-001 | WebGL camera-flythrough vs. "no parallax" | APPROVED (pre-filed by orchestrator) |
| DEV-002 | Font family fallback stack in tokens.css | APPROVED — task prompt governs |
| DEV-003 | NavMenuPill gold fill hover on >40px element | Pending auditor review |

Full entries in `/docs/brand-deviations.md`.

---

## Phase 1 Done-Criteria Checklist (self-assessed)

- [x] `npm run build` passes with zero errors
- [x] `npm run preview` boots SSR production (node .output/server/index.mjs)
- [x] Design tokens: all 83 CSS custom properties on `:root` in `tokens.css`
- [x] No raw hex codes outside `tokens.css` (one exception: `--surface-secondary: #1A1A1A` inside `tokens.css` itself, per spec)
- [x] No `border-radius` anywhere in the codebase
- [x] No `box-shadow` anywhere in the codebase
- [x] No Google Fonts CDN at runtime — self-host paths only
- [x] No `background-image: linear-gradient` or `radial-gradient`
- [x] No `text-shadow`
- [x] No `animation-iteration-count: infinite`
- [x] No `transform: scale` on hover
- [x] All CSS transitions use `var(--ease-ocp)` — no bare ease values
- [x] All durations reference `--duration-*` tokens
- [x] Montserrat never italic (no `font-style: italic` on any Montserrat rule)
- [x] Cormorant Garamond never below 13px (wordmark uses 18px, minimum is 13px per token `--text-body-sm`)
- [x] Font self-hosting: `@font-face` declarations complete, placeholder paths documented
- [x] Font preload: Cormorant 300, Montserrat 300, Montserrat 600 in `nuxt.config.ts` head links
- [x] `font-display: swap` on all `@font-face` declarations
- [x] Layout shell: skip-link, TheNav, `#webgl-canvas-mount`, `<main>` landmark
- [x] Skip-link: visually hidden until focus, parchment bg, obsidian text
- [x] TheWordmark: correct typefaces, tracking, color variants (light/dark/gold)
- [x] NavMenuPill: gold border, obsidian bg, hover state documented as DEV-003
- [x] NavOverlay: parchment background, two-column layout, all five nav links, three platform brands
- [x] Focus trap: Tab/Shift+Tab cycle within overlay, ESC closes
- [x] Focus restoration: NavMenuPill receives focus after overlay closes
- [x] `useReducedMotion`: SSR-safe, reactive, cleanup on unmount
- [x] `useScrolled`: SSR-safe, passive listener, cleanup on unmount
- [x] `useSectionTheme`: provide/inject pattern, IntersectionObserver, color map
- [x] `#webgl-canvas-mount`: position fixed, full viewport, z-index 0, aria-hidden
- [x] `pages/index.vue`: 36,000px spacer for scroll testing
- [x] Vite chunks: three, gsap, scene-obsidian, scene-capital-chain, scene-platforms, webgl-canvas
- [x] Playwright test suite: 12/12 tests passing
- [x] `/docs/architecture.md` sections 1–3 populated
- [x] `/docs/brand-deviations.md` updated with DEV-002 and DEV-003

---

## What Phase 2 agents inherit

### webgl-scene-engineer receives:
- Mount point: `<div id="webgl-canvas-mount">` in `layouts/default.vue`
- Vite chunk names: `three`, `gsap`, `scene-obsidian`, `scene-capital-chain`, `scene-platforms`, `webgl-canvas`
- Composable: `useReducedMotion()` for motion fallback
- Scroll: raw `window.scrollY` (no wrapper)
- Token: `--ease-ocp` for all GSAP easing values

### narrative-content-architect receives:
- Layout slot: `<main id="main-content">` in `layouts/default.vue`
- Section theme registration: `useSectionTheme().registerSection(elRef, 'dark'|'light'|'gold')`
- All tokens for typography and spacing
- Voice register: no forbidden words, OCP tone enforced

### ui-component-craftsman receives:
- Complete token set (colors, spacing, typography, motion)
- `TheWordmark` as the canonical OCP wordmark component
- Hard rules: no border-radius, no box-shadow, no raw hex values
- Focus pattern: `*:focus-visible { outline: var(--focus-ring); outline-offset: var(--focus-ring-offset); }`
