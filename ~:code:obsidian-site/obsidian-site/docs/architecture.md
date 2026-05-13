# Architecture

> Living document. Each subagent appends to its relevant section as it completes work.

## Status: Phase 1 — complete

Phase 1 delivered by `nuxt-shell-architect`. Build passes, 12/12 Playwright tests pass.

---

## 1. Stack decisions

Populated by `nuxt-shell-architect` — Phase 1.

| Layer | Decision | Rationale |
|---|---|---|
| **Framework** | Nuxt 3.21.5 (Vue 3.5, SSR enabled) | Matches reference stack exactly (Nuxt 3 + SSR confirmed via runtime inspection). `ssr: true` in nuxt.config.ts. No SPA mode. |
| **Bundler** | Vite 7.3.3 (Nuxt default) | Matches reference. Rollup manual chunks configured for Three.js, GSAP, and named scene chunks. |
| **Styling** | CSS custom properties + Vue scoped styles | No Tailwind, no CSS framework, no CSS-in-JS. All design tokens in `/assets/css/tokens.css`. Components use `<style scoped>`. |
| **Font hosting** | Self-hosted, `/public/fonts/` | `@nuxtjs/google-fonts` is forbidden. `@font-face` declarations in `/assets/css/fonts.css` reference local paths only. WOFF2 + WOFF fallback per font. Font files need manual placement (see Phase 1 handoff). |
| **CMS** | Sanity v3 (Phase 2 — not yet configured) | Schemas will be defined by `narrative-content-architect`. |
| **Deployment target** | Vercel / Netlify with edge functions | Nitro `node-server` preset. ISR strategy in Phase 2. |
| **TypeScript** | Strict mode — all strict flags enabled | `tsconfig.json` extends `.nuxt/tsconfig.json` with `strict: true`. |
| **3D** | Three.js r170 (Phase 2 — lazy chunk configured) | `three` manual chunk defined. Not bundled in initial load. |
| **Animation** | GSAP 3.15 (Phase 2 — lazy chunk configured) | `gsap` manual chunk defined. Not bundled in initial load. No ScrollTrigger. |
| **Scroll** | Native browser scroll | `scroll-behavior: auto` in global.css. No Lenis, no Locomotive, no wrapper transform. |
| **Analytics** | Not yet configured | Plausible stub to be added in Phase 2. |

---

## 2. Design token system

Populated by `nuxt-shell-architect` — Phase 1.

**Token file location:** `/assets/css/tokens.css`

**Naming convention:** `--{category}-{descriptor}[-{modifier}]`

**Principle:** Nothing outside `tokens.css` may reference a raw hex code, raw pixel margin, or raw timing value. Components reference only token names.

**Mobile override strategy:** Token values are constant at all breakpoints. Component layouts adapt via media queries using the token values. No token redefinition at breakpoints in Phase 1 — mobile-specific adjustments are `mobile-narrative-designer`'s scope.

### Complete token inventory

#### Colors
| Token | Value | Purpose |
|---|---|---|
| `--color-obsidian` | `#0A0A0A` | Primary background, text on light |
| `--color-parchment` | `#F5F2EE` | Light surface, overlay background |
| `--color-gold` | `#B8965A` | Primary accent, borders, icons |
| `--color-gold-light` | `#D4AF78` | Hover accent, secondary gold use |
| `--color-forge-steel` | `#1C2535` | Steel surface tier |
| `--color-ember` | `#C4883A` | Warm accent variant |
| `--color-rule-dark` | `#2A2A2A` | Dark border/rule |
| `--color-mid-gray` | `#6B6B6B` | Secondary text, utility labels |
| `--color-status-green` | `#2D5C3D` | Structural green status |
| `--color-status-amber` | `#7A5A1E` | Structural amber status |
| `--color-status-burgundy` | `#5C2D2D` | Structural burgundy status |
| `--color-gold-active` | `#9A7A45` | Interactive gold (hover/active) |

#### Typography — Families
| Token | Value |
|---|---|
| `--font-serif` | `'Cormorant Garamond', Georgia, serif` |
| `--font-sans` | `'Montserrat', system-ui, sans-serif` |
| `--font-mono` | `'Space Mono', monospace` |

*Note: Fallbacks included per DEV-002. See `/docs/brand-deviations.md`.*

#### Typography — Scale (15 tokens)
`--text-display` (80px) · `--text-h1` (56px) · `--text-h2` (40px) · `--text-h3` (20px) · `--text-h4` (16px) · `--text-body-lg` (18px) · `--text-body` (15px) · `--text-body-sm` (13px) · `--text-caption` (11px) · `--text-label` (10px) · `--text-eyebrow` (10px) · `--text-data` (14px) · `--text-pull-quote` (28px)

#### Typography — Tracking (13 tokens)
`--tracking-display` (-0.02em) · `--tracking-h1` (-0.01em) · `--tracking-h2` (0) · `--tracking-h3` (0.05em) · `--tracking-h4` (0.07em) · `--tracking-body` (0.02em) · `--tracking-body-sm` (0.01em) · `--tracking-caption` (0.08em) · `--tracking-label` (0.15em) · `--tracking-eyebrow` (0.32em) · `--tracking-wordmark` (0.15em) · `--tracking-wordmark-sub` (0.4em) · `--tracking-nav` (0.06em)

#### Typography — Line Heights (11 tokens)
`--lh-display` (1.0) · `--lh-h1` (1.1) · `--lh-h2` (1.2) · `--lh-h3` (1.3) · `--lh-h4` (1.4) · `--lh-body-lg` (1.8) · `--lh-body` (1.75) · `--lh-body-sm` (1.6) · `--lh-caption` (1.5) · `--lh-data` (1.5) · `--lh-pull-quote` (1.45)

#### Spacing (11 tokens — 8px base unit)
`--space-1` (8px) · `--space-2` (16px) · `--space-3` (24px) · `--space-4` (32px) · `--space-5` (40px) · `--space-6` (48px) · `--space-8` (64px) · `--space-10` (80px) · `--space-12` (96px) · `--space-16` (128px) · `--space-24` (192px)

#### Grid (6 tokens)
`--grid-columns` (12) · `--grid-gutter` (24px) · `--grid-max-width` (1280px) · `--grid-margin-desktop` (80px) · `--grid-margin-tablet` (48px) · `--grid-margin-mobile` (24px)

#### Motion (8 tokens)
`--ease-ocp` (cubic-bezier(0.25, 0.46, 0.45, 0.94)) · `--duration-micro` (150ms) · `--duration-standard` (300ms) · `--duration-section` (500ms) · `--duration-cinematic-min` (800ms) · `--duration-cinematic-max` (1200ms) · `--duration-active` (100ms) · `--duration-stagger` (60ms)

#### Surfaces (4 tokens)
`--surface-primary` (var(--color-obsidian)) · `--surface-secondary` (#1A1A1A) · `--surface-steel` (var(--color-forge-steel)) · `--surface-parchment` (var(--color-parchment))

#### Borders (3 tokens)
`--border-rule` (1px solid var(--color-rule-dark)) · `--border-gold` (1px solid var(--color-gold)) · `--border-gold-faint` (1px solid rgba(184, 150, 90, 0.4))

#### Focus (2 tokens)
`--focus-ring` (1px solid var(--color-gold)) · `--focus-ring-offset` (2px)

#### Nav (2 tokens)
`--nav-height` (80px) · `--nav-logo-min-width` (120px)

**Total: ~83 custom properties on `:root`**

---

## 3. Layout shell

Populated by `nuxt-shell-architect` — Phase 1.

### Component tree

```
app.vue
└── NuxtLayout (default.vue)
    ├── <a class="skip-link">        Skip to main content
    ├── TheNav.vue                   Fixed header, z-index: 1000
    │   ├── TheWordmark.vue          Logo — top-left, adapts color to section
    │   ├── NavMenuPill.vue          Trigger — top-right, gold border
    │   └── NavOverlay.vue           Full-viewport overlay menu
    │       ├── TheWordmark.vue      In overlay (dark color mode)
    │       ├── <nav>                Primary nav links (Home/Mandate/Platforms/Insights/Principals)
    │       ├── <div> utility        Careers/Terms/Privacy
    │       └── <div> platforms      Hydronex / Tempist Systems / OpenLoop KSA
    ├── <div id="webgl-canvas-mount"> Fixed, full-viewport, z-index: 0, aria-hidden
    └── <main id="main-content">     Page slot, z-index: 1
        └── NuxtPage (pages/index.vue in Phase 1)
```

### File paths
| Component | Path |
|---|---|
| App entry | `/app.vue` |
| Default layout | `/layouts/default.vue` |
| Navigation header | `/components/TheNav.vue` |
| Wordmark | `/components/TheWordmark.vue` |
| Menu pill | `/components/NavMenuPill.vue` |
| Overlay menu | `/components/NavOverlay.vue` |
| Homepage placeholder | `/pages/index.vue` |

### Composables
| Composable | Path | Returns |
|---|---|---|
| `useReducedMotion` | `/composables/useReducedMotion.ts` | `Ref<boolean>` |
| `useScrolled` | `/composables/useScrolled.ts` | `Ref<boolean>` |
| `useSectionTheme` | `/composables/useSectionTheme.ts` | `{ theme: Ref<SectionTheme>, registerSection }` |
| `provideSectionTheme` | `/composables/useSectionTheme.ts` | Same + calls `provide()` |

### Persistent nav mechanics
- **Position:** `position: fixed`, `top: 0`, `z-index: 1000`, `height: var(--nav-height)` (80px)
- **At rest:** Transparent background
- **Scrolled state** (scrollY > 80px): `rgba(10, 10, 10, 0.96)` + `backdrop-filter: blur(12px)` + `border-bottom: var(--border-rule)`
- **Wordmark color adaptation:** `provideSectionTheme()` in `default.vue` establishes provider. Sections call `registerSection(elRef, theme)`. `TheNav` reads `useSectionTheme().theme` and maps: `dark→'light'`, `light→'dark'`, `gold→'gold'`.

### WebGL canvas mounting strategy
- `<div id="webgl-canvas-mount">` in `layouts/default.vue`
- `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0`
- `aria-hidden="true"` — canvas is decorative; all content lives in `<main>`
- `pointer-events: none` — Three.js canvas mounted inside will handle its own events
- `webgl-scene-engineer` mounts `WebGLCanvas.vue` (lazy chunk) into this div in Phase 2

### Vite chunking strategy
Configured in `nuxt.config.ts` `vite.build.rollupOptions.output.manualChunks`:

| Chunk name | Contents | When loaded |
|---|---|---|
| `three` | `node_modules/three` | Lazy — only when WebGLCanvas mounts |
| `gsap` | `node_modules/gsap` | Lazy — only when scroll animation starts |
| `scene-obsidian` | Files matching `scene-obsidian` or `scene1` | Lazy — Act 1 |
| `scene-capital-chain` | Files matching `scene-capital-chain` or `scene2` | Lazy — Act 3 |
| `scene-platforms` | Files matching `scene-platforms` or `scene3` | Lazy — Act 5 |
| `webgl-canvas` | `components/WebGLCanvas.vue` | Lazy — deferred load |

**Phase 1 initial bundle:** 65.48 kB gzip (174.99 kB uncompressed) — well within 250 kB gzip budget. Three.js and GSAP are not included.

---

## 4. 3D narrative engine

(to be populated by `webgl-scene-engineer` in Phase 2)

- Scene management:
- Camera path source:
- Scroll-to-state pipeline:
- Asset compression pipeline:
- Reduced-motion fallback strategy:

---

## 5. Content layer

(to be populated by `narrative-content-architect` in Phase 2)

- Sanity project ID:
- Schema list:
- ISR strategy:
- Voice register enforcement:

---

## 6. Component library

(to be populated by `ui-component-craftsman` in Phase 2)

- Component inventory:
- State coverage:
- Icon system:
- Mark devices:

---

## 7. Mobile narrative

(to be populated by `mobile-narrative-designer` in Phase 3)

- Breakpoint strategy:
- Act-by-act mobile treatment:
- Performance budget:

---

## 8. Brand compliance

(maintained by `brand-compliance-auditor` across all phases)

- Audit cadence:
- CI gates:
- Deviations log: `/docs/brand-deviations.md`

---

## 9. Performance budget

| Surface | Metric | Target | Phase 1 actual |
|---|---|---|---|
| Desktop initial JS (gzip) | ≤ 250 KB | | 65.48 kB ✓ |
| Mobile initial JS (gzip) | ≤ 180 KB | | 65.48 kB ✓ |
| Each GLB scene (Draco) | ≤ 350 KB | | N/A — Phase 2 |
| Desktop LCP (Slow 4G) | ≤ 2.5 s | | N/A — Phase 2 |
| Mobile LCP (Slow 4G + 4× CPU) | ≤ 2.5 s | | N/A — Phase 2 |
| Lighthouse Desktop Performance | ≥ 85 | | N/A — Phase 2 |
| Lighthouse Mobile Performance | ≥ 80 | | N/A — Phase 2 |
| Lighthouse Accessibility | 100 | | N/A — Phase 2 |
| Lighthouse SEO | ≥ 95 | | N/A — Phase 2 |
| Scroll FPS (M2 MacBook Air) | 60 sustained | | N/A — Phase 2 |
