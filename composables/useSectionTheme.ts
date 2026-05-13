/**
 * useSectionTheme
 *
 * Provide/inject pattern for section-aware nav color adaptation.
 *
 * ARCHITECTURE:
 * - Each scroll section (dark/light/gold) calls `provideSectionTheme()` and
 *   registers its background context via an IntersectionObserver.
 * - TheNav reads `useSectionTheme()` to get the current active theme and
 *   adapts the wordmark color accordingly.
 * - Uses IntersectionObserver (not scroll events) for performance.
 *
 * USAGE — in a scroll section component:
 *   const { registerSection } = provideSectionTheme()
 *   const sectionRef = ref<HTMLElement | null>(null)
 *   registerSection(sectionRef, 'light')
 *
 * USAGE — in TheNav:
 *   const { theme } = useSectionTheme()
 *   // theme.value: 'dark' | 'light' | 'gold'
 *
 * WORDMARK COLORS:
 *   'dark'  → Parchment wordmark on dark background (default)
 *   'light' → Obsidian Black wordmark on light background
 *   'gold'  → Gold wordmark (used sparingly, only on steel bg)
 */

export type SectionTheme = 'dark' | 'light' | 'gold'

// Symbol key for the provide/inject pair
const SECTION_THEME_KEY = Symbol('sectionTheme')

interface SectionThemeContext {
  theme: Ref<SectionTheme>
  registerSection: (el: Ref<HTMLElement | null>, theme: SectionTheme) => void
}

/**
 * Called once in the layout shell (default.vue) to establish the context.
 * Returns the reactive theme value for TheNav to read.
 */
export const provideSectionTheme = (): SectionThemeContext => {
  const activeTheme = ref<SectionTheme>('dark')
  const observers: IntersectionObserver[] = []

  const registerSection = (
    elRef: Ref<HTMLElement | null>,
    sectionTheme: SectionTheme,
  ) => {
    if (!import.meta.client) return

    // Watch for the element to mount, then set up the observer
    watchEffect(() => {
      const el = elRef.value
      if (!el) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // When this section crosses the top portion of the viewport
            // (where the nav lives), update the active theme
            if (entry.isIntersecting) {
              activeTheme.value = sectionTheme
            }
          })
        },
        {
          // Threshold: trigger when the section enters the top 20% of viewport
          // This corresponds to where the nav bar sits
          rootMargin: '-0px 0px -80% 0px',
          threshold: 0,
        },
      )

      observer.observe(el)
      observers.push(observer)

      onUnmounted(() => {
        observer.unobserve(el)
        observer.disconnect()
      })
    })
  }

  const context: SectionThemeContext = {
    theme: activeTheme,
    registerSection,
  }

  provide(SECTION_THEME_KEY, context)

  return context
}

/**
 * Called by TheNav (and any other component that needs the current theme).
 * Must be used inside a component that is a descendant of a component
 * that called provideSectionTheme().
 */
export const useSectionTheme = (): SectionThemeContext => {
  const context = inject<SectionThemeContext>(SECTION_THEME_KEY)

  if (!context) {
    // Fallback for components used outside the theme provider (e.g. storybook)
    return {
      theme: ref('dark') as Ref<SectionTheme>,
      registerSection: () => {},
    }
  }

  return context
}
