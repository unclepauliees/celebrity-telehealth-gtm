# Phase 1 Brand Compliance Audit

**Verdict: FAIL**

**Date:** 2026-05-12
**Auditor:** brand-compliance-auditor
**Phase:** 1 — Shell Delivery (nav, tokens, layout, composables)
**Scope files reviewed:** tokens.css, fonts.css, global.css, TheWordmark.vue, NavMenuPill.vue, NavOverlay.vue, TheNav.vue, layouts/default.vue, pages/index.vue, app.vue, useReducedMotion.ts, useScrolled.ts, useSectionTheme.ts, nuxt.config.ts, tests/phase1-nav.spec.ts

**Pre-approved deviations in scope:** DEV-001 (WebGL camera), DEV-002 (font fallbacks), DEV-003 (NavMenuPill gold hover). None re-flagged.

---

## Phase 2 Status

**BLOCKED.** Three BLOCKING violations found. Phase 2 does not begin until all three are remediated and re-audited.

---

## Category Results

---

### Category 1 — Color Compliance

**Status: FAIL**

#### 1A — Raw hex codes outside tokens.css (BLOCKING)

**Rule:** Every hex code must appear only in `assets/css/tokens.css`. Every other use must reference `var(--color-*)` tokens. (Brand section 2.2, agent scope doc.)

**Grep command used:**
```
grep -rn "#[0-9a-fA-F]{3,8}" --include="*.vue" --include="*.ts" --include="*.css" --include="*.js"
(excluding tokens.css and fonts.css)
```

**Violations found:**

- `components/TheNav.vue:92` — **CSS production rule** containing raw `rgba(10, 10, 10, 0.96)`.
  - This is a live CSS property, not a comment. The scrolled-state background reads: `background: rgba(10, 10, 10, 0.96);`
  - Required fix: Replace with a CSS custom property. A token such as `--surface-primary-96: rgba(10, 10, 10, 0.96)` must be defined in `tokens.css` and referenced here, OR the existing `--surface-primary` / `--color-obsidian` token must be used with an opacity mechanism. As-is, this is a raw color value in a production CSS rule — a direct violation.

**Findings that are comments only (not violations):**
- `composables/useScrolled.ts:7` — comment only, no CSS rule
- `components/NavOverlay.vue:6` — comment only, no CSS rule
- `components/TheNav.vue:12` — comment only, no CSS rule

**Also found:** `assets/css/tokens.css:155` contains `rgba(184, 150, 90, 0.4)` inline in the `--border-gold-faint` token value. This is inside `tokens.css` itself — permitted. The token is correctly defined there; its usage in `NavOverlay.vue` references `var(--border-gold-faint)` — compliant.

---

#### 1B — Named palette hex values (PASS)

Verified all 11+1 palette values in `tokens.css` against brand section 2.2:

| Token | tokens.css value | Brand doc value | Match |
|---|---|---|---|
| `--color-obsidian` | `#0A0A0A` | `#0A0A0A` | PASS |
| `--color-parchment` | `#F5F2EE` | `#F5F2EE` | PASS |
| `--color-gold` | `#B8965A` | `#B8965A` | PASS |
| `--color-gold-light` | `#D4AF78` | `#D4AF78` | PASS |
| `--color-forge-steel` | `#1C2535` | `#1C2535` | PASS |
| `--color-ember` | `#C4883A` | `#C4883A` | PASS |
| `--color-rule-dark` | `#2A2A2A` | `#2A2A2A` | PASS |
| `--color-mid-gray` | `#6B6B6B` | `#6B6B6B` | PASS |
| `--color-status-green` | `#2D5C3D` | `#2D5C3D` | PASS |
| `--color-status-amber` | `#7A5A1E` | `#7A5A1E` | PASS |
| `--color-status-burgundy` | `#5C2D2D` | `#5C2D2D` | PASS |
| `--color-gold-active` | `#9A7A45` | `#9A7A45` (brand section 3.1 component spec) | PASS |

All 11 named palette colors plus the active state extension are exact matches.

---

#### 1C — Gold as background fill above 40px (WARN — pre-approved DEV-003)

`NavMenuPill.vue:68` and `NavMenuPill.vue:91` apply `background: var(--color-gold)` on the `.nav-pill` and `.nav-pill--open` states. The pill renders at approximately 180px × 32px (32px height is within the 40px height limit, but 180px width exceeds the 40px width limit per the rule "above 40px in either dimension").

This deviation is documented as DEV-003 and approved pending auditor sign-off. The auditor sign-off position:

**DEV-003 is APPROVED at this phase gate** with the following conditions:
- Gold fill applies only on hover/active interactive state, not at rest
- The element is 32px tall (under the 40px threshold in one dimension)
- The rule's intent is to prevent Gold as a decorative color wash on surfaces; a 32px-tall button affordance is an interactive indicator, not a decorative fill
- Gold background fill remains forbidden on any element serving as a section background, panel, card, or any decorative surface

---

### Category 2 — Typography

**Status: FAIL**

#### 2A — Raw font-size values in component files (BLOCKING)

**Rule:** All values must reference tokens. (Implied by the no-raw-values constraint throughout; explicit in the token system design.)

**Violations found:**

- `components/TheWordmark.vue:60` — `font-size: 18px;` — raw pixel value, not referencing a `--text-*` token
- `components/TheWordmark.vue:72` — `font-size: 8px;` — raw pixel value, not referencing a `--text-*` token

**Note on 8px:** The value `8px` for the `CAPITAL PARTNERS` line is also problematic on a second ground. Brand section 2.1 states the wordmark must use the established typographic scale. `8px` falls below any defined `--text-*` token in `tokens.css` (the smallest is `--text-caption: 11px` and `--text-label: 10px`). This is an off-scale size with no corresponding token. The wordmark scale rationale states "OBSIDIAN occupies the dominant line, scaled 2.5× the height of the subsidiary line." If OBSIDIAN renders at 18px, the sub-line should render at 18/2.5 = 7.2px — but 8px is an approximation at a size that is (a) not on the spacing grid and (b) below even the smallest defined text token.

**Required fix for 2A:** Define a wordmark-specific size token in `tokens.css` (e.g., `--text-wordmark-primary: 18px` and `--text-wordmark-sub: 8px`) or, preferably, recalibrate the wordmark sub-line size to align with the defined scale (`--text-label: 10px` is the nearest on-scale value and would produce a 1.8× ratio rather than 2.5×). Either way, raw pixel values must be replaced with token references.

---

#### 2B — Font-family declarations (PASS)

All `font-family` declarations in Phase 1 source files use only:
- `var(--font-serif)` → `'Cormorant Garamond', Georgia, serif` (DEV-002 approved)
- `var(--font-sans)` → `'Montserrat', system-ui, sans-serif` (DEV-002 approved)
- `font-family: inherit` (button reset in global.css)
- `@font-face` declarations in `fonts.css` (exempt from rule per audit scope)

No unexpected typefaces found.

---

#### 2C — Montserrat never italic (PASS)

`fonts.css` comment at line 105 explicitly states: "NOTE: Montserrat is NEVER italic. No font-style: italic rules exist for it." Confirmed: no `font-style: italic` declaration exists for any Montserrat rule. The only `font-style: italic` in `fonts.css` is for `Cormorant Garamond` weight 400 (the italic variant required for pull quotes — correct per brand section 2.3).

No `font-style: italic` applied to Montserrat anywhere.

---

#### 2D — No font-weight: 700 on Cormorant Garamond for body copy (PASS)

The only `font-weight: 700` in the codebase is `fonts.css:168`, which is the `@font-face` declaration registering the Montserrat Bold font file — not an applied style rule. No `font-weight: 700` is applied to any Cormorant Garamond element.

---

#### 2E — Typography scale token values (PASS)

Verified `tokens.css` type scale against brand section 2.3:

| Token | Value | Brand spec | Match |
|---|---|---|---|
| `--text-display` | `80px` | `80–104px` | PASS (within range; 80px is the base) |
| `--text-h1` | `56px` | `56px` | PASS |
| `--text-h2` | `40px` | `40px` | PASS |
| `--text-h3` | `20px` | `20px` | PASS |
| `--text-h4` | `16px` | `16px` | PASS |
| `--text-body-lg` | `18px` | `18px` | PASS |
| `--text-body` | `15px` | `15px` | PASS |
| `--text-body-sm` | `13px` | `13px` | PASS |
| `--text-caption` | `11px` | `11px` | PASS |
| `--text-label` | `10px` | `10px` | PASS |
| `--text-eyebrow` | `10px` | `10px` | PASS |
| `--text-data` | `14px` | `14px` | PASS |
| `--text-pull-quote` | `28px` | `28px` | PASS |

All type scale tokens match.

---

### Category 3 — Forbidden Visual Treatments

**Status: PASS**

All six forbidden treatment categories checked:

| Check | Result |
|---|---|
| `border-radius` with value above 0 | PASS — none found |
| `box-shadow` with non-`none` value | PASS — none found |
| `background-image: linear-gradient` or `radial-gradient` | PASS — none found |
| `text-shadow` with non-`none` value | PASS — none found |
| `transform: scale` on hover | PASS — none found |
| `animation-iteration-count: infinite` | PASS — none found |
| `@keyframes` (bounce, pulse, heartbeat, wobble, flash) | PASS — no `@keyframes` at all in Phase 1 |
| `filter: blur` (except nav backdrop) | PASS — only `backdrop-filter: blur(12px)` on `.the-nav--scrolled`, which is the approved navigation behavior per brand section 3.1 ("backdrop-filter: blur(12px) on scroll") |

The `backdrop-filter: blur(12px)` on TheNav is explicitly specified in brand section 3.1 Navigation. This is not a `filter: blur` applied to content — it is the approved backdrop blur for the nav frosted-glass scroll state.

---

### Category 4 — Motion Compliance

**Status: PASS**

All transition declarations reviewed:

| File | Transition | Easing | Duration | Compliant |
|---|---|---|---|---|
| `NavMenuPill.vue:61–63` | background, color | `var(--ease-ocp)` | `var(--duration-micro)` | PASS |
| `NavMenuPill.vue:92–93` | background | `var(--ease-ocp)` | `var(--duration-micro)` | PASS |
| `NavOverlay.vue:286` | opacity | `var(--ease-ocp)` | `var(--duration-section)` | PASS |
| `NavOverlay.vue:339` | color | `var(--ease-ocp)` | `var(--duration-micro)` | PASS |
| `NavOverlay.vue:363` | color | `var(--ease-ocp)` | `var(--duration-micro)` | PASS |
| `NavOverlay.vue:413` | color | `var(--ease-ocp)` | `var(--duration-micro)` | PASS |
| `NavOverlay.vue:455–457` | border-color, color | `var(--ease-ocp)` | `var(--duration-micro)` | PASS |
| `TheNav.vue:85–87` | background, border-color | `var(--ease-ocp)` | `var(--duration-standard)` | PASS |
| `layouts/default.vue:65` | transform | `var(--ease-ocp)` | `var(--duration-micro)` | PASS |

No bare `ease`, `ease-in`, `ease-out`, `ease-in-out`, or `linear` keywords found in any transition declaration.

`--ease-ocp` in `tokens.css:129` confirmed: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` — exact match to brand section 2.6.

Duration tokens confirmed against brand section 2.6:
- `--duration-active: 100ms` ✓
- `--duration-micro: 150ms` ✓ (UI micro-interactions)
- `--duration-standard: 300ms` ✓
- `--duration-section: 500ms` ✓
- `--duration-cinematic-min: 800ms` / `--duration-cinematic-max: 1200ms` ✓
- `--duration-stagger: 60ms` ✓

Reduced motion global override in `global.css:161–170` is present and correct: collapses all durations to `0.01ms` under `prefers-reduced-motion: reduce`.

---

### Category 5 — Spacing

**Status: FAIL**

**Rule:** Every margin, padding, gap, top, bottom, left, right value in px is a multiple of 8. 1px permitted for borders only. (Brand section 3.1.)

**Grep command:**
```
grep -rEn "(margin|padding|gap|top|bottom|left|right):\s*[0-9]+px" --include="*.css" --include="*.vue"
```

**Violations found:**

- `components/NavMenuPill.vue:82` — `gap: 4px;` — **BLOCKING**
  - The icon container (`.nav-pill__icon`) uses `gap: 4px` to space the two hamburger lines. `4px` is not a multiple of 8. The nearest permitted values are `8px` (one spacing unit) or `0px`. 4px is half a unit — not permitted.
  - Required fix: Change to `gap: var(--space-1)` (8px) or to `0` with adjusted `height` to maintain visual separation, or define a half-unit token if justified (which would itself require a deviation filing since the spacing spec is explicit).

- `components/TheWordmark.vue:48` — `gap: 2px;` — **BLOCKING**
  - The wordmark flex container uses `gap: 2px` between the OBSIDIAN line and the CAPITAL PARTNERS line. `2px` is not a multiple of 8 and is not a border/rule context (it is a layout gap).
  - Required fix: Remove the gap and use line-height to control vertical spacing, OR change to `gap: var(--space-1)` (8px) if the visual weight allows it. A 2px gap between text lines is a typographic fine-tuning — it must be achieved through `line-height` tokens on the individual spans, not through a raw layout gap.

**Values that pass:**
- `components/TheNav.vue:84` — `border-bottom: 1px solid transparent` — 1px is permitted for borders. PASS.
- `assets/css/tokens.css:118` — `--grid-margin-desktop: 80px` — token definition (80 is a multiple of 8). PASS.

---

### Category 6 — Logo / Wordmark

**Status: FAIL (by inheritance from Category 5)**

Core wordmark structure and color variants are correct. Violations are spacing-related (Category 5) and type-sizing-related (Category 2):

| Check | Result |
|---|---|
| OBSIDIAN line: Cormorant Garamond font-family | PASS — `var(--font-serif)` |
| CAPITAL PARTNERS line: Montserrat font-family | PASS — `var(--font-sans)` |
| OBSIDIAN line: font-weight 300 | PASS |
| CAPITAL PARTNERS line: font-style never italic | PASS — `font-style: normal` explicitly set |
| Three approved color variants (light, dark, gold) | PASS — all three implemented with correct tokens |
| No effects, shadows, gradients, rotations | PASS — none present |
| No containing border-radius | PASS |
| Minimum width 120px enforced | PASS — `min-width: var(--nav-logo-min-width)` |
| `gap: 2px` between wordmark lines | FAIL — see Category 5, BLOCKING |
| Raw font-size values | FAIL — see Category 2A, BLOCKING |

---

### Category 7 — Forbidden Words Scan

**Status: PASS**

Scanned all `.vue` and `.ts` files (excluding node_modules, .nuxt, .output) for all forbidden tokens from brand section 4.2:

`leverage`, `synergies`, `synergy`, `best-in-class`, `world-class`, `ecosystem`, `disruptive`, `passionate`, `excited`, `committed to excellence`, `seasoned`, `proven track record`, `value-creating`, `cutting-edge`, `innovative`

**Result: Zero hits.** No forbidden vocabulary found in any template string, meta tag, aria-label, or alt text in Phase 1 deliverables.

The index.vue description meta reads: "Obsidian Capital Partners is a principal-position institutional capital firm operating in infrastructure and industrial platform companies." — clean, on-brand.

---

### Category 8 — Accessibility Floor

**Status: PASS**

| Check | Result |
|---|---|
| Skip-to-content link in `layouts/default.vue` | PASS — `<a href="#main-content" class="skip-link">` present at line 23 |
| Skip link visually hidden until focused | PASS — `transform: translateY(-100%)` at rest, animates to `translateY(0)` on `:focus-visible` |
| Focus states use `var(--color-gold)` / `var(--focus-ring)` token | PASS — `--focus-ring: 1px solid var(--color-gold)` in tokens.css; applied globally via `*:focus-visible` in global.css and individually in TheNav.vue, default.vue |
| No `outline: none` without replacement | PASS — `*:focus { outline: none }` in global.css is immediately followed by `*:focus-visible { outline: var(--focus-ring); outline-offset: var(--focus-ring-offset); }`. The removal of the default ring is paired with the brand-compliant replacement on `:focus-visible`. This is the standard accessible pattern and does not constitute a violation. |
| `useReducedMotion` composable exists | PASS — `composables/useReducedMotion.ts` present and correct |
| `useReducedMotion` referenced | CONDITIONAL PASS — The composable is defined and the global CSS `@media (prefers-reduced-motion: reduce)` block handles CSS-level motion reduction. However, `useReducedMotion` is not yet imported by any Vue component — no Phase 1 component contains 3D/GSAP animations that would require the JS-side check. The composable is established for Phase 2 consumption (WebGL canvas, GSAP tweens). This is appropriate for Phase 1 scope. |
| Focus trap logic in `NavOverlay.vue` | PASS — Full focus trap implemented: `getFocusableElements()`, Tab/Shift+Tab wrapping, ESC close, focus restore to trigger on close |
| `role="dialog"` and `aria-modal="true"` on overlay | PASS |
| Nav pill `aria-expanded` attribute | PASS |
| `aria-hidden="true"` on decorative SVG icons | PASS |
| `aria-hidden="true"` on WebGL canvas mount | PASS |

---

### Category 9 — Structural Integrity

**Status: PASS**

| Check | Result |
|---|---|
| `ssr: true` in nuxt.config.ts | PASS — line 4 |
| No CSS framework imports (Tailwind, Bootstrap, Emotion) | PASS — `modules: []` in nuxt.config.ts; no framework dependencies found in package.json or source files |
| `tokens.css` loaded first in CSS array | PASS — `['~/assets/css/tokens.css', '~/assets/css/fonts.css', '~/assets/css/global.css']` — tokens.css is index 0 |
| `#webgl-canvas-mount` present in `layouts/default.vue` | PASS — line 36 |
| `#webgl-canvas-mount` has `position: fixed` | PASS — `layouts/default.vue:76` |

---

## Summary of All Violations

### BLOCKING — Must be remediated before Phase 2

| ID | File | Line | Violation | Rule |
|---|---|---|---|---|
| B-01 | `components/TheNav.vue` | 92 | Raw CSS value `rgba(10, 10, 10, 0.96)` used in production CSS rule (`.the-nav--scrolled { background: ... }`) | Brand section 2.2: every color value outside tokens.css must reference a `var(--color-*)` token |
| B-02 | `components/NavMenuPill.vue` | 82 | `gap: 4px` — not a multiple of 8 and not a border context | Brand section 3.1: all spacing in px is a multiple of 8; 1px permitted for borders only |
| B-03 | `components/TheWordmark.vue` | 48 | `gap: 2px` — not a multiple of 8 and not a border context | Brand section 3.1: same rule |
| B-04 | `components/TheWordmark.vue` | 60 | `font-size: 18px` — raw pixel value, no token reference | Tokenization requirement: all values reference tokens (this includes font-sizes, which have a complete `--text-*` scale defined) |
| B-05 | `components/TheWordmark.vue` | 72 | `font-size: 8px` — raw pixel value, no token reference; value also falls below the smallest defined text token (`--text-label: 10px`) and below the 13px Cormorant minimum for the OBSIDIAN line context | Brand section 2.3: Cormorant Garamond never below 13px; tokenization requirement |

**Note on B-04 and B-05:** The OBSIDIAN line at 18px satisfies the 13px minimum floor for Cormorant Garamond. The raw value itself is the violation. The CAPITAL PARTNERS sub-line at 8px (Montserrat) does not trigger the 13px Cormorant rule (that rule applies to Cormorant Garamond only), but the raw value and off-scale size remain violations requiring token definition.

### WARNING — Should fix, does not block Phase 2 if addressed

None found beyond the BLOCKING items above.

---

## Required Remediation

To proceed to Phase 2, `nuxt-shell-architect` must address all five BLOCKING items:

1. **B-01** — Add a token for the nav scroll background opacity variant. Options:
   - Add `--surface-primary-96: rgba(10, 10, 10, 0.96)` to `tokens.css` and replace the raw rgba in `TheNav.vue` with `var(--surface-primary-96)`.
   - Or use `color-mix(in srgb, var(--color-obsidian) 96%, transparent)` if targeting modern browsers only — but this must be verified for SSR hydration correctness.

2. **B-02** — `NavMenuPill.vue:82`: Change `gap: 4px` to achieve the hamburger-line visual separation without a non-grid value. Options: `gap: var(--space-1)` (8px) or eliminate the gap and use a `height` approach with `justify-content: space-between`. If 4px is a deliberate design decision, a deviation must be filed.

3. **B-03** — `TheWordmark.vue:48`: Change `gap: 2px` to `gap: 0` and control wordmark line spacing through `line-height` values on each span. The current `line-height: 1` on each span with a 2px gap can be replaced by adjusting line-height tokens or adding top/bottom padding in multiples of 8.

4. **B-04** — `TheWordmark.vue:60`: Add `--text-wordmark-primary` token to `tokens.css` (value: 18px or a scale-appropriate alternative) and replace the raw value.

5. **B-05** — `TheWordmark.vue:72`: Add `--text-wordmark-sub` token to `tokens.css` (value: 8px if the design requires it) and replace the raw value. If the value is 8px, the auditor notes this is below `--text-label: 10px` — the smallest defined text token. The implementing agent may wish to review whether 10px (`--text-label`) is acceptable at the wordmark sub-line scale before filing a token, or file a deviation if 8px is intentional.

---

## Final Verdict

**FAIL.**

Phase 2 is blocked. Five BLOCKING violations identified across three files. No warnings beyond the blocking items. The codebase is architecturally sound — the token system, motion implementation, accessibility structure, and forbidden treatment restraint are all correctly implemented. The violations are localized: one raw color value in TheNav, and four raw sizing values in TheWordmark. These are small, precise fixes. The phase should be clearable in a single remediation pass.

**Re-audit required** on the following files after remediation:
- `components/TheNav.vue`
- `components/TheWordmark.vue`
- `components/NavMenuPill.vue`
- `assets/css/tokens.css` (to verify new tokens are correctly added)

Approved deviations DEV-001, DEV-002, and DEV-003 are confirmed and logged. DEV-003 receives formal auditor sign-off at this phase gate.

---

*Signed: brand-compliance-auditor — 2026-05-12*

---

## Remediation Re-Audit — 2026-05-12

**Verdict: PASS**

**Auditor:** brand-compliance-auditor
**Re-audit scope:** `components/TheNav.vue`, `components/TheWordmark.vue`, `components/NavMenuPill.vue`, `assets/css/tokens.css`
**Pre-approved deviations in effect:** DEV-001, DEV-002, DEV-003 — not re-flagged.

---

### Violation Status — All Five Items

| ID | File | Original violation | Status | Evidence |
|---|---|---|---|---|
| B-01 | `components/TheNav.vue` | Raw `rgba(10, 10, 10, 0.96)` in `.the-nav--scrolled` background | **CLOSED** | Line 92: `background: var(--surface-nav-scrolled);` — no raw rgba present |
| B-02 | `components/NavMenuPill.vue` | `gap: 4px` in `.nav-pill__icon` | **CLOSED** | Lines 78–84: `justify-content: space-between` present; no `gap:` declaration at all |
| B-03 | `components/TheWordmark.vue` | `gap: 2px` in `.wordmark` flex container | **CLOSED** | Line 48: `gap: 0;` |
| B-04 | `components/TheWordmark.vue` | `font-size: 18px` raw value | **CLOSED** | Line 59: `font-size: var(--text-wordmark-primary);` |
| B-05 | `components/TheWordmark.vue` | `font-size: 8px` raw value | **CLOSED** | Line 71: `font-size: var(--text-wordmark-sub);` |

### Token Verification — `assets/css/tokens.css`

| Token | Line | Resolves to | Correct |
|---|---|---|---|
| `--surface-nav-scrolled` | 172 | `rgba(10, 10, 10, 0.96)` | YES |
| `--text-wordmark-primary` | 181 | `18px` | YES |
| `--text-wordmark-sub` | 182 | `8px` | YES |

All three new tokens are present in the NAV and WORDMARK TYPE SCALE sections respectively, with inline comments documenting their brand-section rationale. No token name collisions with existing `--text-*` or `--surface-*` entries.

---

### New-Violation Scan

#### Hex grep (raw color values outside tokens.css)

Command: `grep -n "#[0-9a-fA-F]{3,8}" components/TheNav.vue components/TheWordmark.vue components/NavMenuPill.vue assets/css/tokens.css`

Results:
- `components/TheNav.vue:12` — `#0A0A0A` inside a JSDoc comment block. Comment-only; no CSS rule. Flagged as compliant in the original audit.
- `assets/css/tokens.css` — all hex values are within the token file itself. Permitted per rule.

**No new hex violations introduced.**

#### Spacing grep (raw px values in layout properties)

Command: `grep -En "(margin|padding|gap|top|bottom|left|right):\s*[0-9]+px" components/TheNav.vue components/TheWordmark.vue components/NavMenuPill.vue`

Results:
- `components/TheNav.vue:84` — `border-bottom: 1px solid transparent` — 1px border exception. Approved in original audit.

**No new spacing violations introduced.**

#### Motion / easing grep

Command: `grep -n "transition\|animation" components/TheNav.vue components/TheWordmark.vue components/NavMenuPill.vue`

Results:
- `TheNav.vue:85–87` — `background var(--duration-standard) var(--ease-ocp)`, `border-color var(--duration-standard) var(--ease-ocp)` — compliant (unchanged from original audit, Category 4 PASS)
- `NavMenuPill.vue:61–63` — `background var(--duration-micro) var(--ease-ocp)`, `color var(--duration-micro) var(--ease-ocp)` — compliant
- `NavMenuPill.vue:91–93` — `background var(--duration-micro) var(--ease-ocp)` — compliant

No bare `ease`, `ease-in`, `ease-out`, `ease-in-out`, or `linear` found. All transitions unchanged and compliant.

#### Forbidden visual treatments grep

Command: `grep -n "border-radius\|box-shadow\|linear-gradient\|text-shadow\|transform: scale" components/TheNav.vue components/TheWordmark.vue components/NavMenuPill.vue`

Results:
- `components/TheWordmark.vue:51` — `/* No effects. No shadows. No border-radius. */` — comment only
- `components/TheNav.vue:16` — `*   - No border-radius. No box-shadow.` — comment only

No active declarations of any forbidden treatment found.

---

### Re-Audit Verdict

**PASS.**

All five BLOCKING violations from the Phase 1 audit are confirmed closed. No new color, spacing, motion, or forbidden-treatment violations were introduced during remediation. The fixes are minimal and precise: three tokens added to `tokens.css`, one raw rgba replaced with a token reference in `TheNav.vue`, two raw font-size values replaced with token references in `TheWordmark.vue`, and the non-grid `gap: 4px` removed from `NavMenuPill.vue` in favor of `justify-content: space-between`.

**Phase 2 may proceed.**

*Signed: brand-compliance-auditor — 2026-05-12*
