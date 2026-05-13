# Hut8.com — Reference Architecture Teardown
## Runtime-inspected, behaviorally verified

> This document is the source of truth for the reference site's mechanics. The Obsidian Capital Partners build replicates the **structure, choreography, and information architecture** of this reference. It does **not** copy imagery, copy, or branding.

---

## BLUF

Hut8.com is a **Nuxt 3 + Three.js r170 + GSAP 3.15** custom build — not a template, not Framer, not Webflow. The entire homepage is a single **36,223px scroll narrative** orchestrating a fixed-position WebGL canvas that renders three Draco-compressed 3D scenes (`scene-1.glb`, `scene-2.glb`, `map.glb`) timed to native browser scroll. Content is pulled from **Sanity CMS**. It is a deliberate, expensive, agency-grade execution.

---

## The Architecture Stack (Confirmed via runtime inspection)

| Layer | Technology | Evidence |
|---|---|---|
| Framework | **Nuxt 3 (Vue 3, SSR)** | `#__nuxt` root, `__NUXT_DATA__` payload, `data-v-*` scoped style hashes everywhere, `data-ssr="true"` |
| Rendering | **Three.js r170** | `window.__THREE__ = "170"`, single fixed `<canvas>` (3228×1614 retina, 1614×807 display), WebGL context |
| 3D Assets | **Draco-compressed glTF** | `draco_wasm_wrapper.js` loaded, `scene-1.glb` (281KB), `scene-2.glb` (335KB), `map.glb` (243KB) |
| Animation | **GSAP 3.15.0** | `window.gsapVersions = ["3.15.0"]`, no ScrollTrigger — they tween manually off raw `scrollY` |
| Scroll Model | **Native browser scroll** | Confirmed: `htmlScroll` actually changes; no wrapper transform, no Lenis, no Locomotive. Smoothness is browser-default. |
| Styling | **CSS custom properties + Emotion** | `--color-*`, `--font-family-*`, `--grid-max-width: 1600px`, `--columns: 8`, `data-emotion` attributes |
| Typography | **ITC Franklin Gothic Std** (primary), Cosmos Oracle (loaded but unused on home) | `document.fonts` |
| CMS | **Sanity (project ID `2iccs2ie`)** | `_createdAt`, `_id`, `_rev`, `_type` keys in payload; `cdn.sanity.io/images/2iccs2ie/production/...` |
| Build | **Vite (hashed bundles)** | Filenames like `BJJeV2L-.js`, `D2oNXDDl.js` — Vite/Rollup output |
| Analytics | GTM | `gtm.js` loaded |

**Notable absences:** No Tailwind. No Framer Motion. No Swiper. No AOS. No Lenis. They built the design system from scratch.

---

## The UX Narrative — Act by Act

The page is structured as a six-act **camera flythrough**, scrubbed by scroll. Each act swaps what the fixed canvas is rendering and overlays HTML text on top.

### Act 1 — Hero: "Where Power Unlocks Potential" (0 – ~1,200px)
- **Visual:** Real-world drone footage of a Hut 8 facility (battery storage / data center, blue sky, cooling units). This is a *bitmap image* in the canvas, not a 3D scene yet.
- **Text overlay:** "Hut 8 · Where Power Unlocks Potential · Learn More" with a thin animated divider line and a tiny vertical scroll indicator on the right.
- **Bottom-left:** "Energy Infrastructure Platform" subhead with copy.
- **Trick:** As you start scrolling, the image **rotates 90° on its axis** so the cooling-unit array becomes a top-down view of a circular industrial hatch (looks like a turbine well). This is one of the strongest "wait, what just happened" moments. It's a camera move on the Three.js plane geometry, not a CSS transform.

### Act 2 — Black Transition: "...underpins the breakthrough technologies of today and tomorrow."
- **Visual:** Pure black background with subtle diagonal light streaks.
- **Text:** Large white serif-feeling sans (Franklin Gothic) statement of mission. CTA: "Our Platform →" with a green-accent progress bar.
- **Purpose:** Visual palate cleanse before the 3D world begins. Black-to-white hard cut.

### Act 3 — Isometric 3D Diorama Flythrough (the showpiece, ~2,500 – ~14,000px)
- **Visual:** A clean, white, **isometric 3D scene** rendered in Three.js. It opens on wind turbines and a solar array with a green-glowing transmission line snaking through dotted ground (the dots are a subtle topographic grid texture).
- **Camera move:** Scroll pulls the camera *along* the transmission line. You watch it travel from renewables → a small transformer/substation → across a long diagonal corridor → into a vast field of **white data center / mining container modules** in perfect grid formation.
- **Interactive elements:** Small circular **interaction tags** float over the scene (a fan icon, a sun icon, a server-stack icon). At certain scroll points, callouts pop up: `154.6 PH/s · 13.0 J/TH` — these are real Hut 8 mining hashrate and efficiency metrics layered on top of the 3D model.
- **The green line is the brand's only saturated color.** Everything else is light grey, white, and black. The single green accent (the energy flowing through the line) **is** the metaphor: power flows in, intelligence flows out.

### Act 4 — "Our Impact" Wave Visualization (~16,000 – ~21,000px)
- **Visual:** A **3D particle wave terrain** (dotted, monochrome). Black vertical pins drop from above, each labeled with a power-capacity number and a location: `42 MW Drumheller`, `205 MW Vega`, `120 MW Iroquois Falls`, `110 MW Kingston`, etc.
- **Headline:** "Our Impact" rendered enormous in the background, blurred/de-saturated, partially scrolling out of frame.
- **Mid-overlay:** "Unlocking Human Potential" with explanatory copy about energy-intensive technologies and grid pressure.
- **Bottom:** A horizontal ruler/scale graphic resolves to a final big number: **`1019 MW` — Capacity Under Mgmt.** (As of March 31, 2025.)
- **This is the proof slide.** The whole 3D narrative is foreplay for this number.

### Act 5 — "Powering the Future" Word List (~25,000 – ~33,000px)
- **Visual:** Black background. A long, slow vertical scroll of a **list of every future use case Hut 8 wants to power**: AI Inference, AI Training, Aviation Fuel Refining, Battery Manufacturing, Bitcoin Mining, Carbon Capture, Cement Production, Desalination, Direct Air Capture, Direct Ocean Capture, Electrified Transport, Electrofuels, Fertilizer Production, **Fusion Power**, Geologic Hydrogen Extraction, High-Performance Computing, Hydrogen Production, Hyperscale Data Centers, Industrial Heat Electrification, Next-Generation Nuclear, Petrochemical Refining, Quantum Computing, Rare Earth Processing, Semiconductor Fabrication, **Space-Based Manufacturing**, Space Launch, Steelmaking, Waste-to-Energy Conversion.
- **Sticky left:** "Powering the Future" label. **Sticky right:** "Our Ambition" green tag with explanatory paragraph.
- **The hook:** Bitcoin mining is buried alphabetically among **fusion, space launch, and quantum computing**. Strategic positioning is doing real work here.

### Act 6 — Categorized List + News + Footer (~33,000 – 36,223px)
- **Business segments grid:** Power, Power Generation / Digital Infrastructure / Compute (American Bitcoin, Data Center Cloud, GPU-as-a-Service).
- **News & Insights:** Q1 2026 earnings, press releases (Sanity-driven, indexed by `_type: pressReleases` and `caseStudies`).
- **Footnotes:** Joint venture disclosures.
- **Footer:** Sage/khaki color background, LinkedIn + X icons, contact email, address, Terms, Privacy. **The horizontal black bar pattern** at the bottom is a stylized data-stream / barcode motif — the brand's visual signature continued.

---

## The UI Mechanics (Persistent Across All Acts)

- **Fixed logo (top-left):** Position `fixed: 24px`. Dynamically changes color (white on dark sections, black on light) — JS-driven swap via IntersectionObserver against section background classes.
- **Fixed top-right pill:** Brand mark + hamburger. Tappable. Opens a full-screen overlay menu (Act-independent).
- **Menu overlay:** Two-column layout. Left: primary nav. Right: three business segments each with sub-services and an icon. Bottom-left utility links: Careers, HPC Client Portal, Terms, Privacy. Background is a sage/khaki tone that matches the footer — visual continuity even when the menu is open.
- **The interaction icons in the 3D scene** are HTML-positioned but coordinated to 3D world coordinates — they track the camera as it moves through the scene.
- **No header until you scroll.** No top nav bar visible. Just the logo + menu toggle.

---

## The Design System (CSS custom properties)

```
--font-family-primary: "ITC Franklin Gothic Std", sans-serif;
--grid-max-width: 1600px;
--columns: 8;
--gutter-width: 18px;
--grid-padding: 18px;

--color-white: #fff;
--color-off-white: #f8f8f8;
--color-grey-100: #e8e8e8;
--color-grey-150: #d8d8d8;
--color-grey-175: #a8a8a8;
--color-grey-200: #686868;
--color-grey-300: #999;
--color-grey-400: #888;
--color-off-black: #080808;
--color-black: #000;
```

Eight-column grid, 18px gutters, max-width 1600px. A monochrome ramp with **one signal color (green)** reserved for the energy/data-flow accent.

---

## Confirmed Runtime Probes (Evidence Log)

### Stack fingerprints
- `window.__THREE__` → `"170"` (Three.js r170)
- `window.gsapVersions` → `["3.15.0"]` (GSAP 3.15)
- `window._gsap` keys → `["id","target","harness","get","set","tweenScroll"]`
- `window._scrollTop` → present (custom scroll proxy)
- `document.documentElement.classList` → `"js"` only
- `document.body` children → `#__nuxt`, `#teleports`, scripts including `#__NUXT_DATA__` with `data-nuxt-data="nuxt-app"` and `data-ssr="true"`

### Scroll mechanism (the critical confirmation)
- At scroll position 0: `document.documentElement.scrollTop = 0`, `.wrapper-home` transform = `none`, canvas transform = `matrix(1, 0, 0, 1, 0, -403.5)` (camera initial offset, not scroll-driven)
- At scroll position 3000: `document.documentElement.scrollTop = 3000`, `.wrapper-home` transform = `none`, canvas transform = `matrix(1, 0, 0, 1, 0, -403.5)` (unchanged — camera state lives in WebGL, not CSS)
- **Conclusion:** Native browser scroll drives JS state, which drives Three.js camera and material updates. No CSS-side smooth scroll wrapper. No transform-based scroll mimicry.

### Canvas details
- One `<canvas>` element, position `fixed`, top `0`, full viewport
- Resolution: 3228×1614 (2× DPR) rendered to 1614×807 display
- Context: WebGL (NOT 2D — `getContext('2d')` returns null)
- Parent: `.canvasWrapper` with `data-v-41c98b5e` scoped style hash

### 3D Assets
- `map.glb` — 243KB (Draco-compressed)
- `scene-1.glb` — 281KB (Draco-compressed)
- `scene-2.glb` — 335KB (Draco-compressed)
- `draco_wasm_wrapper.js` — 12KB (Draco decoder)

### CMS confirmation
- Two Sanity CDN image URLs observed: `https://cdn.sanity.io/images/2iccs2ie/production/...`
- `__NUXT_DATA__` payload contains `caseStudies`, `pressReleases`, `landingPage` keys with Sanity GROQ signature (`_createdAt`, `_id`, `_rev`, `_type`, `_updatedAt`)

---

## Strategic Read

This is **not a corporate site for a Bitcoin miner.** It is **deliberate category repositioning** rendered in code:

1. **Hut 8 used to be a Bitcoin mining company.** This site never leads with that. The hero says "Energy Infrastructure Platform." The 3D narrative goes renewables → transmission → compute. Bitcoin mining appears alphabetically in Act 5 as one of 28 future use cases.

2. **The 3D flythrough is a credibility weapon.** Energy infrastructure is the most boring possible category. By rendering it as a Lusion-tier interactive piece, they're signaling: *we have the capital, the taste, and the team to build something this expensive — therefore we have the seriousness to operate gigawatt-scale facilities.*

3. **The green line is the entire brand argument compressed to one visual.** Power in → intelligence out. It is the only saturated color on the page. Every act of the narrative is variations on that one line moving through different contexts. The whole site is a **one-line argument animated.**

---

## Direct Patterns for OCP Build

| Hut 8 Pattern | OCP Replication |
|---|---|
| Fixed full-viewport WebGL canvas, never unmounted | Same — single `<WebGLCanvas>` in layout shell |
| Native scroll → manual listener → GSAP tween proxy → Three.js state | Same — `useScrollScene` composable with `{ p: 0 }` proxy |
| Three GLB scenes, Draco-compressed, ~280KB each | Same — `scene-1-obsidian.glb`, `scene-2-capital-chain.glb`, `scene-3-platforms.glb` |
| HTML callouts via `Vector3.project(camera)` | Same — `<ScenePin>` component |
| CSS custom properties for design tokens (no Tailwind) | Same — `/assets/css/tokens.css` |
| Sanity CMS, GROQ queries, SSR hydration | Same — `landingPage`, `platformCompany`, `mandate`, `pressRelease`, `caseStudy` schemas |
| 8-column grid, max-width 1600px | OCP uses 12-column grid (per brand section 3.1), max-width 1280px — adapt |
| Fixed top-left wordmark with section-aware color | Same |
| Fixed top-right menu pill → two-column overlay | Same — left primary nav, right platform brands |
| Single accent color (acid green) used with discipline | OCP Gold `#B8965A` — same discipline, never as background |
| Six-act scroll narrative | Same six acts, content remapped per brief section 3 |

— End of teardown.
