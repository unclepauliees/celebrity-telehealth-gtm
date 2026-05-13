# OCP Voice Registers

**Status:** Active — applies to all Obsidian Capital Partners public-facing copy.  
**Enforced by:** `/scripts/voice-audit.ts`  
**Last updated:** 2026-05-12

---

## The Four Registers

Obsidian Capital Partners uses exactly four voice registers. Every piece of copy belongs to one of them. When in doubt, check the surface and its audience.

---

### 1. VISION

**Purpose:** Epoch-scale statements about capital, conviction, and the firm's fundamental premise.

**Where used:**
- Act 1 (THE VOID) headline
- Act 2 (EMERGENCE) heading
- Section-opening statements
- Primary hero copy

**Rules:**
- 8 words maximum. Count every word.
- Present tense only. No past, no conditional.
- No hedge words ("might", "could", "seeks to", "aims to", "aspires").
- No explanatory qualifiers. The statement stands alone.
- Survives without context. Test: would this work on a 4-story billboard with no surrounding copy?

**Word count limit:** 8 words maximum.

**Examples:**

| Status | Copy |
|--------|------|
| ✓ Compliant | "Capital flows where builders dare." |
| ✓ Compliant | "Built on conviction. Sustained by capital." |
| ✓ Compliant | "Capital governed by principals." |
| ✗ Violation | "Obsidian is an innovative firm that aims to deploy capital." |
| ✗ Violation | "We are committed to creating synergies across our ecosystem." |
| ✗ Violation | "Leveraging cutting-edge technology to disrupt capital markets." |

---

### 2. MANDATE

**Purpose:** Precise institutional description of what Obsidian does, where it deploys, and how it operates.

**Where used:**
- Act 1 (THE VOID) subhead
- Act 2 (EMERGENCE) body
- Act 3 (THE CAPITAL CHAIN) card descriptions
- Act 4 (PRINCIPALS) bios
- All mandate schema descriptions
- Principal bios

**Rules:**
- No superlatives ("best", "top", "premier", "leading", "world-class").
- Numbers stated with precision. Use "$50M–$500M" not "significant capital".
- No enthusiasm. No exclamation marks.
- No passive constructions where active is available.
- Body copy: 120 words maximum per act.
- Mandate descriptions: 25 words maximum.
- Principal bios: 40 words maximum — this limit is strict.

**Word count limits:** Body 120 words per act, mandate descriptions 25 words, principal bios 40 words.

**Examples:**

| Status | Copy |
|--------|------|
| ✓ Compliant | "Obsidian deploys patient capital at the intersection of infrastructure, technology, and real assets." |
| ✓ Compliant | "Structured and closed more than fourteen billion dollars in project finance transactions across three continents." |
| ✓ Compliant | "Operator and investor with three platform exits across enterprise software and data infrastructure." |
| ✗ Violation | "Our passionate team is excited to leverage synergies across our best-in-class ecosystem." |
| ✗ Violation | "We utilize world-class AI to identify disruptive startup opportunities." |
| ✗ Violation | "Proven track record of value-creating strategic partnerships." |

---

### 3. PLATFORM

**Purpose:** Partnership language describing the relationship between Obsidian and its platform companies.

**Where used:**
- Act 5 (PLATFORMS) company entries
- Platform company mandate summaries
- The OCP governance label on all platform companies

**Rules:**
- Action verbs, concrete nouns. No abstract nouns ("synergies", "ecosystem").
- Every platform company entry must carry the governance label: **"AN OBSIDIAN CAPITAL PARTNERS PLATFORM COMPANY"**
- Do not abbreviate to "OCP" in any public-facing content.
- Mandate summaries: 40 words maximum.
- One-line mandate: 80 characters maximum.
- Present tense. Companies are active, not historical.

**Word count limits:** Mandate summary 40 words, mandate 80 characters.

**Examples:**

| Status | Copy |
|--------|------|
| ✓ Compliant | "Built with founders. Scaled by capital." |
| ✓ Compliant | "Provides technology infrastructure and data management services to operators of essential assets." |
| ✓ Compliant | "Acquires and manages portfolios of real assets on behalf of institutional capital partners." |
| ✗ Violation | "An innovative startup leveraging blockchain to disrupt the ecosystem." |
| ✗ Violation | "OCP's cutting-edge platform company." |

---

### 4. CONTACT

**Purpose:** Direct, imperative instruction to the reader.

**Where used:**
- Act 6 (ENGAGE) headline and body
- Navigation contact links
- Mandate submission calls to action

**Rules:**
- One sentence maximum. Often one word.
- Imperative mood: "Submit." "Engage." "Introduce."
- No pleasantries ("We'd love to hear from you.").
- No hedging ("If you'd like to..." "Feel free to...").
- No superlatives.

**Word count limits:** One sentence maximum.

**Examples:**

| Status | Copy |
|--------|------|
| ✓ Compliant | "Engage." |
| ✓ Compliant | "Submit a mandate or introduce a platform company." |
| ✓ Compliant | "Submit a mandate." |
| ✗ Violation | "We're excited to connect with innovative startups and passionate founders who want to leverage our cutting-edge platform." |
| ✗ Violation | "Feel free to reach out if you'd like to explore potential synergies." |

---

## Forbidden Words

The following words are blocked in all OCP copy. `voice-audit.ts` exits with code 1 if any appear.

| Word / Phrase | Why Forbidden | Preferred Alternative |
|---|---|---|
| `innovative` | Generic. Tells nothing. | Describe the specific mechanism. |
| `innovation` | Same as above. | Describe the outcome. |
| `cutting-edge` | Empty modifier. | Name the actual technology. |
| `synergy` / `synergies` | Meaningless without context. | Describe the actual relationship. |
| `leverage` (verb) | Overused; vague. | "deploy", "apply", "use" |
| `utilize` | Unnecessary formality. | "use" |
| `ecosystem` | Vague, over-used in tech marketing. | Name the actual network or market. Exception: quoting a portfolio company directly. |
| `disruptive` / `disrupt` | Claims impact without evidence. | Describe what changes and why. |
| `blockchain` | Avoid jargon. | "distributed ledger" if essential. |
| `crypto` | Too broad; often inaccurate. | "digital asset" if specific. |
| `AI` (standalone) | Overloaded, imprecise. | "machine intelligence" |
| `startup` | Implies informality. | "emerging platform" or "founder-led company" |
| `start-up` | Same as above. | Same alternatives. |
| `best-in-class` | Empty superlative. | Use a measurable claim. |
| `world-class` | Empty superlative. | Use a measurable claim. |
| `passionate` | Implies enthusiasm over judgment. | Remove or describe the work instead. |
| `excited` | Same. | Remove. |
| `committed to excellence` | PR cliché. | Describe a specific standard. |
| `seasoned` | Vague; often condescending. | State years and roles directly. |
| `proven track record` | Cliché. | State the actual track record. |
| `value-creating` | Circular. All investment is meant to create value. | State the specific return mechanism. |
| `strategic partnership` | Overused; meaningless without detail. | Describe the actual arrangement. |

---

## Author Checklist

Before submitting any copy for review, verify:

- [ ] I know which register this copy belongs to.
- [ ] I have counted every word and am within the register's limit.
- [ ] I have searched for all forbidden words from the table above.
- [ ] No number appears without units ("$50M", "14 transactions", "20 years").
- [ ] All financial figures carry a `// DRAFT` flag until legal review.
- [ ] All principal names carry a `// DRAFT` flag until confirmed by the principal.
- [ ] No abbreviation "OCP" appears in public-facing copy.
- [ ] Every platform company entry carries the full governance label.
- [ ] I have run `npm run voice-audit` and it exits 0.

---

## voice-audit.ts Validation Rules

The script at `/scripts/voice-audit.ts` enforces:

1. **Forbidden word scan** — regex match against all 22 patterns, word-boundary matched.
2. **Word count checks:**
   - `act1.headline` — VISION register — max 8 words
   - `act2.headline` — VISION register — max 8 words
   - `mandate[n].description` — MANDATE register — max 25 words
   - `principal[n].bio` — MANDATE register — max 40 words
   - `platform[n].mandateSummary` — PLATFORM register — max 40 words
3. **Exit code 1** if any violation is found; exit code 0 if all checks pass.

To run:
```bash
npm run voice-audit
# or directly:
node --experimental-strip-types scripts/voice-audit.ts
```

Requires Node 22+. No additional packages needed.

---

## Tone Notes

These are not rules but calibration guides:

- **Confident, not arrogant.** State facts about the firm. Do not compare the firm to others.
- **Patient, not slow.** Patience is a strategy. It implies long-duration thinking. Do not write anything that sounds like delay or indecision.
- **Precise, not cold.** Numbers and facts are preferred over adjectives. But precise copy is not clinical copy — it can carry weight and texture.
- **Never enthusiastic.** Enthusiasm signals uncertainty. Capital moves without exclamation marks.
- **Never casual.** No contractions in formal contexts ("We're", "It's"). No informal register in mandate or principal copy.
