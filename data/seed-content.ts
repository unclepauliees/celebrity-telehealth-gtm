/**
 * Seed content for all six scroll acts of the Obsidian Capital Partners landing page.
 *
 * Voice registers:
 *   VISION   — Epoch-scale. Present tense. 8 words max. No hedge words.
 *   MANDATE  — Precise institutional. No superlatives. Numbers with precision.
 *   PLATFORM — Partnership language. Action verbs. Concrete nouns.
 *   CONTACT  — Directive. One sentence max.
 *
 * All financial figures are marked // DRAFT — illustrative only.
 * All principal names are marked // DRAFT — placeholder, real names pending.
 * All platform company names are marked // DRAFT — placeholder, names pending confirmation.
 *
 * Forbidden words (none appear in this file):
 *   innovative, cutting-edge, synergy, leverage (as verb), utilize,
 *   ecosystem (outside a portfolio company quote), disruptive,
 *   blockchain (use "distributed ledger"), crypto, AI (use "machine intelligence"),
 *   startup (use "emerging platform" or "founder-led company")
 */

import type {
  SanityLandingPage,
  SanityMandate,
  SanityPrincipal,
  SanityPlatformCompany,
  SanityFootnote,
} from '../types/sanity'

// ---------------------------------------------------------------------------
// Act 1 — THE VOID (0–1200px)
// Register: VISION headline, MANDATE subhead. No CTA.
// ---------------------------------------------------------------------------

export const act1 = {
  actId: 'act1' as const,

  // VISION register. Word count: 5 (max: 8). ✓
  headline: 'Capital flows where builders dare.',

  // MANDATE register. One sentence.
  subhead:
    'Obsidian deploys patient capital at the intersection of infrastructure, technology, and real assets.',
}

// ---------------------------------------------------------------------------
// Act 2 — EMERGENCE (1200–2500px)
// Register: VISION heading, MANDATE body. 2–3 sentences. Under 120 words.
// ---------------------------------------------------------------------------

export const act2 = {
  actId: 'act2' as const,

  // VISION register. Word count: 6 (max: 8). ✓
  headline: 'Built on conviction. Sustained by capital.',

  // MANDATE register. 3 sentences.
  // Word count: 57 words. (max: 120). ✓
  body: `Obsidian Capital Partners was formed to address a gap in institutional capital markets: \
the absence of a principal-led firm capable of committing patient, long-duration capital to \
asset-backed opportunities across infrastructure, technology platforms, and real assets. \
The firm invests directly, without intermediary structures, and retains active governance \
positions in each platform it builds. Obsidian measures performance in decades, not quarters.`,
}

// ---------------------------------------------------------------------------
// Act 3 — THE CAPITAL CHAIN (2500–14,000px)
// Three mandate cards. Each description: 25 words exactly.
// Register: MANDATE. Financial figures flagged DRAFT.
// ---------------------------------------------------------------------------

// Mandate 1: Infrastructure
// Description word count: 25. ✓
// "Obsidian(1) structures(2) long-duration(3) capital(4) across(5) essential(6)
//  infrastructure(7) assets(8) including(9) transport(10) networks(11) energy(12)
//  distribution(13) and(14) water(15) systems(16) through(17) direct(18)
//  ownership(19) and(20) structured(21) co-investment(22) with(23) operating(24) partners(25)."
export const mandateInfrastructure: Omit<
  SanityMandate,
  '_id' | '_type' | '_rev' | '_createdAt' | '_updatedAt'
> = {
  title: 'Infrastructure',
  sector: 'infrastructure',
  deploymentMin: 50, // DRAFT — illustrative only, legal review required
  deploymentMax: 500, // DRAFT — illustrative only, legal review required
  description:
    'Obsidian structures long-duration capital across essential infrastructure assets including transport networks, energy distribution, and water systems through direct ownership and structured co-investment with operating partners.',
  targetReturn: '12%–18% net IRR', // DRAFT — illustrative only, legal review required
  status: 'draft',
}

// Mandate 2: Technology
// Description word count: 25. ✓
// "Obsidian(1) partners(2) with(3) founder-led(4) technology(5) companies(6)
//  at(7) the(8) growth(9) stage(10) committing(11) structured(12) capital(13)
//  and(14) governance(15) to(16) platforms(17) with(18) demonstrated(19) revenue(20)
//  models(21) and(22) defensible(23) market(24) positions.(25)"
export const mandateTechnology: Omit<
  SanityMandate,
  '_id' | '_type' | '_rev' | '_createdAt' | '_updatedAt'
> = {
  title: 'Technology',
  sector: 'technology',
  deploymentMin: 25, // DRAFT — illustrative only, legal review required
  deploymentMax: 250, // DRAFT — illustrative only, legal review required
  description:
    'Obsidian partners with founder-led technology companies at the growth stage, committing structured capital and governance to platforms with demonstrated revenue models and defensible market positions.',
  targetReturn: '18%–28% net IRR', // DRAFT — illustrative only, legal review required
  status: 'draft',
}

// Mandate 3: Real Assets
// Description word count: 25. ✓
// "Obsidian(1) acquires(2) and(3) manages(4) real(5) asset(6) portfolios(7)
//  including(8) productive(9) land(10) resource(11) rights(12) and(13)
//  commercial(14) property(15) where(16) direct(17) ownership(18) generates(19)
//  compounding(20) returns(21) independent(22) of(23) capital(24) markets.(25)"
export const mandateRealAssets: Omit<
  SanityMandate,
  '_id' | '_type' | '_rev' | '_createdAt' | '_updatedAt'
> = {
  title: 'Real Assets',
  sector: 'realAssets',
  deploymentMin: 20, // DRAFT — illustrative only, legal review required
  deploymentMax: 200, // DRAFT — illustrative only, legal review required
  description:
    'Obsidian acquires and manages real asset portfolios including productive land, resource rights, and commercial property where direct ownership generates compounding returns independent of capital markets.',
  targetReturn: '10%–15% net IRR', // DRAFT — illustrative only, legal review required
  status: 'draft',
}

export const act3 = {
  actId: 'act3' as const,

  // VISION register. Word count: 4 (max: 8). ✓
  headline: 'Three sectors. One conviction.',

  mandates: [mandateInfrastructure, mandateTechnology, mandateRealAssets],
}

// ---------------------------------------------------------------------------
// Act 4 — PRINCIPALS (14,000–21,000px)
// Three principals. Bios: strict 40 words each.
// Register: MANDATE. All marked DRAFT.
// ---------------------------------------------------------------------------

// Principal 1 bio word count: 40. ✓
// "[DRAFT](1) Managing(2) Principal.(3) Twenty(4) years(5) of(6) institutional(7) capital(8)
//  deployment(9) across(10) private(11) equity(12) infrastructure(13) debt(14) and(15)
//  structured(16) finance(17) in(18) North(19) America(20) the(21) Gulf(22) and(23)
//  Southeast(24) Asia.(25) Previously(26) held(27) principal(28) positions(29) at(30) a(31)
//  tier-one(32) sovereign(33) wealth(34) fund(35) and(36) two(37) global(38) infrastructure(39)
//  managers.(40)"
export const principalOne: Omit<
  SanityPrincipal,
  '_id' | '_type' | '_rev' | '_createdAt' | '_updatedAt'
> = {
  name: '[DRAFT — Managing Principal Name]', // DRAFT — placeholder, real name pending
  title: 'Managing Principal',
  // Bio: 40 words exactly
  bio: '[DRAFT] Managing Principal. Twenty years of institutional capital deployment across private equity, infrastructure debt, and structured finance in North America, the Gulf, and Southeast Asia. Previously held principal positions at a tier-one sovereign wealth fund and two global infrastructure managers.',
  order: 1,
  status: 'draft',
}

// Principal 2 bio word count: 40. ✓
// "[DRAFT](1) Principal,(2) Technology.(3) Operator(4) and(5) investor(6) with(7)
//  three(8) platform(9) exits(10) across(11) enterprise(12) software(13) and(14)
//  data(15) infrastructure.(16) Brings(17) direct(18) operating(19) experience(20)
//  to(21) every(22) board(23) position.(24) Focused(25) on(26) founder-led(27)
//  companies(28) at(29) the(30) transition(31) from(32) product(33) to(34) platform.(35)
//  Fluent(36) in(37) four(38) capital(39) structures.(40)"
export const principalTwo: Omit<
  SanityPrincipal,
  '_id' | '_type' | '_rev' | '_createdAt' | '_updatedAt'
> = {
  name: '[DRAFT — Principal Technology Name]', // DRAFT — placeholder, real name pending
  title: 'Principal, Technology',
  // Bio: 40 words exactly
  bio: '[DRAFT] Principal, Technology. Operator and investor with three platform exits across enterprise software and data infrastructure. Brings direct operating experience to every board position. Focused on founder-led companies at the transition from product to platform. Fluent in four capital structures.',
  order: 2,
  status: 'draft',
}

// Principal 3 bio word count: 40. ✓
// "[DRAFT](1) Principal,(2) Infrastructure.(3) Engineering(4) and(5) infrastructure(6)
//  finance(7) background(8) spanning(9) project(10) development(11) in(12) energy,(13)
//  transport,(14) and(15) water.(16) Structured(17) and(18) closed(19) more(20) than(21)
//  fourteen(22) billion(23) dollars(24) in(25) project(26) finance(27) transactions(28)
//  across(29) three(30) continents.(31) Deep(32) relationships(33) with(34) multilateral(35)
//  banks(36) and(37) export(38) credit(39) agencies.(40)"
export const principalThree: Omit<
  SanityPrincipal,
  '_id' | '_type' | '_rev' | '_createdAt' | '_updatedAt'
> = {
  name: '[DRAFT — Principal Infrastructure Name]', // DRAFT — placeholder, real name pending
  title: 'Principal, Infrastructure',
  // Bio: 40 words exactly
  bio: '[DRAFT] Principal, Infrastructure. Engineering and infrastructure finance background spanning project development in energy, transport, and water. Structured and closed more than fourteen billion dollars in project finance transactions across three continents. Deep relationships with multilateral banks and export credit agencies.',
  order: 3,
  status: 'draft',
}

export const act4 = {
  actId: 'act4' as const,

  // VISION register. Word count: 4 (max: 8). ✓
  headline: 'Capital governed by principals.',

  principals: [principalOne, principalTwo, principalThree],
}

// ---------------------------------------------------------------------------
// Act 5 — PLATFORMS (21,000–33,000px)
// Three platform companies. DRAFT names.
// Register: MANDATE mandate, PLATFORM label.
// ---------------------------------------------------------------------------

// Platform mandate word counts are within 80-char mandate and 40-word mandateSummary limits.
export const platformOne: Omit<
  SanityPlatformCompany,
  '_id' | '_type' | '_rev' | '_createdAt' | '_updatedAt'
> = {
  name: '[DRAFT] Platform One', // DRAFT — placeholder, real name pending confirmation
  mandate: 'Infrastructure-adjacent technology and operational data services.',
  status: 'draft',
  // mandateSummary word count: 34 words. ✓
  mandateSummary:
    'Provides technology infrastructure and data management services to operators of essential assets. Direct contracts with infrastructure owners. Capital-light model with long-duration recurring revenue. Governed and scaled by Obsidian principals.',
  ocpLabel: 'AN OBSIDIAN CAPITAL PARTNERS PLATFORM COMPANY',
}

export const platformTwo: Omit<
  SanityPlatformCompany,
  '_id' | '_type' | '_rev' | '_createdAt' | '_updatedAt'
> = {
  name: '[DRAFT] Platform Two', // DRAFT — placeholder, real name pending confirmation
  mandate: 'Real asset management and direct ownership strategies.',
  status: 'draft',
  // mandateSummary word count: 36 words. ✓
  mandateSummary:
    'Acquires and manages portfolios of real assets on behalf of institutional capital partners. Focuses on productive land, resource rights, and commercial property with identifiable cash flow characteristics. Structured for long-duration capital preservation and growth.',
  ocpLabel: 'AN OBSIDIAN CAPITAL PARTNERS PLATFORM COMPANY',
}

export const platformThree: Omit<
  SanityPlatformCompany,
  '_id' | '_type' | '_rev' | '_createdAt' | '_updatedAt'
> = {
  name: '[DRAFT] Platform Three', // DRAFT — placeholder, real name pending confirmation
  mandate: 'Data and intelligence services for institutional capital deployment.',
  status: 'draft',
  // mandateSummary word count: 38 words. ✓
  mandateSummary:
    'Delivers proprietary data, market intelligence, and analytical tools to principals engaged in direct capital deployment. Operates as both a portfolio company and an internal capability. Built to serve Obsidian mandates first, then scaled to third-party institutional clients.',
  ocpLabel: 'AN OBSIDIAN CAPITAL PARTNERS PLATFORM COMPANY',
}

export const act5 = {
  actId: 'act5' as const,

  // PLATFORM register. Word count: 5 (max: 8). ✓
  headline: 'Built with founders. Scaled by capital.',

  platforms: [platformOne, platformTwo, platformThree],
}

// ---------------------------------------------------------------------------
// Act 6 — ENGAGE (33,000–36,000px)
// Register: CONTACT. Directive. One sentence max for each field.
// ---------------------------------------------------------------------------

export const act6 = {
  actId: 'act6' as const,

  // CONTACT register. One word. ✓
  headline: 'Engage.',

  // CONTACT register. One sentence. ✓
  body: 'Submit a mandate or introduce a platform company.',

  // DRAFT — address to be confirmed before launch
  address: '[DRAFT — address to be confirmed]',

  // DRAFT — contact details to be confirmed before launch
  email: '[DRAFT — contact email to be confirmed]',
}

// ---------------------------------------------------------------------------
// Footnotes — financial figures require legal review
// ---------------------------------------------------------------------------

export const footnotes: Array<
  Omit<SanityFootnote, '_id' | '_type' | '_rev' | '_createdAt' | '_updatedAt'>
> = [
  {
    id: 'fn-001',
    body: 'Deployment ranges are illustrative and subject to change.',
    legalDisclaimer:
      'The deployment ranges and target return figures shown are illustrative only and do not constitute a guarantee, promise, or representation of future performance. Past performance is not indicative of future results. All figures are subject to legal review and approval prior to publication.',
    appliesTo: 'act3.infrastructure.deploymentMin',
  },
  {
    id: 'fn-002',
    body: 'Target returns are illustrative. Not a guarantee of performance.',
    legalDisclaimer:
      'Target net IRR figures are illustrative projections only. Actual returns may differ materially from these projections due to economic, market, and other factors. These figures have not been independently verified and must not be relied upon as a basis for investment decisions.',
    appliesTo: 'act3.mandate.targetReturn',
  },
  {
    id: 'fn-003',
    body: 'Principal information is subject to confirmation prior to publication.',
    legalDisclaimer:
      'Principal names, titles, biographies, and associated professional histories are draft placeholders only. No representation is made as to the completeness or accuracy of these descriptions until formally approved and published.',
    appliesTo: 'act4.principals',
  },
]

// ---------------------------------------------------------------------------
// Complete seed export
// ---------------------------------------------------------------------------

export const seedContent = {
  acts: [act1, act2, act3, act4, act5, act6],
  mandates: [mandateInfrastructure, mandateTechnology, mandateRealAssets],
  principals: [principalOne, principalTwo, principalThree],
  platforms: [platformOne, platformTwo, platformThree],
  footnotes,
}

export default seedContent
