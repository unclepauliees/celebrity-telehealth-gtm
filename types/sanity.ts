/**
 * TypeScript types matching all Sanity schema shapes.
 * These are manually authored to avoid a build-time dependency on sanity-codegen.
 * Re-generate if schemas change.
 *
 * Sanity internal fields (_id, _type, _rev, _createdAt, _updatedAt) are included
 * on document-level types and omitted on embedded object types.
 */

// ---------------------------------------------------------------------------
// Sanity Portable Text (minimal — expand as needed)
// ---------------------------------------------------------------------------

export interface SanitySpan {
  _key: string
  _type: 'span'
  marks: string[]
  text: string
}

export interface SanityBlock {
  _key: string
  _type: 'block'
  style: string
  children: SanitySpan[]
  markDefs: unknown[]
}

export type PortableTextBlock = SanityBlock

// ---------------------------------------------------------------------------
// Sanity Image
// ---------------------------------------------------------------------------

export interface SanityImageCrop {
  top: number
  bottom: number
  left: number
  right: number
}

export interface SanityImageHotspot {
  x: number
  y: number
  height: number
  width: number
}

export interface SanityImageAsset {
  _id: string
  _type: 'sanity.imageAsset'
  url: string
  mimeType: string
  metadata: {
    dimensions: {
      width: number
      height: number
      aspectRatio: number
    }
    lqip?: string
  }
}

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  crop?: SanityImageCrop
  hotspot?: SanityImageHotspot
}

// ---------------------------------------------------------------------------
// Sanity Reference
// ---------------------------------------------------------------------------

export interface SanityReference<T = unknown> {
  _ref: string
  _type: 'reference'
  /** Resolved document — only present after GROQ join */
  _resolvedData?: T
}

// ---------------------------------------------------------------------------
// Act IDs
// ---------------------------------------------------------------------------

export type ActId = 'act1' | 'act2' | 'act3' | 'act4' | 'act5' | 'act6'

// ---------------------------------------------------------------------------
// Landing Page
// ---------------------------------------------------------------------------

export interface SanityActBlock {
  _key: string
  _type: 'actBlock'
  actId: ActId
  headline?: string
  subhead?: string
  body?: PortableTextBlock[]
}

export interface SanityLandingPage {
  _id: string
  _type: 'landingPage'
  _rev: string
  _createdAt: string
  _updatedAt: string
  title: string
  acts: SanityActBlock[]
}

// ---------------------------------------------------------------------------
// Platform Company
// ---------------------------------------------------------------------------

export type ContentStatus = 'draft' | 'live'

export interface SanityPlatformCompany {
  _id: string
  _type: 'platformCompany'
  _rev: string
  _createdAt: string
  _updatedAt: string
  name: string
  mandate: string
  logoMark?: SanityImage
  status: ContentStatus
  mandateSummary?: string
  ocpLabel: 'AN OBSIDIAN CAPITAL PARTNERS PLATFORM COMPANY'
}

// ---------------------------------------------------------------------------
// Mandate
// ---------------------------------------------------------------------------

export type MandateSector = 'infrastructure' | 'technology' | 'realAssets'

export interface SanityMandate {
  _id: string
  _type: 'mandate'
  _rev: string
  _createdAt: string
  _updatedAt: string
  title: string
  sector: MandateSector
  deploymentMin?: number
  deploymentMax?: number
  description?: string
  targetReturn?: string
  status: ContentStatus
}

// ---------------------------------------------------------------------------
// Press Release
// ---------------------------------------------------------------------------

export interface SanityPressRelease {
  _id: string
  _type: 'pressRelease'
  _rev: string
  _createdAt: string
  _updatedAt: string
  headline: string
  date: string
  source?: string
  url?: string
  excerpt?: string
}

// ---------------------------------------------------------------------------
// Case Study
// ---------------------------------------------------------------------------

export interface SanityCaseStudy {
  _id: string
  _type: 'caseStudy'
  _rev: string
  _createdAt: string
  _updatedAt: string
  title: string
  platformCompany?: SanityReference<SanityPlatformCompany>
  body?: PortableTextBlock[]
  publishedAt?: string
  featured: boolean
}

// ---------------------------------------------------------------------------
// Principal
// ---------------------------------------------------------------------------

export interface SanityPrincipal {
  _id: string
  _type: 'principal'
  _rev: string
  _createdAt: string
  _updatedAt: string
  name: string
  title: string
  bio: string
  photo?: SanityImage
  order?: number
  status: ContentStatus
}

// ---------------------------------------------------------------------------
// Footnote
// ---------------------------------------------------------------------------

export interface SanityFootnote {
  _id: string
  _type: 'footnote'
  _rev: string
  _createdAt: string
  _updatedAt: string
  id: string
  body: string
  legalDisclaimer?: string
  appliesTo?: string
}

// ---------------------------------------------------------------------------
// Type guards
// ---------------------------------------------------------------------------

export function isSanityLandingPage(doc: unknown): doc is SanityLandingPage {
  return (
    typeof doc === 'object' &&
    doc !== null &&
    (doc as Record<string, unknown>)['_type'] === 'landingPage'
  )
}

export function isSanityPlatformCompany(doc: unknown): doc is SanityPlatformCompany {
  return (
    typeof doc === 'object' &&
    doc !== null &&
    (doc as Record<string, unknown>)['_type'] === 'platformCompany'
  )
}

export function isSanityMandate(doc: unknown): doc is SanityMandate {
  return (
    typeof doc === 'object' &&
    doc !== null &&
    (doc as Record<string, unknown>)['_type'] === 'mandate'
  )
}

export function isSanityPressRelease(doc: unknown): doc is SanityPressRelease {
  return (
    typeof doc === 'object' &&
    doc !== null &&
    (doc as Record<string, unknown>)['_type'] === 'pressRelease'
  )
}

export function isSanityCaseStudy(doc: unknown): doc is SanityCaseStudy {
  return (
    typeof doc === 'object' &&
    doc !== null &&
    (doc as Record<string, unknown>)['_type'] === 'caseStudy'
  )
}

export function isSanityPrincipal(doc: unknown): doc is SanityPrincipal {
  return (
    typeof doc === 'object' &&
    doc !== null &&
    (doc as Record<string, unknown>)['_type'] === 'principal'
  )
}

export function isSanityFootnote(doc: unknown): doc is SanityFootnote {
  return (
    typeof doc === 'object' &&
    doc !== null &&
    (doc as Record<string, unknown>)['_type'] === 'footnote'
  )
}
