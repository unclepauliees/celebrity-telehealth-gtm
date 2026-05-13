/**
 * useScrollHeight
 *
 * Returns the correct total scroll narrative height based on the current
 * viewport breakpoint. Used by pages/index.vue to set the scroll container
 * height and by normalizeScrollY() in useScrollScene for camera mapping.
 *
 * Breakpoint → height:
 *   mobile  (<768px)  → 24,000px
 *   tablet  (768–1023px) → 30,000px
 *   desktop / wide (≥1024px) → 36,000px
 *
 * Act height distributions:
 *
 *   Mobile (24,000px):
 *     Act 1:  800px
 *     Act 2: 1,600px
 *     Act 3: 7,600px
 *     Act 4: 4,800px
 *     Act 5: 6,200px
 *     Act 6: 3,000px
 *
 *   Tablet (30,000px):
 *     Act 1:  1,000px
 *     Act 2:  2,000px
 *     Act 3:  9,500px
 *     Act 4:  5,500px
 *     Act 5:  8,000px
 *     Act 6:  4,000px
 *
 *   Desktop (36,000px):
 *     Act 1:  1,200px
 *     Act 2:  1,300px
 *     Act 3: 11,500px
 *     Act 4:  7,000px
 *     Act 5: 12,000px
 *     Act 6:  3,000px
 */

import { useViewportBreakpoint } from './useViewportBreakpoint'

export const SCROLL_HEIGHT_DESKTOP = 36000
export const SCROLL_HEIGHT_TABLET  = 30000
export const SCROLL_HEIGHT_MOBILE  = 24000

export const useScrollHeight = (): Ref<number> => {
  const breakpoint = useViewportBreakpoint()

  return computed<number>(() => {
    if (breakpoint.value === 'mobile')  return SCROLL_HEIGHT_MOBILE
    if (breakpoint.value === 'tablet')  return SCROLL_HEIGHT_TABLET
    return SCROLL_HEIGHT_DESKTOP
  })
}

/**
 * Act height maps keyed by breakpoint.
 * Exported so index.vue can set per-section heights reactively.
 */
export interface ActHeights {
  act1: number
  act2: number
  act3: number
  act4: number
  act5: number
  act6: number
}

export const ACT_HEIGHTS: Record<'mobile' | 'tablet' | 'desktop', ActHeights> = {
  mobile: {
    act1:  800,
    act2: 1600,
    act3: 7600,
    act4: 4800,
    act5: 6200,
    act6: 3000,
  },
  tablet: {
    act1:  1000,
    act2:  2000,
    act3:  9500,
    act4:  5500,
    act5:  8000,
    act6:  4000,
  },
  desktop: {
    act1:  1200,
    act2:  1300,
    act3: 11500,
    act4:  7000,
    act5: 12000,
    act6:  3000,
  },
}

/**
 * useActHeights
 *
 * Returns a reactive map of per-act pixel heights for the current breakpoint.
 * 'wide' is treated identically to 'desktop'.
 */
export const useActHeights = (): Ref<ActHeights> => {
  const breakpoint = useViewportBreakpoint()

  return computed<ActHeights>(() => {
    const key = breakpoint.value === 'wide' ? 'desktop' : breakpoint.value
    return ACT_HEIGHTS[key]
  })
}
