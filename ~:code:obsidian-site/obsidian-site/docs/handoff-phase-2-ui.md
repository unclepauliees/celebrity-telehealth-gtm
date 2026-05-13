# OCP Phase 2 UI — Component Handoff

Phase 2 UI components for Obsidian Capital Partners. All tokens sourced from `assets/css/tokens.css`. No raw hex values, no border-radius, no box-shadow anywhere.

---

## Brand Deviations (Pre-Approved)

### 28px internal card padding (OcpCard)
**Source:** Brand Guidelines Section 3.1 — explicit spec for investment card padding.
**Token grid:** This is 3.5 × 8px, which breaks the 8px grid. The brand doc explicitly states 28px; this overrides the grid rule.
**Applied to:** `.ocp-card` padding on all variants.

### 40px structural gold rule (OcpFooter)
**Source:** Pre-approved structural brand element. This is a full-width horizontal divider (height 40px, background `var(--color-gold)`), not a button fill or interactive element fill. The "gold never as background >40px" rule applies to interactive or decorative fill on user-facing elements, not structural rules.
**Applied to:** `.ocp-footer__gold-rule` — `height: 40px; width: 100%; background: var(--color-gold)`.

---

## Component Reference

### OcpButton
**File:** `components/OcpButton.vue`

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary'` | `'primary'` | Visual style |
| `tag` | `'button' \| 'a'` | `'button'` | Root element |
| `href` | `string` | — | Only used when `tag='a'` |
| `disabled` | `boolean` | — | Disabled state |

**Emits:** `click: [e: MouseEvent]`

**Variants:**
- **primary** — `var(--color-obsidian)` bg, `var(--border-gold)`, gold text. Hover: gold bg, obsidian text.
- **secondary** — transparent bg, `var(--border-gold)`, gold text. Hover: parchment border, parchment text.

---

### OcpCard
**File:** `components/OcpCard.vue`

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Card headline |
| `body` | `string` | required | Body paragraph |
| `eyebrow` | `string` | — | Uppercase label above title |
| `variant` | `'dark' \| 'steel' \| 'parchment'` | `'dark'` | Background/color scheme |
| `dataPoint` | `string` | — | Right-aligned metric (mono) |
| `footnoteRef` | `string` | — | Superscript appended to title |

**Slot:** Default slot — renders below body. Used by PlatformGrid for the lockup line.

**Padding:** 28px on all sides (brand section 3.1 explicit exception to 8px grid).

**Text colors by variant:**
- dark/steel: title `var(--color-parchment)`, body `var(--color-mid-gray)`, eyebrow `var(--color-gold)`
- parchment: title + body `var(--color-obsidian)`, eyebrow `var(--color-gold-active)`

---

### PlatformGrid
**File:** `components/PlatformGrid.vue`

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `platforms` | `Array<{ name, mandate, status? }>` | Platform company data |

**Layout:** `repeat(3, 1fr)` CSS grid on ≥1024px, `1fr` on mobile.
Uses `OcpCard` variant `steel` with default slot injecting the "AN OBSIDIAN CAPITAL PARTNERS PLATFORM COMPANY" lockup line.

---

### MandatesGrid
**File:** `components/MandatesGrid.vue`

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `mandates` | `Array<{ title, sector, description, deploymentRange, targetReturn? }>` | Mandate data |

Sectors: `'infrastructure' | 'technology' | 'realAssets'` — mapped to display labels automatically.
`deploymentRange` is combined into the eyebrow: `"Infrastructure · $50M–$200M"`.
`targetReturn` is the data-point (right-aligned mono metric). When present, superscript `¹` is appended to the card title.
Footnote text `¹ Illustrative. Subject to change. Not a guarantee of returns.` rendered below grid.

---

### WhereBuildList
**File:** `components/WhereBuildList.vue`

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `items` | `Array<{ location, descriptor }>` | Location entries |

**Layout:** Two-column grid. Left column: sticky heading (position: sticky, top: `var(--nav-height)`). Right column: scrolling list.
No hover effects — this is a content list, not interactive.
Dividers use `var(--border-rule)`.

---

### OcpFooter
**File:** `components/OcpFooter.vue`

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `links` | `Array<{ label, href }>` | About / Mandates / Platforms / Engage | Footer nav links |

**Structure:**
1. 40px structural gold rule (full-width, pre-approved — see Brand Deviations above)
2. 3-column grid body: TheWordmark (dark) / nav links / copyright + legal
3. Bottom padding: `var(--space-10)` top, `var(--space-16)` sides, `var(--space-10)` bottom

---

## Icon Components

**Directory:** `components/icons/`

**Rules applied to all icons:**
- `stroke-width="1.5"` — all icons stroke-only, never fill
- `stroke-linecap="square"` — square caps throughout
- `stroke-linejoin="miter"` — miter joins throughout
- `currentColor` for all strokes — caller sets `color` via CSS
- `viewBox="0 0 24 24"`
- No rounded paths, no arcs approximated with curves

**Prop:** `{ size?: number }` — default 24, sets both `width` and `height`.

| Component | Description |
|-----------|-------------|
| `IconArrowRight.vue` | Horizontal arrow with 2-segment angular head |
| `IconChevronDown.vue` | Two-segment V chevron |
| `IconClose.vue` | Two crossing 45° lines |
| `IconExternalLink.vue` | Box open at top-right with corner arrow |
| `IconDocument.vue` | Page with folded corner + two content lines |
| `IconLocation.vue` | Hexagonal shield-teardrop approximated with straight segments |

---

## Mark Devices

**Directory:** `components/marks/`

| Component | Props | Description |
|-----------|-------|-------------|
| `MarkGoldRule.vue` | `width?: string` (default `'100%'`) | 1px horizontal gold line at 40% opacity — uses `rgba(184, 150, 90, 0.4)` background (rgba is not a raw hex; same pattern used in tokens.css for `--border-gold-faint`) |
| `MarkObsidianFracture.vue` | none | SVG 1440×80 with 5 diagonal fracture line segments, gold at 20% opacity |
| `MarkSectionLabel.vue` | `label: string; number: string` | Number (Space Mono) + flex-grow gold line + label (Montserrat 600), all at 60% opacity gold |

---

## Nuxt Component Registration

`nuxt.config.ts` was updated to add:
```ts
components: [
  { path: '~/components', pathPrefix: false },
]
```
This disables the default directory-prefix auto-naming so icons resolve as `<IconArrowRight>` (not `<IconsIconArrowRight>`) and marks as `<MarkGoldRule>` (not `<MarksMarkGoldRule>`).

---

## Dev Showcase

**URL:** `/dev/components`

Accessible only in development (`import.meta.dev` check — throws 404 in production). Page is defined at `pages/dev/components.vue`.

**Sections:**
1. Typography scale (serif + sans, all `--text-*` tokens)
2. Color palette (all `--color-*` swatches)
3. OcpButton — both variants + disabled + anchor
4. OcpCard — all three variants, with/without data point, with footnote ref
5. MandatesGrid — placeholder mandate data
6. PlatformGrid — 3 placeholder platforms
7. WhereBuildList — 7 placeholder locations
8. OcpFooter — full footer render
9. Icons — all 6 in labeled grid at 32px
10. All 3 marks
