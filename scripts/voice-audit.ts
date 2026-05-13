#!/usr/bin/env node
/**
 * voice-audit.ts
 *
 * OCP Voice Compliance Auditor
 *
 * Validates all string content in seed-content.ts against:
 *   1. Forbidden word list (brand section 4.2)
 *   2. Voice register word-count limits
 *
 * Usage:
 *   node --experimental-strip-types scripts/voice-audit.ts
 *   npm run voice-audit
 *
 * Exit codes:
 *   0 — All checks passed. Content is voice-compliant.
 *   1 — One or more violations found. See report above.
 *
 * NOTE: Requires Node 22+ for --experimental-strip-types.
 *       No additional packages needed.
 */

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

// ---------------------------------------------------------------------------
// Forbidden words
// Regex rules:
//   - Word-boundary matching (\b) to avoid false positives in substrings
//   - Case-insensitive where the brand spec intends it (all except "AI")
//   - "AI" uses \bAI\b case-sensitive to avoid flagging "again", "available", etc.
//   - "leverage" blocks all uses (verb/noun indistinct in regex; prefer "deploy capital")
//   - "ecosystem" blocks all uses in seed content (exception: quoting a portfolio company)
// ---------------------------------------------------------------------------

interface ForbiddenEntry {
  label: string
  pattern: RegExp
  note?: string
}

const FORBIDDEN: ForbiddenEntry[] = [
  { label: 'innovative', pattern: /\binnovative\b/i },
  { label: 'innovation', pattern: /\binnovation\b/i, note: 'Implied by "innovative" rule' },
  { label: 'cutting-edge', pattern: /\bcutting[- ]edge\b/i },
  { label: 'synergy', pattern: /\bsynerg(y|ies)\b/i },
  {
    label: 'leverage (verb)',
    pattern: /\bleverage\b/i,
    note: 'All uses blocked. Use "deploy", "apply", or "use" instead.',
  },
  { label: 'utilize', pattern: /\butilize\b/i },
  {
    label: 'ecosystem',
    pattern: /\becosystem\b/i,
    note: 'Exception: quoting a portfolio company. Annotate with //ECOSYSTEM-QUOTE if needed.',
  },
  { label: 'disruptive', pattern: /\bdisruptive\b/i },
  { label: 'disrupt', pattern: /\bdisrupt(s|ing|ed)?\b/i },
  {
    label: 'blockchain',
    pattern: /\bblockchain\b/i,
    note: 'Use "distributed ledger" instead.',
  },
  {
    label: 'crypto',
    pattern: /\bcrypto\b/i,
    note: 'Use "digital asset" if required.',
  },
  {
    label: 'AI (standalone)',
    // Case-sensitive: \bAI\b. Must not match "again", "available", etc.
    // The /i flag is intentionally OMITTED here.
    pattern: /\bAI\b/,
    note: 'Use "machine intelligence" instead.',
  },
  {
    label: 'startup',
    pattern: /\bstartup\b/i,
    note: 'Use "emerging platform" or "founder-led company" instead.',
  },
  {
    label: 'start-up',
    pattern: /\bstart-up\b/i,
    note: 'Use "emerging platform" or "founder-led company" instead.',
  },
  // Additional brand section 4.2 words from agent spec
  { label: 'synergies', pattern: /\bsynergies\b/i },
  { label: 'best-in-class', pattern: /\bbest[- ]in[- ]class\b/i },
  { label: 'world-class', pattern: /\bworld[- ]class\b/i },
  { label: 'passionate', pattern: /\bpassionate\b/i },
  { label: 'excited', pattern: /\bexcited\b/i },
  { label: 'committed to excellence', pattern: /\bcommitted to excellence\b/i },
  { label: 'seasoned', pattern: /\bseasoned\b/i },
  { label: 'proven track record', pattern: /\bproven track record\b/i },
  { label: 'value-creating', pattern: /\bvalue[- ]creating\b/i },
  { label: 'strategic partnership', pattern: /\bstrategic partnership\b/i },
]

// ---------------------------------------------------------------------------
// Violation accumulator
// ---------------------------------------------------------------------------

interface Violation {
  field: string
  value: string
  forbiddenLabel: string
  pattern: string
  matchedText: string
}

const violations: Violation[] = []

function check(field: string, value: unknown): void {
  if (typeof value !== 'string') return
  for (const entry of FORBIDDEN) {
    const match = value.match(entry.pattern)
    if (match) {
      violations.push({
        field,
        value: value.length > 120 ? value.slice(0, 120) + '…' : value,
        forbiddenLabel: entry.label,
        pattern: entry.pattern.toString(),
        matchedText: match[0],
      })
    }
  }
}

// ---------------------------------------------------------------------------
// Word count helpers
// ---------------------------------------------------------------------------

interface WordCountViolation {
  field: string
  words: number
  limit: number
  value: string
}

const wordCountViolations: WordCountViolation[] = []

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length
}

function checkWordCount(field: string, value: unknown, limit: number): void {
  if (typeof value !== 'string') return
  const words = wordCount(value)
  if (words > limit) {
    wordCountViolations.push({
      field,
      words,
      limit,
      value: value.length > 120 ? value.slice(0, 120) + '…' : value,
    })
  }
}

// ---------------------------------------------------------------------------
// Read seed-content.ts as raw text
// For forbidden-word checks: scan the FULL file text (handles all quoting styles
//   including backtick template literals, single quotes, double quotes).
// For word-count checks: extract specific named fields by regex.
// ---------------------------------------------------------------------------

interface ExtractedField {
  path: string
  value: string
}

/**
 * Extract string values assigned to named properties for word-count validation.
 * Handles single-quoted, double-quoted, and backtick template literals.
 * NOT used for forbidden-word scanning (full file scan is used for that).
 */
function extractNamedStringFields(source: string): ExtractedField[] {
  const results: ExtractedField[] = []

  const patterns = [
    // Single-quoted: key: 'value'
    /(\w+):\s*'([^'\\]*(?:\\.[^'\\]*)*)'/g,
    // Double-quoted: key: "value"
    /(\w+):\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g,
    // Backtick template literal (non-nested, no interpolations): key: `value`
    /(\w+):\s*`([^`]+)`/g,
  ]

  for (const pattern of patterns) {
    let m: RegExpExecArray | null
    while ((m = pattern.exec(source)) !== null) {
      const key = m[1]
      // Normalise newlines and collapse whitespace
      const val = m[2].replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim()
      if (val.length > 3) {
        results.push({ path: key, value: val })
      }
    }
  }

  return results
}

/**
 * Strip TypeScript/JavaScript comments and extract the bare content text
 * for forbidden-word scanning. We remove:
 *   - // line comments (which contain intentional uses of forbidden words
 *     in the FORBIDDEN list definition and in inline notes)
 *   - /* block comments
 * This prevents false positives from the comment text that documents the rules.
 */
function stripCommentsForScan(source: string): string {
  // Remove block comments first
  let stripped = source.replace(/\/\*[\s\S]*?\*\//g, ' ')
  // Remove line comments
  stripped = stripped.replace(/\/\/[^\n]*/g, ' ')
  return stripped
}

// ---------------------------------------------------------------------------
// Main audit
// ---------------------------------------------------------------------------

const seedPath = resolve(ROOT, 'data', 'seed-content.ts')
let source: string

try {
  source = readFileSync(seedPath, 'utf-8')
} catch {
  console.error(`[voice-audit] ERROR: Cannot read seed content at ${seedPath}`)
  process.exit(1)
}

// Strip comments so the FORBIDDEN list definitions don't flag themselves
const sourceForScan = stripCommentsForScan(source)
// Extract named fields for word-count validation only
const fields = extractNamedStringFields(source)

console.log(`\n[voice-audit] Obsidian Capital Partners — Voice Compliance Report`)
console.log(`[voice-audit] Source: ${seedPath}`)
console.log(`[voice-audit] Named fields extracted (for word counts): ${fields.length}`)
console.log(`[voice-audit] Forbidden patterns: ${FORBIDDEN.length}`)
console.log(`[voice-audit] Scan strategy: full-file (all quoting styles covered)`)
console.log(`─`.repeat(72))

// Run forbidden word checks against the full comment-stripped source.
// This covers single-quoted, double-quoted, AND backtick template literals.
check(`seed-content (full file scan)`, sourceForScan)

// Run structural word-count checks from known fields in source
// We parse specific named exports from the raw source for word-count validation.

// Extract act1.headline
const headlineAct1Match = source.match(/act1\s*=\s*\{[^}]*headline:\s*['"`]([^'"`]+)['"`]/s)
if (headlineAct1Match) {
  checkWordCount('act1.headline (max 8 words, VISION register)', headlineAct1Match[1], 8)
}

// Extract act2.headline
const headlineAct2Match = source.match(/act2\s*=\s*\{[^}]*headline:\s*['"`]([^'"`]+)['"`]/s)
if (headlineAct2Match) {
  checkWordCount('act2.headline (max 8 words, VISION register)', headlineAct2Match[1], 8)
}

// Extract mandate descriptions
const descMatches = [...source.matchAll(/description:\s*['"`]([^'"`]+)['"`]/g)]
for (let i = 0; i < descMatches.length; i++) {
  checkWordCount(
    `mandate[${i}].description (max 25 words, MANDATE register)`,
    descMatches[i][1],
    25
  )
}

// Extract principal bios
const bioMatches = [...source.matchAll(/bio:\s*['"`]([^'"`]+)['"`]/g)]
for (let i = 0; i < bioMatches.length; i++) {
  checkWordCount(`principal[${i}].bio (max 40 words, MANDATE register)`, bioMatches[i][1], 40)
}

// Extract mandateSummary fields
const summaryMatches = [...source.matchAll(/mandateSummary:\s*['"`]([^'"`]+)['"`]/g)]
for (let i = 0; i < summaryMatches.length; i++) {
  checkWordCount(
    `platform[${i}].mandateSummary (max 40 words, PLATFORM register)`,
    summaryMatches[i][1],
    40
  )
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

let exitCode = 0

if (violations.length > 0) {
  exitCode = 1
  console.log(`\n[voice-audit] FORBIDDEN WORD VIOLATIONS (${violations.length})\n`)
  for (const v of violations) {
    console.log(`  FIELD:    ${v.field}`)
    console.log(`  WORD:     "${v.matchedText}" (rule: ${v.forbiddenLabel})`)
    console.log(`  VALUE:    ${v.value}`)
    console.log(`  ─`)
  }
} else {
  console.log(`\n[voice-audit] Forbidden words: PASS — no violations found.`)
}

if (wordCountViolations.length > 0) {
  exitCode = 1
  console.log(`\n[voice-audit] WORD COUNT VIOLATIONS (${wordCountViolations.length})\n`)
  for (const v of wordCountViolations) {
    console.log(`  FIELD:  ${v.field}`)
    console.log(`  WORDS:  ${v.words} (limit: ${v.limit})`)
    console.log(`  VALUE:  ${v.value}`)
    console.log(`  ─`)
  }
} else {
  console.log(`[voice-audit] Word counts: PASS — all fields within limits.`)
}

console.log(`\n[voice-audit] ${exitCode === 0 ? 'ALL CHECKS PASSED' : 'AUDIT FAILED — see violations above'}`)
console.log(`─`.repeat(72))

process.exit(exitCode)
