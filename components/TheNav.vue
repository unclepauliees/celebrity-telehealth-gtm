<script setup lang="ts">
/**
 * TheNav
 *
 * Persistent fixed navigation. Present across all six scroll acts.
 *
 * Behavior:
 *   - Fixed position, top:0, left:0, right:0, z-index:1000
 *   - Contains TheWordmark (top-left, 24px from edges)
 *   - Contains NavMenuPill (top-right, 24px from edges)
 *   - Background: transparent at rest
 *   - Scrolled state (scrollY > 80px): #0A0A0A at 96% opacity +
 *     backdrop-filter: blur(12px) + border-bottom: var(--border-rule)
 *   - Logo color adapts via useSectionTheme (provide/inject + IntersectionObserver)
 *     NOT mix-blend-mode (brand forbids effects on wordmark)
 *   - No border-radius. No box-shadow.
 */

import { type SectionTheme } from '~/composables/useSectionTheme'

const menuOpen = ref(false)
// Component instance ref — we use $el to get the underlying DOM button
const pillRef = ref<InstanceType<typeof NavMenuPill> | null>(null)

const isScrolled = useScrolled()
const { theme } = useSectionTheme()

// Map section theme → wordmark color prop
// theme 'dark'  = section has dark background  → wordmark should be 'light' (Parchment)
// theme 'light' = section has light background → wordmark should be 'dark' (Obsidian Black)
// theme 'gold'  = section has steel background → wordmark stays 'gold'
const wordmarkColor = computed(() => {
  if (theme.value === 'dark') return 'light' as const
  if (theme.value === 'light') return 'dark' as const
  return 'gold' as const
})

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const closeMenu = () => {
  menuOpen.value = false
}
</script>

<template>
  <header
    class="the-nav"
    :class="{ 'the-nav--scrolled': isScrolled }"
    role="banner"
  >
    <a href="/" class="the-nav__logo" aria-label="Obsidian Capital Partners — Home">
      <TheWordmark :color="wordmarkColor" />
    </a>

    <NavMenuPill
      ref="pillRef"
      :is-open="menuOpen"
      @toggle="toggleMenu"
    />

    <NavOverlay
      :is-open="menuOpen"
      :trigger-focus="() => pillRef?.focus()"
      @close="closeMenu"
    />
  </header>
</template>

<style scoped>
.the-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: var(--nav-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-3);
  background: transparent;
  border-bottom: 1px solid transparent;
  transition:
    background var(--duration-standard) var(--ease-ocp),
    border-color var(--duration-standard) var(--ease-ocp);
}

/* Scrolled state: dark background with blur */
.the-nav--scrolled {
  background: var(--surface-nav-scrolled);
  border-bottom-color: var(--color-rule-dark);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Logo — top-left, 24px from left edge */
.the-nav__logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  /* min-width enforced by TheWordmark component */
}

/* Focus visible on logo */
.the-nav__logo:focus-visible {
  outline: var(--focus-ring);
  outline-offset: var(--focus-ring-offset);
}

/* ---- Responsive additions (Phase 3) ---- */

/* Mobile: reduce nav height to 64px (token override lives in tokens.css).
   Padding reduced to --space-2 for narrower viewport. */
@media (max-width: 767px) {
  .the-nav {
    height: var(--nav-height); /* reads 64px from tokens.css mobile override */
    padding: 0 var(--space-2);
  }
}
</style>
