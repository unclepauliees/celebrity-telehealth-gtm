# QA Parity vs. hut8.com

> Side-by-side behavioral comparison. Run at the end of Phase 3 against a live deploy preview.

## Status: pending Phase 4

This document is empty until the build reaches Phase 4 (production readiness). At that point, the orchestrator runs through each row below with hut8.com open in one browser tab and the OCP deploy preview open in another, recording observed parity and noting any intentional deviations.

---

## Behavioral parity matrix

| # | Behavior | hut8.com | OCP build | Notes |
|---|---|---|---|---|
| 1 | Total scroll height (desktop) | ~36,223px | | within ±15% |
| 2 | Fixed canvas position | `position: fixed`, full viewport | | |
| 3 | Canvas mount/unmount across acts | mounted once, never unmounted | | |
| 4 | Native scroll vs. hijacked | native | | |
| 5 | `document.documentElement.scrollTop` increments naturally | yes | | |
| 6 | Camera state driven by `scrollY` | yes | | |
| 7 | GLB scene count | 3 (map, scene-1, scene-2) | | 3 (obsidian, capital-chain, platforms) |
| 8 | Total GLB weight | ~860KB | | ≤ 1MB target |
| 9 | Logo fixed top-left | yes | | |
| 10 | Logo color-adapts to section | yes | | |
| 11 | Menu pill fixed top-right | yes | | |
| 12 | Overlay menu two-column | yes | | |
| 13 | In-scene HTML callouts track 3D coords | yes | | |
| 14 | 60fps on M2 Air during scroll | yes | | |
| 15 | Reduced-motion fallback | unknown | | required |
| 16 | Mobile experience | parallel narrative | | parallel narrative |
| 17 | Sanity-driven content | yes | | |
| 18 | Single accent color used with discipline | acid green | | Gold `#B8965A` |
| 19 | Footer treatment | sage barcode motif | | Parchment + Gold rule |
| 20 | Press releases as primary-source format | yes | | three paragraphs max |

## Screenshots

`/reference/hut8-screenshots/` — captured during the reference teardown phase.
`/docs/qa-screenshots/` — captured from the OCP build at parity QA.

## Open items

(to be filled at QA time)
