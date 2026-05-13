# Phase 2 Brand Compliance Audit — 2026-05-12

## Summary
**PASS** (after remediation)

---

## Initial Verdict
**FAIL** — 1 blocking violation (B-03, OcpButton.vue primary hover).

## Remediation
- **B-03 — OcpButton.vue:77-79** — Primary hover applied `background: var(--color-gold)` at computed height ~49.5px (over 40px threshold).
- **Resolution**: DEV-004 filed and user-authorized at Phase 2 gate. Same rationale as DEV-003: OcpButton primary hover is a bounded interactive affordance (not decorative gold wash), and maintaining 49.5px height preserves WCAG 44px touch target guidance.
- **Status**: RESOLVED. DEV-004 logged in `docs/brand-deviations.md`.

---

## Violations
None remaining after remediation.

---

## Warnings (non-blocking — carry to Phase 3)

| Code | File | Note |
|------|------|------|
| A-01 (info) | `marks/MarkGoldRule.vue:13` | `rgba(184,150,90,0.4)` in style — not a hex value but lacks a dedicated token. Recommend `--color-gold-40` token in future phase. |
| A-01 (info) | `marks/MarkObsidianFracture.vue:15-19` | SVG inline `stroke="rgba(184,150,90,0.2)"` — SVG presentation attribute (not style block). Recommend `--color-gold-20` token. |
| A-02 (dev-only) | `pages/dev/components.vue:399` | `gap: 4px` — dev-only page (404 in production), not a production surface. |
| A-02 (dev-only) | `pages/dev/components.vue:101` | `margin-top: 32px` inline — dev-only, use `var(--space-4)` for consistency. |
| A-02 | `OcpCard.vue:104` | `margin-left: 2px` superscript micro-offset — sub-grid typographic nudge, analogous to 1px border exemption. Recommend `--space-micro: 2px` token. |
| D-01 (dev-only) | `pages/dev/components.vue:94-109` | Cormorant rendered at 10–11px in type scale showcase — intentional dev reference, 404 in production. |

---

## Open Questions (resolved)

**F-04 — Act 4 content structure**: User confirmed **three principal bios** (40 words each, DRAFT) at Phase 2 gate. Phase 3 (mobile-narrative-designer) will design mobile layout around three principal cards for Act 4 (scroll range 14,000–21,000px).

---

## Approved Exemptions

| Exemption | File | Details |
|-----------|------|---------|
| DEV-001 | WebGLCanvas.vue, useScrollScene.ts | WebGL camera flythrough — not parallax |
| DEV-002 | tokens.css | Font fallback stacks — APPROVED Phase 2 gate |
| DEV-003 | NavMenuPill.vue | Gold fill hover, ~32px height — APPROVED Phase 2 gate |
| DEV-004 | OcpButton.vue | Gold fill primary hover, ~49.5px — APPROVED Phase 2 gate |
| Three.js hex | build-scenes.ts, useScrollScene.ts | Raw hex in Three.js Color API calls — documented exception (A-06) |
| 28px card padding | OcpCard.vue | Brand section 3.1 explicit specification |
| 40px footer gold rule | OcpFooter.vue | Structural element, height exactly 40px |

## Structural Checks

| Check | Result |
|-------|--------|
| G-01: `aria-hidden="true"` on `#webgl-canvas-mount` | PASS |
| G-02: Total scroll height = 36,000px | PASS (1200+1300+11500+7000+12000+3000) |
| G-03: ScenePin uses `Vector3.project(camera)` | PASS |
| C-03: Passive scroll listener | PASS (`{ passive: true }`) |
| C-04: No ScrollTrigger import | PASS |
| C-05: Reduced motion check before rAF | PASS |
| E-01–E-05: All 6 icon components | PASS |
| F-01: No forbidden words in seed content | PASS |
| F-02: DRAFT flags on financial figures | PASS |
| F-03: OCP platform lockup exact string | PASS |

---

## Remediation Re-Audit — 2026-05-12

DEV-004 filed for B-03 violation per auditor Option B. User authorized at Phase 2 gate.
All blocking violations resolved.

## Final Verdict
**PASS — Phase 3 (mobile-narrative-designer) may proceed.**
