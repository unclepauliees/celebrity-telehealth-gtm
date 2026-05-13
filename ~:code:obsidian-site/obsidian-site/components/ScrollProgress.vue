<script setup lang="ts">
/**
 * ScrollProgress
 *
 * A 1px vertical line on the right edge of the viewport showing scroll progress.
 * The track is --color-rule-dark (full height).
 * The fill is --color-gold, growing from the top as the user scrolls.
 *
 * Width: 1px — qualitatively equivalent to a CSS border/rule.
 * Approved as DEV-005: a 1px rule is not "gold as background" in the brand sense
 * (brand concern is large gold fill areas); this is structurally a progress rule.
 *
 * Hidden on mobile (< 768px) — viewport too narrow to be useful.
 * No animation on updates — direct DOM manipulation via rAF for performance.
 * When useReducedMotion() is true, updates via scroll event directly (no rAF).
 *
 * No border-radius. No box-shadow.
 */

const reducedMotion = useReducedMotion()

// Ref to the gold fill element for direct DOM update
const fillEl = ref<HTMLElement | null>(null)
let rafId = 0
let rafScheduled = false

function updateFill() {
  if (!fillEl.value) return
  const maxScroll = Math.max(
    document.documentElement.scrollHeight - window.innerHeight,
    1,
  )
  const progress = Math.min(window.scrollY / maxScroll, 1)
  fillEl.value.style.height = `${progress * 100}%`
}

function onScrollRaf() {
  if (!rafScheduled) {
    rafScheduled = true
    rafId = requestAnimationFrame(() => {
      rafScheduled = false
      updateFill()
    })
  }
}

function onScrollDirect() {
  updateFill()
}

onMounted(() => {
  // Set initial state
  updateFill()

  if (reducedMotion.value) {
    window.addEventListener('scroll', onScrollDirect, { passive: true })
  } else {
    window.addEventListener('scroll', onScrollRaf, { passive: true })
  }

  // Watch for reduced-motion changes at runtime
  watch(reducedMotion, (val) => {
    window.removeEventListener('scroll', onScrollRaf)
    window.removeEventListener('scroll', onScrollDirect)
    if (val) {
      window.addEventListener('scroll', onScrollDirect, { passive: true })
    } else {
      window.addEventListener('scroll', onScrollRaf, { passive: true })
    }
  })
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('scroll', onScrollRaf)
  window.removeEventListener('scroll', onScrollDirect)
})
</script>

<template>
  <!-- Hidden on mobile via CSS — see media query below -->
  <div class="scroll-progress" aria-hidden="true">
    <!-- Track: full viewport height, rule-dark -->
    <div class="scroll-progress__track">
      <!-- Fill: grows from top, gold color -->
      <div ref="fillEl" class="scroll-progress__fill" />
    </div>
  </div>
</template>

<style scoped>
.scroll-progress {
  position: fixed;
  right: 0;
  top: 0;
  width: 1px;
  height: 100vh;
  z-index: 500;
  pointer-events: none;
  /* No border-radius. No box-shadow. */
}

.scroll-progress__track {
  width: 1px;
  height: 100%;
  background: var(--color-rule-dark);
  position: relative;
}

.scroll-progress__fill {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 0%;
  background: var(--color-gold);
  /* No transition — updated synchronously via rAF or scroll event */
}

/* Hidden on mobile: 1px rule is too narrow to be useful at 375px */
@media (max-width: 767px) {
  .scroll-progress {
    display: none;
  }
}
</style>
