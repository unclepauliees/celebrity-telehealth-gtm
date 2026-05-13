# Obsidian Capital Site — Architecture Notes

**Status: Live (Track 1 — Static Holding Build)**
**Last updated: 2026-05-13**

---

## Two-Track Architecture

This repository runs two parallel deployment tracks:

### Track 1 — Live Production (this branch / `main`)
- Brand-correct static HTML + CSS build
- 10 HTML pages: main scroll narrative + 3 platform sub-page tiers (public / gate / portfolio)
- Built per Obsidian Capital Partners Brand Identity Guidelines v1.0
- Deployed via GitHub Pages on push to `main`
- Designed to stand alone indefinitely if Track 2 is delayed
- Public-facing intent: this IS the brand site, with no temporal signaling

### Track 2 — Real Build (branch: `nuxt-archive`)
- Full Nuxt 3 + Three.js + GSAP + Sanity CMS architecture
- WebGL scroll-narrative with procedurally-generated .glb scenes
- Canonical content in `data/seed-content.ts` (330-line content seed file)
- Sanity Studio scaffold (7 schemas: landingPage, platformCompany, mandate, pressRelease, caseStudy, principal, footnote)
- Playwright test coverage (12 tests, prior session reported all passing)
- Mobile responsive layer specified in `docs/handoff-phase-3.md`
- Architecturally referenced from hut8.com teardown in `reference/hut8-teardown.md` (preserved on nuxt-archive only)
- Known blocker at time of static deploy: GitHub Pages baseURL routing for .glb scene paths (partial fix was in progress — see git log on `nuxt-archive` for the WIP commits)

---

## Sunset Condition for Track 1

Track 1 is replaced by Track 2 when Track 2 ships. The replacement is a `git merge` of the completed Track 2 branch into `main`. Track 1 history is preserved in the git log; no archive branch needed.

## Track 2 Resumption Notes

When Track 2 work resumes:
1. Branch off `nuxt-archive`, not off `main`
2. The baseURL fix for `.glb` scene paths is documented in earlier WIP commits on `nuxt-archive` — start by completing that fix
3. Wire `data/seed-content.ts` into the act components
4. Activate Sanity by replacing the placeholder `projectId` with a real Sanity project and running the install steps from `docs/handoff-phase-2-content.md`
5. Verify all 12 Playwright tests still pass before merging to `main`

## Why Two Tracks

Track 2 was 80% complete but blocked on the .glb path bug at the time of the brand-deploy decision. Rather than rush Track 2 to ship under pressure, we deployed Track 1 (the static build) as the immediate brand-correct site, freeing Track 2 to be completed at the right pace.

This is not a "temporary site." Track 1 is fully production-grade and brand-compliant. It will remain live until Track 2 is completed AND verified AND deliberately promoted to `main`.

## File Inventory Preserved Across Tracks

Both tracks preserve:
- `brand/obsidian-brand-guidelines.pdf` — authoritative brand source
- `docs/*.md` — 12 handoff and architecture documents

These files are blocked from search engines via `robots.txt` but available to the team via direct URL.

## Contact

Brand Lead approval required for any change that touches the public-facing experience of either track.
