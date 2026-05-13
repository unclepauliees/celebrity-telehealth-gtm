<script setup lang="ts">
/**
 * MobileScrollHint
 *
 * First-time scroll prompt shown over Act 1 on mobile only.
 * Shows "SCROLL" + IconChevronDown.
 * Fades out after the user scrolls past 200px.
 *
 * Only renders on mobile (< 768px) — useViewportBreakpoint guard.
 * Position: fixed, bottom 48px (--space-6), horizontally centered.
 * Color: --color-gold at 60% opacity.
 * Font: Space Mono, 10px (--text-label), --tracking-label.
 * No border-radius. No box-shadow.
 */

const breakpoint = useViewportBreakpoint()
const isMobile = computed(() => breakpoint.value === 'mobile')

const visible = ref(true)
const opacity = ref(1)

let rafId = 0

onMounted(() => {
  const tick = () => {
    if (window.scrollY > 200) {
      opacity.value = 0
      // Once faded out, stop the loop — won't come back
      if (opacity.value === 0) return
    } else {
      opacity.value = 1
    }
    rafId = requestAnimationFrame(tick)
  }
  rafId = requestAnimationFrame(tick)
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
})
</script>

<template>
  <!-- Only render on mobile breakpoint -->
  <Transition name="scroll-hint-fade">
    <div
      v-if="isMobile && visible"
      class="mobile-scroll-hint"
      :style="{ opacity }"
      aria-hidden="true"
    >
      <span class="mobile-scroll-hint__label">SCROLL</span>
      <IconChevronDown :size="16" class="mobile-scroll-hint__icon" />
    </div>
  </Transition>
</template>

<style scoped>
.mobile-scroll-hint {
  position: fixed;
  bottom: var(--space-6);
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  color: var(--color-gold);
  opacity: 0.6;
  pointer-events: none;
  /* No border-radius. No box-shadow. */
  /* Opacity transition for the fade-out as user scrolls */
  transition: opacity var(--duration-standard) var(--ease-ocp);
}

.mobile-scroll-hint__label {
  font-family: var(--font-mono);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  line-height: 1;
}

.mobile-scroll-hint__icon {
  display: block;
}

/* Vue Transition fallback */
.scroll-hint-fade-enter-active,
.scroll-hint-fade-leave-active {
  transition: opacity var(--duration-standard) var(--ease-ocp);
}
.scroll-hint-fade-enter-from,
.scroll-hint-fade-leave-to {
  opacity: 0;
}
</style>
