/**
 * useScrolled
 *
 * Returns a reactive boolean: true when scrollY > nav-height (80px).
 * Used by TheNav to trigger the scroll-state background change:
 *   - At rest:   transparent background
 *   - Scrolled:  #0A0A0A at 96% opacity + backdrop-filter + border-bottom
 *
 * SSR-safe: defaults to false on the server.
 * Uses a passive scroll listener for performance.
 */
export const useScrolled = (): Ref<boolean> => {
  // --nav-height is 80px per tokens.css
  const NAV_HEIGHT_PX = 80

  const isScrolled = ref(false)

  if (import.meta.client) {
    const onScroll = () => {
      isScrolled.value = window.scrollY > NAV_HEIGHT_PX
    }

    // Set initial state (e.g. if page loads mid-scroll after back-navigation)
    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })

    onUnmounted(() => {
      window.removeEventListener('scroll', onScroll)
    })
  }

  return isScrolled
}
