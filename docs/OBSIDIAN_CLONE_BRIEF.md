# OBSIDIAN CAPITAL PARTNERS — WEB EXPERIENCE BUILD BRIEF
## Reference Architecture: hut8.com · Target Identity: Obsidian Capital Partners v1.0

---

## 0. NON-NEGOTIABLES — READ BEFORE ANY OTHER FILE

You are building a **production-grade institutional capital firm website** that replicates the **complete UX, scroll choreography, and 3D narrative architecture of hut8.com**, rebranded to **Obsidian Capital Partners (OCP)** per the attached brand guidelines (`/brand/obsidian-brand-guidelines.pdf`).

This is not "inspired by." This is not "a similar feel." The intent is a **structural and behavioral clone** of the Hut 8 site mechanics with OCP brand substituted at every layer. Hut 8's visual language is the reference for *how* the experience works — OCP's brand system is the reference for *what it looks like, says, and means*.

**Rules that override everything else:**

1. **No shortcuts.** If Hut 8 uses a fixed full-viewport WebGL canvas driven by native scroll with Three.js + GSAP tweens, you build a fixed full-viewport WebGL canvas driven by native scroll with Three.js + GSAP tweens. You do not "approximate with CSS." You do not swap in Lottie. You do not use a scroll library shortcut like Locomotive or Lenis unless the reference does (it doesn't).
2. **The brand guidelines are constraint, not suggestion.** Every color, type spec, spacing rule, motion timing, voice register, and governance rule in `/brand/obsidian-brand-guidelines.pdf` is enforced. If a design choice from the Hut 8 reference conflicts with the OCP guidelines, **OCP guidelines win** — but you must document the conflict in `/docs/brand-deviations.md` so the deviation is auditable.
3. **No filler content.** Every word on the page must be in the OCP voice registers defined in section 1.4 of the guidelines. No "Lorem ipsum." No "passionate team of professionals." If you don't have real copy, write copy that would pass the OCP voice test ("the billboard test," "the before/after test") and flag it as `[DRAFT — pending principal review]`.
4. **Mobile is a real deliverable.** Hut 8's mobile experience is not the same as desktop. Design a parallel mobile narrative that respects the brand and works on a mid-range Android. This is in scope, not a follow-up.
5. **Accessibility is non-negotiable** per OCP brand doc section 3.1 ("Focus States"). Build `prefers-reduced-motion` fallbacks for the entire 3D narrative.
6. **You will use subagents.** This brief defines six. Use them. Do not attempt to one-shot this with the orchestrator alone.

---

## 1. THE REFERENCE — WHAT HUT8.COM ACTUALLY DOES

A full technical teardown of the reference site is included at `/reference/hut8-teardown.md`. The headline facts:

**Stack identified at runtime:**
- Nuxt 3 (Vue 3, SSR) — `#__nuxt` root, `__NUXT_DATA__` payload, `data-v-*` scoped style hashes
- Three.js r170 — confirmed via `window.__THREE__ = "170"`
- GSAP 3.15.0 — confirmed via `window.gsapVersions`, manual scroll-driven tweens (no ScrollTrigger)
- Draco-compressed glTF (`draco_wasm_wrapper.js`) for 3D scenes (~280KB each)
- Vite bundler (hashed filenames like `D2oNXDDl.js`)
- Sanity CMS backend (`cdn.sanity.io`, GROQ payload signature)
- Native browser scroll (NOT Lenis, NOT Locomotive — confirmed via runtime scroll-position probes)
- CSS custom properties for the design system (no Tailwind, no Emotion runtime beyond Vue scoped styles)

**The narrative structure (36,223px total scroll length, 6 acts):**

1. **Hero (0–1,200px):** Real-world facility image in canvas → rotates 90° on scroll into a top-down circular view. Wordmark fixed top-left, menu pill fixed top-right.
2. **Black mission transition (1,200–2,500px):** Black background, mission statement in display serif, single colored accent CTA.
3. **Isometric 3D flythrough (2,500–14,000px):** WebGL diorama of renewable sources → transmission line (animated accent color) → data center modules. Camera scrolls *through* the scene. HTML callouts pinned to 3D world coordinates with real metrics overlaid.
4. **Particle wave + impact (16,000–21,000px):** 3D particle terrain with vertical pin markers labeled with location + capacity data. Resolves to a single hero number at the bottom.
5. **"Powering the Future" word list (25,000–33,000px):** Black background, sticky left label, sticky right copy block, alphabetical scrolling list of use cases.
6. **Categorized list + news + footer (33,000–36,223px):** Business segments grid, news cards, footer with utility links and a stylized graphic motif.

**Persistent UI across all acts:** Fixed logo top-left (color-adapts to section), fixed menu pill top-right (opens two-column overlay menu), in-scene HTML interaction tags that track 3D world coordinates.

You will replicate this structure exactly. Not the imagery — the **mechanics, choreography, and information architecture.**

---

## 2. THE BRAND — WHAT OBSIDIAN CAPITAL PARTNERS IS

Full guidelines at `/brand/obsidian-brand-guidelines.pdf`. Critical pulls:

**Identity:** Obsidian Capital Partners is a principal-position institutional capital firm operating in infrastructure and industrial platform companies (Hydronex/HydroCore — water; Tempist Systems — industrial automation; OpenLoop KSA — digital health in Saudi Arabia). The brand position is "We Build. We Don't Broker." Long-duration, principal-minded, structural.

**Immutable elements (never change):**
- Primary colors: Obsidian Black `#0A0A0A` + Gold `#B8965A`
- Typography pair: Cormorant Garamond (serif, display) + Montserrat (sans, structural) + Space Mono (tertiary, data)
- Positioning: principal-minded, company-building, long-duration

**Full palette:**
- `#0A0A0A` Obsidian Black · `#F5F2EE` Parchment · `#B8965A` Gold · `#D4AF78` Gold Light
- `#1C2535` Forge Steel · `#C4883A` Ember
- `#2A2A2A` Rule Dark · `#6B6B6B` Mid Gray
- Status: `#2D5C3D` Structural Green · `#7A5A1E` Structural Amber · `#5C2D2D` Structural Burgundy

**Voice — four registers, one identity:**
- Institutional (LP decks): peer-to-peer, number-first, no hedging
- Operational (engagement docs): directive, framework-led, no filler
- Public (website, press): minimal, controlled, billboard test, **no superlatives**
- Platform (Hydronex / Tempist / OpenLoop KSA): sector-grounded, OCP-parent-consistent

**Forbidden words (per section 4.2):** leverage, synergies, best-in-class, world-class, ecosystem, disruptive, passionate, excited, committed to excellence. Reject any draft containing these.

**Motion:** All easing `cubic-bezier(0.25, 0.46, 0.45, 0.94)`. UI micro 150ms · standard 300ms · section 500ms · cinematic 800–1200ms. Entries fade + 8–14px Y-translate up only. **Never:** parallax on background images, bounce/spring/elastic easing, particle effects, infinite rotation, pulsing.

**The brand explicitly forbids parallax on background images.** This is a constraint that bites against the Hut 8 reference. Resolution: the WebGL camera-flythrough is *not* parallax — it is a scrubbed 3D scene. That is permitted. Decorative CSS parallax (background-attachment: fixed, translateY based on scroll on photo backgrounds) is forbidden. Document this distinction in `/docs/brand-deviations.md`.

---

## 3. THE NARRATIVE — OCP'S SIX ACTS

Map the Hut 8 acts onto OCP's positioning. **This is not optional creative direction — it is the spec.**

| # | Hut 8 Original | OCP Translation |
|---|---|---|
| 1 | Drone shot of mining facility → rotates into circular hatch | Hero canvas: macro shot of raw obsidian stone (per brand photography spec section 2.5 "Abstraction") → rotates into a precision-machined heptagonal form referencing the OCP symbol mark (section 2.1). Headline: **"We Build. We Don't Broker."** |
| 2 | Black mission with green CTA accent | Black background, Cormorant Light 80px display: *"Obsidian is the principal that stays."* Single Gold CTA: **"Our Mandate →"** |
| 3 | Isometric WebGL flythrough: renewables → grid → datacenters, accent green | Isometric WebGL flythrough: **capital deployment chain** — origination node → structuring/diligence stage → platform company → operating cycle. Three "stations" along the path with Gold accent (`#B8965A`) flowing through the architecture. HTML callouts pin to platform nodes: **Hydronex** (water drop icon), **Tempist Systems** (circuit/automation mark), **OpenLoop KSA** (health cross). |
| 4 | Particle wave + 1019 MW resolution | Particle wave terrain (monochrome, Parchment-on-Black) with **capital deployment markers** by platform, labeled in Space Mono per typography spec ("$248,500,000 · 7-yr duration · 4% mgmt fee"). Resolves to a single Space Mono hero number: **$2B+ Structured · 3 Platforms · 1 Principal**. |
| 5 | "Powering the Future" alphabetical word list | **"Where We Build"** — alphabetical list of OCP's future build mandates. Source list (write OCP-voice copy to match): Industrial Automation · Industrial Water Treatment · Municipal Water Infrastructure · Process Control Systems · Saudi Digital Health · Vision 2030 Healthcare Platforms · Water Distribution Networks. Sticky left label "Where We Build," sticky right block: *"Our mandate evolves with the infrastructure cycle. The list compounds."* (Per pillar 03 — "Patience Is the Business Model.") |
| 6 | Categorized list, news, footer | **Platform Companies** grid (Hydronex / Tempist / OpenLoop KSA). News & Mandates — published mandate letters and platform announcements (Sanity-driven). Footer: Parchment background (NOT sage like Hut 8 — OCP uses Parchment), `info@obsidiancap.com`, jurisdiction, Terms, Privacy. The "stylized data-stream barcode motif" Hut 8 uses in their footer is replaced by **a single 40px Gold rule** per brand spec (section 2.4 mark system). |

**The Hut 8 site flexes its tech to flex Hut 8's seriousness. The OCP site flexes its restraint to flex OCP's seriousness.** Same psychological mechanism, opposite aesthetic vocabulary. The Hut 8 site is white and dotted. The OCP site is Obsidian Black with Gold and Parchment. The Hut 8 accent is acid green. The OCP accent is `#B8965A` — and is used with extreme discipline (never as a full background).

---

## 4. TECH STACK — EXACT MATCH

Match the reference stack. Do not substitute.

- **Framework:** Nuxt 3 (latest stable), Vue 3, TypeScript, SSR enabled
- **3D:** Three.js r170+ with GLTFLoader + DRACOLoader. Draco-compress all `.glb` scenes.
- **Animation:** GSAP 3.x (no ScrollTrigger — drive tweens manually off `scrollY` listener, exactly as the reference does)
- **Smooth scroll:** Native browser scroll only. No Lenis, no Locomotive, no JS-driven scroll hijack.
- **Bundler:** Vite (Nuxt default)
- **Styling:** CSS custom properties + Vue scoped styles. No Tailwind. No Emotion runtime. No CSS-in-JS framework.
- **CMS:** Sanity Studio v3, with schemas defined for: `landingPage`, `platformCompany`, `mandate`, `pressRelease`, `caseStudy`, `footnote`
- **Forms:** None on launch. The CTA is a `mailto:` to `info@obsidiancap.com` per Hut 8's pattern of no public contact form
- **Analytics:** Stub Plausible (self-hosted) integration. Do not add GTM unless OCP brand lead approves — institutional brands avoid third-party trackers
- **Hosting target:** Vercel or Netlify with edge functions enabled for Sanity ISR

**Performance budget:** Initial JS ≤ 250KB gzip. Each `.glb` scene ≤ 350KB after Draco compression. Hero LCP ≤ 2.5s on a throttled 4G connection. Lighthouse Performance ≥ 85, Accessibility = 100, SEO ≥ 95.

---

## 5. SUBAGENT TEAM — HOW TO DELEGATE

You (orchestrator) will dispatch six specialist subagents. Each is defined in `/.claude/agents/`. Each subagent reads this brief plus its own scope doc.

1. `nuxt-shell-architect` — SSR scaffold, design tokens, persistent nav
2. `webgl-scene-engineer` — Three.js engine, three GLB scenes, scroll-driven camera, callout pins
3. `narrative-content-architect` — Sanity Studio, schemas, voice-compliant copy
4. `ui-component-craftsman` — buttons, cards, grids, footer, icons, mark devices
5. `mobile-narrative-designer` — parallel mobile experience
6. `brand-compliance-auditor` — audits everything, blocks merges, maintains deviations log

Dispatch order in `/.claude/agents/README.md`.

---

## 6. ACCEPTANCE CRITERIA — HOW WE KNOW IT'S DONE

Side-by-side with hut8.com open in another tab, the OCP build must:

1. Match Hut 8's scroll length within ±15% (target ~36,000px desktop)
2. Render a fixed full-viewport canvas that holds across all three WebGL acts without unmounting
3. Drive 3D camera state directly from native `window.scrollY` (verifiable via DevTools — `document.documentElement.scrollTop` increments naturally, no wrapper transform)
4. Hold 60fps during scroll on a 2023 MacBook Air
5. Pass `prefers-reduced-motion: reduce` by serving a static hero + reduced narrative (no broken page, no missing acts)
6. Pass axe-core with zero violations
7. Pass the brand audit with zero violations or documented deviations
8. Load in ≤ 2.5s LCP on throttled 4G (mobile)
9. Display the OCP wordmark per section 2.1 (Cormorant Garamond Light, tracked +150/1000em, "CAPITAL PARTNERS" in Montserrat below) — fixed top-left, color-adapting per section background
10. Display all three platform brands (Hydronex, Tempist Systems, OpenLoop KSA) with the "An Obsidian Capital Partners Platform Company" lockup per section 1.2 governance rules

If any acceptance criterion fails, the build is not done. Iterate.

---

## 7. FILES YOU HAVE

- `/brand/obsidian-brand-guidelines.pdf` — the authoritative source
- `/reference/hut8-teardown.md` — the runtime-inspected technical teardown of the reference
- `/.claude/agents/*.md` — the six subagent definitions
- `/.claude/agents/README.md` — dispatch order and authority rules

## 8. FILES YOU WILL PRODUCE

- A complete, deployable Nuxt 3 + Sanity + Three.js codebase
- `/docs/architecture.md` — written architecture decisions, scene composition, scroll choreography map
- `/docs/brand-deviations.md` — any deliberate deviation from brand guidelines, justified
- `/docs/handoff-phase-N-{agent}.md` — handoff doc from each subagent
- `/docs/audit-phase-N.md` — auditor's report from each phase
- `/docs/qa-parity.md` — side-by-side behavior comparison vs. hut8.com reference

---

## 9. WHAT TO DO RIGHT NOW

1. Read this brief in full.
2. Read `/brand/obsidian-brand-guidelines.pdf` in full.
3. Read `/reference/hut8-teardown.md` in full.
4. Read `/.claude/agents/README.md` to confirm dispatch order.
5. Begin Phase 1 by dispatching `nuxt-shell-architect`.
6. Halt after Phase 1 and report back with: (a) the working SSR shell deployed to a preview URL, (b) the brand auditor's Phase 1 report, (c) confirmation that Phase 2 dispatch is ready.

Do not proceed past Phase 1 until I confirm.

Do not take shortcuts. The whole point of this build is that it is not a shortcut.

— End of brief.
