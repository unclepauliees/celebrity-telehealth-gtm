/**
 * useReducedMotion
 *
 * Returns a reactive boolean that is true when the user has requested
 * reduced motion via the OS accessibility setting.
 *
 * SSR-safe: defaults to false on the server (no window), then updates
 * reactively on the client via a MediaQueryList listener.
 *
 * Usage in components:
 *   const reducedMotion = useReducedMotion()
 *   if (reducedMotion.value) { // skip 3D animation }
 *
 * All GSAP tweens and Three.js animations read from this before starting.
 */
export const useReducedMotion = (): Ref<boolean> => {
  // SSR-safe: ref defaults to false. On the server there is no window.
  const reducedMotion = ref(false)

  // Only run on the client
  if (import.meta.client) {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')

    // Set initial value from current media query state
    reducedMotion.value = query.matches

    // Update reactively when the user changes their OS setting
    const handler = (event: MediaQueryListEvent) => {
      reducedMotion.value = event.matches
    }

    query.addEventListener('change', handler)

    // Clean up listener when composable is unmounted
    onUnmounted(() => {
      query.removeEventListener('change', handler)
    })
  }

  return reducedMotion
}
