# Phase 2 Content Handoff — narrative-content-architect

**Agent:** `narrative-content-architect`  
**Date:** 2026-05-12  
**Build status:** All files created. Sanity package not yet installed (see install step below).  
**Hands off to:** `webgl-scene-engineer` (Phase 2 WebGL), `ui-component-craftsman` (Phase 2 components), `mobile-narrative-designer` (mobile variants)

---

## Install Step (Required Before Running Sanity Studio)

Sanity is not yet in `package.json`. Run before using any Sanity tooling:

```bash
npm install sanity @sanity/vision
```

Then start the studio:

```bash
cd /path/to/obsidian-site
npx sanity dev
# → Sanity Studio at http://localhost:3333
```

---

## Environment Variables Required

| Variable | Description | Example |
|---|---|---|
| `SANITY_PROJECT_ID` | Sanity project ID from sanity.io/manage | `abc123de` |
| `SANITY_DATASET` | Dataset name | `production` |

Create a `.env` file in the project root (already in `.gitignore`):

```bash
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
```

---

## Schema List and Field Summary

All schemas are in `/sanity/schemas/`. The index file is `/sanity/schemas/index.ts`.

### `landingPage` (Singleton)

One document per site. Contains all six scroll acts.

| Field | Type | Notes |
|---|---|---|
| `title` | `string` | Internal label only |
| `acts` | `array<actBlock>` | Max 6 entries |
| `acts[].actId` | `string` | `act1`–`act6` |
| `acts[].headline` | `string` | Max 60 chars |
| `acts[].subhead` | `text` | One sentence |
| `acts[].body` | `block[]` | Portable text, max 120 words |

### `platformCompany`

One document per platform company.

| Field | Type | Notes |
|---|---|---|
| `name` | `string` | Required |
| `mandate` | `string` | Max 80 chars |
| `logoMark` | `image` | Optional |
| `status` | `draft\|live` | Default: `draft` |
| `mandateSummary` | `text` | Max 40 words |
| `ocpLabel` | `string` | Hardcoded, read-only |

### `mandate`

One document per investment mandate category.

| Field | Type | Notes |
|---|---|---|
| `title` | `string` | Required |
| `sector` | `infrastructure\|technology\|realAssets` | Required |
| `deploymentMin` | `number` | In $M. DRAFT — legal review |
| `deploymentMax` | `number` | In $M. DRAFT — legal review |
| `description` | `text` | Max 25 words |
| `targetReturn` | `string` | Format: "X%–Y% net IRR". DRAFT |
| `status` | `draft\|live` | Default: `draft` |

### `pressRelease`

| Field | Type | Notes |
|---|---|---|
| `headline` | `string` | Required |
| `date` | `date` | Required |
| `source` | `string` | Publication name |
| `url` | `url` | Link to original |
| `excerpt` | `text` | Max 50 words |

### `caseStudy`

| Field | Type | Notes |
|---|---|---|
| `title` | `string` | Required |
| `platformCompany` | `reference → platformCompany` | Optional |
| `body` | `block[]` | Portable text |
| `publishedAt` | `date` | |
| `featured` | `boolean` | Default: false |

### `principal`

| Field | Type | Notes |
|---|---|---|
| `name` | `string` | Required. DRAFT until confirmed. |
| `title` | `string` | Required |
| `bio` | `text` | Required. Strict max 40 words. |
| `photo` | `image` | Optional |
| `order` | `number` | Display order, ascending |
| `status` | `draft\|live` | Default: `draft` |

### `footnote`

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | Format: `fn-001`. Must be unique. |
| `body` | `text` | Required |
| `legalDisclaimer` | `text` | Required for financial figures |
| `appliesTo` | `string` | Section/field reference |

---

## TypeScript Types

All types are in `/types/sanity.ts`. No external package required — types are manually authored.

```typescript
import type {
  SanityLandingPage,
  SanityPlatformCompany,
  SanityMandate,
  SanityPressRelease,
  SanityCaseStudy,
  SanityPrincipal,
  SanityFootnote,
  ActId,
  MandateSector,
  ContentStatus,
} from '../types/sanity'
```

Type guards are also exported for runtime validation (`isSanityLandingPage`, etc.).

---

## Seed Content

Seed content for all six acts is in `/data/seed-content.ts`.

```typescript
import seedContent from '../data/seed-content'
import { act1, act2, act3, act4, act5, act6 } from '../data/seed-content'
import { mandateInfrastructure, mandateTechnology, mandateRealAssets } from '../data/seed-content'
import { principalOne, principalTwo, principalThree } from '../data/seed-content'
import { platformOne, platformTwo, platformThree } from '../data/seed-content'
import { footnotes } from '../data/seed-content'
```

All seed content is voice-compliant. Run `npm run voice-audit` to verify.

---

## GROQ Query Patterns

### Landing Page (singleton)

```groq
*[_type == "landingPage"][0] {
  title,
  acts[] {
    actId,
    headline,
    subhead,
    body
  }
}
```

### All Live Platform Companies

```groq
*[_type == "platformCompany" && status == "live"] | order(_createdAt asc) {
  _id,
  name,
  mandate,
  mandateSummary,
  ocpLabel,
  "logoMarkUrl": logoMark.asset->url
}
```

### All Mandates by Sector

```groq
*[_type == "mandate"] | order(sector asc) {
  _id,
  title,
  sector,
  deploymentMin,
  deploymentMax,
  description,
  targetReturn,
  status
}
```

### Infrastructure Mandates Only

```groq
*[_type == "mandate" && sector == "infrastructure" && status == "live"] {
  _id,
  title,
  deploymentMin,
  deploymentMax,
  description,
  targetReturn
}
```

### Principals (ordered)

```groq
*[_type == "principal" && status == "live"] | order(order asc) {
  _id,
  name,
  title,
  bio,
  "photoUrl": photo.asset->url
}
```

### Press Releases (newest first)

```groq
*[_type == "pressRelease"] | order(date desc) {
  _id,
  headline,
  date,
  source,
  url,
  excerpt
}
```

### Featured Case Studies

```groq
*[_type == "caseStudy" && featured == true] | order(publishedAt desc) {
  _id,
  title,
  publishedAt,
  "platformCompanyName": platformCompany->name,
  body
}
```

### Footnotes by Section

```groq
*[_type == "footnote" && appliesTo match "act3*"] {
  id,
  body,
  legalDisclaimer,
  appliesTo
}
```

---

## Voice Compliance

### Run the audit

```bash
npm run voice-audit
# or:
node --experimental-strip-types scripts/voice-audit.ts
```

**Requires Node 22+** (project is already on `@types/node: ^22.0.0`).

Exit code 0 = clean. Exit code 1 = violations (report printed to stdout).

### What it checks

1. All string literals in `/data/seed-content.ts` against 22 forbidden word patterns.
2. Word count limits:
   - `act1.headline` — max 8 words (VISION register)
   - `act2.headline` — max 8 words (VISION register)
   - `mandate[n].description` — max 25 words
   - `principal[n].bio` — max 40 words (strict)
   - `platform[n].mandateSummary` — max 40 words

### Voice register reference

Full register documentation: `/docs/voice-registers.md`

---

## All DRAFT Flags — Items Requiring Review Before Launch

### Financial Figures (Legal Review Required)

All deployment ranges and target return figures in `/data/seed-content.ts` are marked `// DRAFT — illustrative only, legal review required`. They must not be published until:

1. Legal counsel reviews and approves each figure.
2. Footnote disclaimers (fn-001, fn-002) are reviewed and approved.
3. The `status` field on each mandate document is changed from `'draft'` to `'live'`.

| Item | Location | Flag |
|---|---|---|
| Infrastructure deploymentMin/Max ($50M–$500M) | `mandateInfrastructure` | DRAFT |
| Infrastructure targetReturn (12%–18% net IRR) | `mandateInfrastructure` | DRAFT |
| Technology deploymentMin/Max ($25M–$250M) | `mandateTechnology` | DRAFT |
| Technology targetReturn (18%–28% net IRR) | `mandateTechnology` | DRAFT |
| Real Assets deploymentMin/Max ($20M–$200M) | `mandateRealAssets` | DRAFT |
| Real Assets targetReturn (10%–15% net IRR) | `mandateRealAssets` | DRAFT |

### Principal Information (Principal Review Required)

All principal names and bios are placeholders. Real names and biographies must be provided and approved by each principal before `status` is changed from `'draft'` to `'live'`.

| Item | Location | Flag |
|---|---|---|
| Managing Principal name and bio | `principalOne` | DRAFT |
| Principal, Technology name and bio | `principalTwo` | DRAFT |
| Principal, Infrastructure name and bio | `principalThree` | DRAFT |
| Footnote fn-003 (principal disclaimer) | `footnotes[2]` | DRAFT |

### Platform Company Names (Confirmation Required)

All platform company names are placeholders pending confirmation.

| Item | Location | Flag |
|---|---|---|
| Platform One name | `platformOne` | DRAFT |
| Platform Two name | `platformTwo` | DRAFT |
| Platform Three name | `platformThree` | DRAFT |

### Contact Details (Confirmation Required)

| Item | Location | Flag |
|---|---|---|
| Contact address | `act6.address` | DRAFT |
| Contact email | `act6.email` | DRAFT |

---

## File Locations

| File | Purpose |
|---|---|
| `/sanity/sanity.config.ts` | Sanity Studio v3 configuration |
| `/sanity/sanity.cli.ts` | Sanity CLI configuration |
| `/sanity/tsconfig.json` | TypeScript config for Sanity (isolated from Nuxt) |
| `/sanity/schemas/index.ts` | Schema barrel — exports all types |
| `/sanity/schemas/landingPage.ts` | Landing page singleton schema |
| `/sanity/schemas/platformCompany.ts` | Platform company schema |
| `/sanity/schemas/mandate.ts` | Investment mandate schema |
| `/sanity/schemas/pressRelease.ts` | Press release schema |
| `/sanity/schemas/caseStudy.ts` | Case study schema |
| `/sanity/schemas/principal.ts` | Principal bio schema |
| `/sanity/schemas/footnote.ts` | Footnote / legal disclaimer schema |
| `/types/sanity.ts` | TypeScript types for all schemas |
| `/data/seed-content.ts` | Voice-compliant seed content, all six acts |
| `/scripts/voice-audit.ts` | CI voice compliance validator |
| `/docs/voice-registers.md` | Voice register documentation for authors |
| `/docs/handoff-phase-2-content.md` | This file |

---

## What Phase 2 Agents Inherit From This Handoff

### webgl-scene-engineer
- Act copy (act1–act6) available as TypeScript-typed objects in `/data/seed-content.ts`
- No copy dependency — WebGL layer is visual only; copy layers on top via Nuxt components

### ui-component-craftsman
- All six act content objects with typed fields
- `SanityActBlock` type for rendering act content
- OCP governance label: `"AN OBSIDIAN CAPITAL PARTNERS PLATFORM COMPANY"` (hardcoded in schema and seed content)
- No `border-radius`, `box-shadow` on any content component — inherit Phase 1 rules

### mobile-narrative-designer
- Same content structure; mobile variants are display logic only
- Word counts are already tight — mobile copy is same text, not shortened versions
- VISION headlines work at any viewport width by design (8 words max)

---

## Sanity Studio Local Development

```bash
# After installing sanity:
npm install sanity @sanity/vision

# Set environment variables:
export SANITY_PROJECT_ID=your-project-id
export SANITY_DATASET=production

# Start studio:
npx sanity dev
# → http://localhost:3333

# Or from the sanity/ directory:
cd sanity
npx sanity dev
```

---

## Singleton Pattern Note

The `landingPage` schema is a document type with no enforced singleton constraint at the schema level. To prevent editors from creating multiple landing pages, either:

1. Use the Sanity Structure Builder to expose it as a single desk item (recommended for production), or
2. Document the convention: "Only one document of type `landingPage` should exist. It is named 'Landing Page'."

GROQ query uses `[0]` to always fetch the first (and intended only) document.
