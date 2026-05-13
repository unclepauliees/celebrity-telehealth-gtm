<script setup lang="ts">
/**
 * ActLabel
 *
 * Section label for each scroll act.
 * Desktop: fixed left edge, vertical text (writing-mode: vertical-rl, rotated 180°)
 * Mobile: horizontal, top-center, sticky within the act section
 *
 * Visibility is controlled by a scroll range (scrollStart / scrollEnd).
 * Font: Space Mono, 11px (--text-caption), gold at 50% opacity.
 * No border-radius. No box-shadow.
 */

const props = defineProps<{
  number: string     // '01' through '06'
  title: string      // 'THE VOID', 'EMERGENCE', etc.
  scrollStart: number  // scrollY at which the label becomes visible
  scrollEnd: number    // scrollY at which the label fades out
}>()

const reducedMotion = useReducedMotion()
const opacity = ref(0)
let rafId = 0

onMounted(() => {
  const tick = () => {
    const y = window.scrollY
    // Exclusive upper bound prevents two adjacent act labels from showing
    // simultaneously at the exact boundary scroll position.
    // The CSS .act-label--reduced-motion class (transition: none) handles
    // the instant-state difference — no JS conditional needed here.
    opacity.value = (y >= props.scrollStart && y < props.scrollEnd) ? 1 : 0
    rafId = requestAnimationFrame(tick)
  }
  rafId = requestAnimationFrame(tick)
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
})
</script>

<template>
  <div
    class="act-label"
    :class="{ 'act-label--reduced-motion': reducedMotion }"
    :style="{ opacity }"
    aria-hidden="true"
  >
    <span class="act-label__number">{{ number }}</span>
    <span class="act-label__sep" aria-hidden="true"> — </span>
    <span class="act-label__title">{{ title }}</span>
  </div>
</template>

<style scoped>
/*
 * ActLabel is rendered outside the scroll-narrative sections (it's a sibling,
 * not a child, so 'position: sticky' cannot be constrained to a single act).
 * We use 'position: fixed' at all breakpoints — opacity is JS-controlled
 * per scroll range so only the active act's label is visible.
 *
 * Mobile-first base: fixed, horizontal, centered below nav.
 */
.act-label {
  position: fixed;
  top: var(--nav-height);
  left: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  width: 100%;
  padding: var(--space-1) var(--space-3);
  writing-mode: horizontal-tb;
  pointer-events: none;
  /* Transition only applies when reduced-motion is NOT set */
  transition: opacity var(--duration-standard) var(--ease-ocp);
  /* No border-radius. No box-shadow. */
}

/* Instant state change when reduced motion is preferred */
.act-label--reduced-motion {
  transition: none;
}

.act-label__number,
.act-label__sep,
.act-label__title {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  letter-spacing: var(--tracking-caption);
  text-transform: uppercase;
  color: var(--color-gold);
  opacity: 0.5;
  line-height: var(--lh-caption);
}

/* ---- Desktop (≥ 768px): fixed left edge, vertical text ---- */
@media (min-width: 768px) {
  .act-label {
    left: var(--space-3);
    top: 50%;
    width: auto;
    padding: 0;
    justify-content: flex-start;
    /* Vertical text — rotated so text reads bottom-to-top */
    writing-mode: vertical-rl;
    transform: translateY(-50%) rotate(180deg);
  }
}
</style>
