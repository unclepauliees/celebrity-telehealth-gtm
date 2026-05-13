/**
 * useViewportBreakpoint
 *
 * Returns a reactive breakpoint label based on viewport width.
 * SSR-safe: defaults to 'desktop' on server (no window available).
 * Uses matchMedia listeners for reactivity — no polling.
 *
 * Breakpoints:
 *   mobile  → width < 768px      (--bp-mobile baseline: 375px)
 *   tablet  → 768px ≤ width < 1024px
 *   desktop → 1024px ≤ width < 1440px
 *   wide    → width ≥ 1440px
 */

export type BreakpointLabel = 'mobile' | 'tablet' | 'desktop' | 'wide'

export const useViewportBreakpoint = (): Ref<BreakpointLabel> => {
  // SSR-safe default: 'desktop' on server
  const breakpoint = ref<BreakpointLabel>('desktop')

  if (!import.meta.client) {
    return breakpoint
  }

  // --- media queries (min-width, mobile-first) ---
  const mqlWide    = window.matchMedia('(min-width: 1440px)')
  const mqlDesktop = window.matchMedia('(min-width: 1024px)')
  const mqlTablet  = window.matchMedia('(min-width: 768px)')

  function resolve(): BreakpointLabel {
    if (mqlWide.matches)    return 'wide'
    if (mqlDesktop.matches) return 'desktop'
    if (mqlTablet.matches)  return 'tablet'
    return 'mobile'
  }

  // Set initial value synchronously
  breakpoint.value = resolve()

  // Re-evaluate on any boundary crossing
  const update = () => { breakpoint.value = resolve() }

  mqlWide.addEventListener('change', update)
  mqlDesktop.addEventListener('change', update)
  mqlTablet.addEventListener('change', update)

  onUnmounted(() => {
    mqlWide.removeEventListener('change', update)
    mqlDesktop.removeEventListener('change', update)
    mqlTablet.removeEventListener('change', update)
  })

  return breakpoint
}
