# Obsidian Capital Partners — Web Experience

A production-grade institutional capital firm website. Replicates the scroll-driven 3D narrative architecture of hut8.com, rebranded to Obsidian Capital Partners.

## Status

**Phase 0 — pre-build.** Repo scaffold + briefs in place. No code yet.

## Build with Claude Code

```bash
cd obsidian-site
claude
```

Then open the conversation with:

> Read `OBSIDIAN_CLONE_BRIEF.md`, `/brand/obsidian-brand-guidelines.pdf`, and `/reference/hut8-teardown.md` in full. Confirm understanding of the six-agent dispatch order in `/.claude/agents/README.md`. Then dispatch `nuxt-shell-architect` for Phase 1. Halt after Phase 1 and report back with the brand auditor's verdict before proceeding.

## Repo layout

```
obsidian-site/
├── OBSIDIAN_CLONE_BRIEF.md       ← orchestrator entry point
├── README.md
├── .gitignore
│
├── .claude/
│   └── agents/                   ← six specialist subagent definitions
│       ├── README.md             ← dispatch order + authority
│       ├── nuxt-shell-architect.md
│       ├── webgl-scene-engineer.md
│       ├── narrative-content-architect.md
│       ├── ui-component-craftsman.md
│       ├── mobile-narrative-designer.md
│       └── brand-compliance-auditor.md
│
├── brand/
│   └── obsidian-brand-guidelines.pdf   ← canonical source of truth
│
├── reference/
│   ├── hut8-teardown.md          ← runtime-inspected reference architecture
│   └── hut8-screenshots/         ← captured frames for parity QA
│
├── docs/
│   ├── architecture.md           ← written by orchestrator as build progresses
│   ├── brand-deviations.md       ← maintained by brand-compliance-auditor
│   ├── handoff-phase-*.md        ← one per subagent per phase
│   ├── audit-phase-*.md          ← auditor reports per phase
│   └── qa-parity.md              ← side-by-side comparison vs. hut8.com
│
├── scripts/                      ← voice-audit.ts, glb-build commands, CI helpers
├── assets/
│   ├── css/                      ← tokens.css, tokens-mobile.css
│   └── fonts/                    ← self-hosted Cormorant, Montserrat, Space Mono
├── components/                   ← Vue components (filled by Phase 2)
├── composables/                  ← useScrollScene, useReducedMotion, etc.
├── layouts/                      ← default.vue
├── pages/                        ← index.vue, /mandates, /platforms/*
├── public/                       ← static assets
├── sanity/
│   └── schemas/                  ← landingPage, platformCompany, mandate, etc.
├── data/                         ← camera-paths.json, GLB build pipeline
└── types/                        ← generated Sanity TS types
```

## Phase gates

1. **Phase 1 — Foundation.** `nuxt-shell-architect` runs. `brand-compliance-auditor` audits. Phase 2 blocked until pass.
2. **Phase 2 — Parallel build.** WebGL + content + UI subagents run in parallel. Audited per PR.
3. **Phase 3 — Mobile.** `mobile-narrative-designer` runs after desktop integration. Final audit.
4. **Phase 4 — Production.** Performance budget enforcement, Vercel deploy preview, parity QA, production deploy.

## Non-negotiables (excerpt)

- No Tailwind. No CSS-in-JS framework. CSS custom properties + Vue scoped styles only.
- No ScrollTrigger. No Lenis. No Locomotive. Native browser scroll only.
- No `border-radius` above 0. No `box-shadow` other than `none`. No gradients.
- Gold (`#B8965A`) is never used as a background fill. Accent only.
- No forbidden words from brand section 4.2 anywhere in published content.
- Every transition uses `cubic-bezier(0.25, 0.46, 0.45, 0.94)` at one of five approved durations.

Full rules in `OBSIDIAN_CLONE_BRIEF.md` and `/brand/obsidian-brand-guidelines.pdf`.

---

© 2026 Obsidian Capital Partners. Strictly Confidential.
